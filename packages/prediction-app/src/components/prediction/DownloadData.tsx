import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useAnalyticRequest from '../../hooks/useAnalyticRequest'
import useGeoJson from '../../hooks/useGeoJson'
import { ModelFeatureDataElementMap } from '../../interfaces/ModelFeatureDataElement'
import styles from './styles/DownloadData.module.css'

interface DownloadDataProps {
    period: any
    orgUnitLevel: { id: string; level: number }
    orgUnits: { id: string; displayName: string }[]
    modelSpesificSelectedDataElements: ModelFeatureDataElementMap

    setStartDownload: Dispatch<
        SetStateAction<{
            action: 'download' | 'predict' | 'evaluate'
            startDownlaod: boolean
        }>
    >
    setErrorMessages(errorMessages: ErrorResponse[]): void
    startDownload: {
        action: 'download' | 'predict' | 'evaluate'
        startDownlaod: boolean
    }
    setJsonResult: (result: any) => void
}

export interface ErrorResponse {
    description: any
    title: string
}

const DownloadData = ({
    period,
    setStartDownload,
    orgUnitLevel,
    orgUnits,
    modelSpesificSelectedDataElements,
    setErrorMessages,
    setJsonResult,
}: DownloadDataProps) => {
    //Concat selected orgUnits (either national, a district, chiefdom or facility) with the id of selected levels (districts, chiefdoms, facilities)
    const mergedOrgUnits =
        'LEVEL-' +
        orgUnitLevel.id +
        ';' +
        orgUnits.map((ou: any) => ou.id).join(';')

    const flatternDhis2Periods = (periods: { id: string; name: string }[]) => {
        return periods.map((period) => period.id)
    }

    const {
        data: analyticData,
        error: analyticError,
        loading: analyticLoading,
    } = useAnalyticRequest(
        modelSpesificSelectedDataElements,
        flatternDhis2Periods(period),
        mergedOrgUnits
    )
    const {
        data: geoJson,
        error: geoJsonError,
        loading: geoJsonLoading,
    } = useGeoJson(orgUnitLevel.level, orgUnits)

    const createRequest = () => {
        return {
            features: analyticData,
            orgUnitsGeoJson: geoJson,
        }
    }

    useEffect(() => {
        //if one of the data is still loading, return
        if (analyticLoading || geoJsonLoading) return
        //All data is fetched
        if (analyticData && geoJson) {
            setErrorMessages([])
            setJsonResult(createRequest())
        }

        //if an error occured
        if (analyticError || geoJsonError) {
            const errorMessages: ErrorResponse[] = []

            analyticError &&
                errorMessages.push({
                    description: JSON.stringify(analyticError),
                    title: 'Analytics request failed',
                })
            geoJsonError &&
                errorMessages.push({
                    description: JSON.stringify(geoJsonError),
                    title: 'OrgUnits request failed',
                })
            setErrorMessages(errorMessages)
            setStartDownload((prev) => ({ ...prev, startDownload: false }))
        }
    }, [analyticLoading, geoJsonLoading])

    return <p className={styles.text}>Downloading data..</p>
}

export default DownloadData
