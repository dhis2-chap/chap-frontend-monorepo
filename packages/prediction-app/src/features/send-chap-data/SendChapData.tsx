import React, { useEffect, useState } from 'react'
import DownloadAnalyticsData from './components/DownloadData/DownloadAnalyticsData'
import {
    AnalyticsService,
    CrudService,
    DataList,
    DatasetCreate,
    DatasetMakeRequest,
    FeatureCollectionModel,
    FetchRequest,
    JobResponse,
    MakePredictionRequest,
    ModelSpec,
    ModelSpecRead,
    ObservationBase,
    PredictionCreate,
} from '@dhis2-chap/chap-lib'
import { ModelFeatureDataElementMap } from '../../interfaces/ModelFeatureDataElement'
import { ErrorResponse } from './interfaces/ErrorResponse'
import saveAs from 'file-saver'
import { IconError24 } from '@dhis2/ui'
import styles from './SendChapData.module.css'
import SendOrDownloadButtons from './components/SendOrDownloadButtons/SendOrDownloadButtons'
import { IOrgUnitLevel, OrgUnit } from '../orgunit-selector/interfaces/orgUnit'
import { Period } from '../timeperiod-selector/interfaces/Period'
import { Datalayer, DatasetLayer } from '../new-dataset/interfaces/DataSetLayer'
import { time } from 'console'
import { data } from 'react-router-dom'
import { useConfig } from '@dhis2/app-runtime'

interface SendChapDataProps {
    onSendAction: 'predict' | 'new-dataset'
    selectedPeriodItems: Period[]
    selectedOrgUnits: OrgUnit[]
    orgUnitLevel: IOrgUnitLevel | undefined
    dataLayers: DatasetLayer[]
    name: string | undefined
    selectedModel?: ModelSpecRead | undefined
    onDrawerSubmit: () => void
}

export const SendChapData = ({
    onSendAction,
    onDrawerSubmit,
    selectedModel,
    name: datasetName,
    selectedPeriodItems,
    selectedOrgUnits: selectedOrgUnits,
    orgUnitLevel,
    dataLayers,
}: SendChapDataProps) => {
    //States applies for both "predict" and "new-dataset"
    const [startDownload, setStartDownload] = useState<{
        action: 'download' | 'predict' | 'new-dataset'
        startDownload: boolean
    }>({ action: 'download', startDownload: false })

    //Keeping the analytics content (including geojson), before sending to CHAP
    const [observations, setObservations] = useState<
        ObservationBase[] | undefined
    >(undefined)
    const [geoJSON, setGeoJSON] = useState<FeatureCollectionModel | undefined>()
    const [analyticsMetaData, setAnalyticsMetaData] = useState<{
        [key: string]: { name: string }
    }>({})
    const analyticsDataLayers: DatasetLayer[] = dataLayers.filter(
        (dataLayer) => dataLayer.origin === 'dataItem'
    )

    const [featureDataItemMapper, setFeatureDataItemMapper] = useState<
        { featureName: string; dataItemId: string }[]
    >([])

    //State for validation, request status etc..
    const [errorMessages, setErrorMessages] = useState<ErrorResponse[]>([])
    const [errorChapMsg, setErrorChapMsg] = useState('')

    const formValid = () => {
        if (orgUnitLevel === undefined) return false
        if (selectedOrgUnits.length == 0) return false
        if (selectedPeriodItems.length == 0) return false
        if (datasetName === '') return false
        if (selectedPeriodItems.length == 0) return false
        if (dataLayers.length == 0) return false
        if (
            dataLayers.some(
                (v: DatasetLayer) =>
                    v.feature === '' || v.dataSource === '' || v.origin === ''
            )
        )
            return false
        return true
    }

    //This will render the DownloadAnalyticsData components, which will fetch the analytics content from DHIS2
    const onClickDownloadOrPostData = (
        action: 'download' | 'predict' | 'new-dataset'
    ) => {
        setObservations(undefined)
        setGeoJSON(undefined)
        setErrorMessages([])
        setStartDownload({ action: action, startDownload: true })
    }

    //Triggered when anayltics content is fetched
    useEffect(() => {
        if (observations && geoJSON) {
            setErrorChapMsg('')
            setStartDownload((prev) => ({ ...prev, startDownload: false }))

            //if action is "download", do not do any validation
            if (startDownload.action === 'download') {
                downloadData()
                return
            }

            //if action is "predict" or "new-dataset", check if the analytics contains row
            if (isAnalyticsContentIsEmpty(observations)) return

            if (startDownload.action === 'predict') predict()
            if (startDownload.action === 'new-dataset') newDataset()
        }
    }, [observations, geoJSON])

    const climateHasMissingData = (
        allData: ObservationBase[],
        emptyFeatures: ErrorResponse[],
        covariate: string,
        covariateDisplayName: string
    ) => {
        const missingData: {
            orgUnitName: string
            period: string
            covariate: string
        }[] = []

        //get uniqe orgunit out of allData
        const uniqueOrgUnits = [...new Set(allData.map((d) => d.orgUnit))]

        selectedPeriodItems.forEach((per) => {
            uniqueOrgUnits.forEach((orgUnit) => {
                let isMissing = true
                allData
                    .filter((d) => d.featureName === covariate)
                    .forEach((f) => {
                        if (per.id == f.period) {
                            isMissing = false
                            return
                        }
                    })
                if (isMissing) {
                    missingData.push({
                        covariate: covariateDisplayName,
                        orgUnitName: analyticsMetaData[orgUnit]?.name || '',
                        period: per.id,
                    })
                }
            })
        })

        if (missingData.length > 0) {
            emptyFeatures.push({
                title:
                    covariateDisplayName +
                    ' is missing for det following orgUnit and timeperiods: ',
                description: (
                    <div>
                        <div className={styles.scrollMissingData}>
                            <p>
                                Total missing: {missingData.length} | Use the{' '}
                                <a
                                    target="_blank"
                                    href={
                                        config?.systemInfo?.contextPath +
                                        '/api/apps/climate-data/index.html#/import'
                                    }
                                >
                                    Climate App
                                </a>{' '}
                                to import climate data
                            </p>
                            <table className={styles.notFoundDataTable}>
                                <thead>
                                    <tr>
                                        <th>OrgUnit</th>
                                        <th>Timeperiod</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {missingData.map((d) => {
                                        return (
                                            <tr>
                                                <td>{d.orgUnitName}</td>
                                                <td>{d.period}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ),
            })
        }
    }

    //Check if the analytics content is empty, before sending it to CHAP
    const isAnalyticsContentIsEmpty = (observations: ObservationBase[]) => {
        let emptyFeatures: ErrorResponse[] = []

        dataLayers
            .filter((o) => o.origin == 'dataItem')
            .forEach((f: DatasetLayer) => {
                //find the name of the feature
                if (
                    observations.filter(
                        (v: ObservationBase) => v.featureName === f.feature
                    )?.length === 0
                ) {
                    const msg =
                        'Thes selected data item for covarate "' +
                        f.feature +
                        '" returned no data.'
                    emptyFeatures.push({
                        description:
                            'Ensure you have exported the analytics tables in DHIS2.',
                        title: msg,
                    })
                }
            })

        if (
            dataLayers.find(
                (o) => o.feature === 'rainfall' && o.origin == 'dataItem'
            )
        ) {
            climateHasMissingData(
                observations,
                emptyFeatures,
                'rainfall',
                'Rainfall'
            )
        }
        if (
            dataLayers.find(
                (o) =>
                    o.feature === 'mean_temperature' && o.origin == 'dataItem'
            )
        ) {
            climateHasMissingData(
                observations,
                emptyFeatures,
                'mean_temperature',
                'Mean Temperature'
            )
        }

        if (emptyFeatures.length > 0) {
            setErrorMessages([...errorMessages, ...emptyFeatures])
            return true
        }
        return false
    }

    const config = useConfig()

    const getMetadate = () => {
        return {
            userId: config?.systemInfo?.systemId || 'Unknown',
            appVersion: config?.appVersion?.full || 'Unknown',
            dhis2Version: config?.systemInfo?.version || 'Unknown',
            dataItemMapper: featureDataItemMapper,
        }
    }

    const getCommonRequestData = () => {
        return {
            name: datasetName as string,
            dataToBeFetched: getDataToBeFetched(),
            metaData: getMetadate(),
            providedData: observations as ObservationBase[],
            geojson: geoJSON as FeatureCollectionModel,
        }
    }

    const getNewDatasetRequest = (): DatasetMakeRequest => {
        return getCommonRequestData()
    }

    const getPredictionRequest = (): MakePredictionRequest => {
        return {
            //could consider to remove later
            type: 'predict',
            modelId: selectedModel?.name as string,
            ...getCommonRequestData(),
        }
    }

    const getDataToBeFetched = (): FetchRequest[] => {
        return dataLayers
            .filter((dl) => dl.origin === 'CHAP')
            .map((v: DatasetLayer) => {
                return {
                    dataSourceName: v.dataSource,
                    featureName: v.feature,
                } as FetchRequest
            })
    }

    const newDataset = async () => {
        let request: DatasetMakeRequest = getNewDatasetRequest()

        await AnalyticsService.makeDatasetAnalyticsMakeDatasetPost(request)
            .then((response: JobResponse) => {
                setErrorChapMsg('')
                onDrawerSubmit()
            })
            .catch((error: any) => {
                if (error?.body?.detail)
                    setErrorChapMsg(JSON.stringify(error?.body?.detail))
                else
                    setErrorChapMsg(
                        'An error occured while sending the request to CHAP Core.'
                    )
            })
    }

    const predict = async () => {
        let request: MakePredictionRequest = getPredictionRequest()

        await AnalyticsService.makePredictionAnalyticsMakePredictionPost(
            request
        )
            .then((response: JobResponse) => {
                onDrawerSubmit()
            })
            .catch((error: any) => {
                if (error?.body?.detail)
                    setErrorChapMsg(JSON.stringify(error?.body?.detail))
                else
                    setErrorChapMsg(
                        'An error occured while sending the request to CHAP Core.'
                    )
            })
    }

    const downloadData = () => {
        let content = {}

        if (onSendAction === 'predict') {
            content = getPredictionRequest()
        }
        if (onSendAction === 'new-dataset') {
            content = getNewDatasetRequest()
        }

        var fileToSave = new Blob([JSON.stringify(content, null, 2)], {
            type: 'application/json',
        })

        const today = new Date()
        saveAs(
            fileToSave,
            onSendAction.replaceAll('-', '_') +
                '_chap_request_data_' +
                today.toJSON() +
                '.json'
        )
    }

    return (
        <div>
            <SendOrDownloadButtons
                formValid={formValid()}
                onButtonSendAction={onSendAction}
                onClickDownloadOrPostData={onClickDownloadOrPostData}
                orgUnits={selectedOrgUnits}
                startDownload={startDownload}
            />

            {<p className={styles.errorChap}>{errorChapMsg}</p>}
            {startDownload.startDownload && formValid() && (
                <DownloadAnalyticsData
                    setAnalyticsMetaData={setAnalyticsMetaData}
                    setFeatureDataItemMapper={setFeatureDataItemMapper}
                    model_id={selectedModel?.name}
                    setObservations={setObservations}
                    setGeoJSon={setGeoJSON}
                    analyticsDataLayers={analyticsDataLayers}
                    startDownload={startDownload}
                    setStartDownload={setStartDownload}
                    selectedPeriodItems={selectedPeriodItems}
                    setErrorMessages={setErrorMessages}
                    selectedOrgUnits={selectedOrgUnits}
                    orgUnitLevel={orgUnitLevel}
                />
            )}

            {errorMessages.map((error: ErrorResponse, index) => (
                <div key={index} className={styles.errorBar}>
                    <div className={styles.errorHeader}>
                        <IconError24 />
                        <span>{error.title}</span>
                    </div>
                    <span className={styles.detailedError}>
                        {error.description}
                    </span>
                </div>
            ))}
        </div>
    )
}
