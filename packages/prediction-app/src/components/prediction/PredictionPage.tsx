import { useEffect, useRef, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconError24,
    IconDownload24,
    IconArrowRight24,
    Popover,
    Chip,
    IconInfo16,
    IconInfo24,
    IconQuestion24,
} from '@dhis2/ui'
import OrgUnits from './OrgUnits'
import DataElement from './DataElement'
import MonthlyPeriodSelect from './MonthlyPeriodSelect'
import DownloadData from './DownloadData'
import styles from './styles/PredictionPage.module.css'
import OrgUnitLevel from './OrgUnitLevel'
import { ErrorResponse } from './DownloadData'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    DataList,
    DefaultService,
    OpenAPI,
    PredictionResponse,
} from '@dhis2-chap/chap-lib'
import { ModelSpec, PredictionRequest, Feature } from '@dhis2-chap/chap-lib'
import { useConfig } from '@dhis2/app-runtime'
import Period from './Periods'
import { PeriodDimension } from '@dhis2/analytics'
import SelectModel from './SelectModel'
import ModelFeatures from './ModelFeatures'
import { ModelFeatureDataElementMap } from '../../interfaces/ModelFeatureDataElement'
import saveAs from 'file-saver'
import PredictEvaluateHelp from './PredictEvaluateHelp'

const defaultPeriod = {
    startMonth: '2023-04',
    endMonth: '2024-03',
}

const PredictionPage = () => {
    const navigate = useNavigate()

    //IF NOT SUCCESSFUL STATS, SEND USER TO PAGE WHERE ROUTE IS CONFIGURED, BUT NO CONNECTION TO CHAP

    const [selectedModel, setSelectedModel] = useState<ModelSpec | undefined>(
        undefined
    )
    const [
        modelSpesificSelectedDataElements,
        setModelSpesificSelectedDataElements,
    ] = useState<ModelFeatureDataElementMap>(new Map())

    const [orgUnits, setOrgUnits] = useState([])
    const [orgUnitLevel, setOrgUnitLevel] = useState<{
        id: string
        level: number
    }>()

    const [errorMessages, setErrorMessages] = useState<ErrorResponse[]>([])
    const [sendingDataToChap, setSendingDataToChap] = useState<boolean>(false)

    const [jsonResult, setJsonResult] = useState<PredictionRequest | undefined>(
        undefined
    )
    const [selectedPeriodItems, setSelectedPeriodItems] = useState()

    const [startDownload, setStartDownload] = useState<{
        action: 'download' | 'predict' | 'evaluate'
        startDownload: boolean
    }>({ action: 'download', startDownload: false })
    const [renderOptionalField, setRenderOptionalField] = useState<
        boolean | undefined
    >(false)

    //const [emptyFeaturesErrorMsg, setEmptyFeaturesErrorMsg] = useState<string[]>([])
    const [errorChapMsg, setErrorChapMsg] = useState('')

    const isValid = Boolean(
        selectedPeriodItems &&
            (orgUnits.length > 0 || orgUnitLevel == undefined)
    )

    const handleSelectedPeriod = (selectedPeriods: any) => {
        setSelectedPeriodItems(selectedPeriods.items)
    }

    const onSelectModel = (selected: ModelSpec) => {
        setModelSpesificSelectedDataElements(new Map())
        setSelectedModel(selected)
    }

    const onClickDownloadOrPostData = (
        action: 'download' | 'predict' | 'evaluate'
    ) => {
        setJsonResult(undefined)
        setStartDownload({ action: action, startDownload: true })
    }

    const isAnalyticsContentValid = (jsonResult: PredictionRequest) => {
        let emptyFeatures: ErrorResponse[] = []
        jsonResult.features.forEach((f: DataList) => {
            //find the name of the feature
            if (f.data.length == 0) {
                const data_element_name = [
                    ...modelSpesificSelectedDataElements,
                ].find(([k, v]) => v.selectedDataElementId === f.dhis2Id)?.[1]
                    .selectedDataElementName
                const msg =
                    'Data item "' + data_element_name + '" returned no data.'
                emptyFeatures.push({
                    description:
                        'Ensure you have exported the analytics tables in DHIS2.',
                    title: msg,
                })
            }
        })
        if (emptyFeatures.length > 0) {
            setErrorMessages([...errorMessages, ...emptyFeatures])
            return false
        }
        return true
    }

    //triggers when anayltics content is fetched
    useEffect(() => {
        if (jsonResult) {
            setStartDownload((prev) => ({ ...prev, startDownload: false }))

            //if action is "Download", do not do any validation, just download the data
            if (startDownload.action === 'download') {
                downloadData()
                return
            }

            //if action is "Predict" or "Evaluate", check if the analytics contains row
            if (!isAnalyticsContentValid(jsonResult)) return

            setSendingDataToChap(true)

            if (startDownload.action === 'predict') predict()
            if (startDownload.action === 'evaluate') evaluate()
        }
    }, [jsonResult])

    const downloadData = () => {
        let request: PredictionRequest = jsonResult as PredictionRequest
        request.estimator_id = selectedModel?.name

        var fileToSave = new Blob([JSON.stringify(request, null, 2)], {
            type: 'application/json',
        })

        const today = new Date()
        saveAs(fileToSave, 'chap_request_data_' + today.toJSON() + '.json')
    }

    const evaluate = async () => {
        let request: PredictionRequest = jsonResult as PredictionRequest
        request.n_periods = 3
        const nSplits = 10

        await DefaultService.evaluateEvaluatePost(request, nSplits)
            .then((response: any) => {
                setErrorChapMsg('')
                return navigate('/status')
            })
            .catch((error: any) => {
                setErrorChapMsg(error?.body?.detail)
            }).finally(() => {
                setSendingDataToChap(false)
            })
    }

    const predict = async () => {
        let request: PredictionRequest = jsonResult as PredictionRequest
        request.n_periods = 3
        request.estimator_id = selectedModel?.name

        await DefaultService.predictPredictPost(request)
            .then((response: any) => {
                setErrorChapMsg('')
                return navigate('/status')
            })
            .catch((error: any) => {
                
                setErrorChapMsg(error?.body?.detail)
            }).finally(() => {
                setSendingDataToChap(false)
            })
    }

    //checks that all selected orgUnits are on the same level
    function orgUnitsSelectedIsValid() {
        if (orgUnits.length === 0) {
            return true
        }

        const firstElement = (orgUnits[0] as any).path.split('/').length
        return orgUnits.every(
            (innerArray) =>
                (innerArray as any).path.split('/').length === firstElement
        )
    }

    const renderMainForm = () => {
        //if select to use ERA5-Land, and all required fields are selected
        if (
            selectedModel?.features.filter((f) => !f.optional).length ==
                [...modelSpesificSelectedDataElements].filter(
                    ([k, v]) => !v.optional
                ).length &&
            !renderOptionalField
        ) {
            return true
        }
        //if select to use climate data source from DHIS2, and all required fields are selected
        if (
            modelSpesificSelectedDataElements?.size ==
            selectedModel?.features.length
        ) {
            return true
        }
        return false
    }

    return (
        <div className={styles.container}>
            <h1>{i18n.t('Select training data and create prediction')}</h1>

            <SelectModel
                selectedModel={selectedModel}
                setSelectedModel={onSelectModel}
            />
            <ModelFeatures
                setRenderOptionalField={setRenderOptionalField}
                renderOptionalField={renderOptionalField}
                features={selectedModel?.features}
                setModelSpesificSelectedDataElements={
                    setModelSpesificSelectedDataElements
                }
                modelSpesificSelectedDataElements={
                    modelSpesificSelectedDataElements
                }
            />

            {renderMainForm() && (
                <>
                    <OrgUnits orgUnits={orgUnits} setOrgUnits={setOrgUnits} />
                    {!orgUnitsSelectedIsValid() && (
                        <p className={styles.error}>
                            Only select organization units that are one the same
                            level.
                        </p>
                    )}
                    <OrgUnitLevel
                        orgUnitLevels={orgUnitLevel}
                        onChange={setOrgUnitLevel}
                    />

                    <div className={styles.container}>
                        <h3>{i18n.t('Training period')}</h3>

                        <div className={styles.pickers}>
                            <PeriodDimension
                                selectedPeriods={selectedPeriodItems}
                                onSelect={handleSelectedPeriod}
                                excludedPeriodTypes={[]}
                            />
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <Button
                            icon={<IconDownload24 />}
                            loading={startDownload.startDownload}
                            disabled={
                                !isValid ||
                                (startDownload.startDownload &&
                                    startDownload.action === 'download') ||
                                !orgUnitsSelectedIsValid()
                            }
                            onClick={() =>
                                onClickDownloadOrPostData('download')
                            }
                        >
                            Download data
                        </Button>
                        <Button
                            icon={<IconArrowRight24 />}
                            primary
                            loading={sendingDataToChap}
                            disabled={
                                !isValid ||
                                startDownload.startDownload ||
                                !orgUnitsSelectedIsValid()
                            }
                            onClick={() => onClickDownloadOrPostData('predict')}
                        >
                            Predict
                        </Button>
                        <Button
                            icon={<IconArrowRight24 />}
                            primary
                            loading={sendingDataToChap}
                            disabled={
                                !isValid ||
                                startDownload.startDownload ||
                                !orgUnitsSelectedIsValid()
                            }
                            onClick={() =>
                                onClickDownloadOrPostData('evaluate')
                            }
                        >
                            Evaluate
                        </Button>
                    </div>
                    <PredictEvaluateHelp />

                    {<p className={styles.errorChap}>{errorChapMsg}</p>}
                    {startDownload.startDownload && isValid && (
                        <DownloadData
                            setJsonResult={setJsonResult}
                            modelSpesificSelectedDataElements={
                                modelSpesificSelectedDataElements
                            }
                            setStartDownload={setStartDownload}
                            startDownload={startDownload}
                            period={selectedPeriodItems}
                            setErrorMessages={setErrorMessages}
                            orgUnits={orgUnits}
                            orgUnitLevel={
                                orgUnitLevel as { id: string; level: number }
                            }
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
                </>
            )}
        </div>
    )
}

export default PredictionPage
