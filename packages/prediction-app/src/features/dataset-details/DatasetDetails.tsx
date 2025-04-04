import React, { useEffect, useState } from 'react'
import { CrudService, DataSetRead } from '@dhis2-chap/chap-lib';
import { Button, SingleSelectField, SingleSelectOption, CircularLoader, NoticeBox, Card } from '@dhis2/ui';
import styles from './DatasetDetails.module.css'

const PeriodToIso = (periodString : any) => {
    // this should be moved to utils probably
    // or actually just use import { getPeriodNameFromId } from '@dhis2/multi-period-dimension'
    console.log('period', periodString)
    if (!periodString) return 'NA'
    if (periodString.length == 4) {
        return periodString
    }
    if (periodString.length == 6) {
        const year = periodString.slice(0, 4)
        const month = periodString.slice(4, 6)
        return `${year}-${month}`
    }
    if (periodString.length == 5) {
        const year = periodString.slice(0, 4)
        const week = periodString.slice(5, 6)
        return `${year}-W${week}`
    }
}

interface DatasetDetailsProps {
    datasetId : number | undefined
}

const DatasetDetails = ({ datasetId } : DatasetDetailsProps ) => {
    const [datasetSummary, setDatasetSummary] = useState<any>(null)
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [covariates, setCovariates] = useState<[]>([])

    const getDatasetSummary = (dataset : any) => {
        const periods = dataset.observations.map((obs : any) => obs.period)
        const uniquePeriods = Array.from(new Set(periods)).sort() // ensures ascending order
        
        const startPeriod = uniquePeriods[0]
        const endPeriod = uniquePeriods[uniquePeriods.length - 1]

        const uniqueOrgUnits = Array.from(new Set(periods))
        const orgUnitCount = uniqueOrgUnits.length
        
        const covariates = Array.from(
            new Set(
                dataset.observations
                    .map((obs : any) => obs.featureName)
                    .filter((name : string) => name !== "disease_cases") // Exclude target feature
            )
        )

        return {
            name: dataset.name,
            created: dataset.created,
            startPeriod: startPeriod,
            endPeriod: endPeriod,
            orgUnitCount: orgUnitCount,
            covariates: covariates,
        }
    }

    useEffect(() => {
        console.log('datasetid', datasetId)
        if (!datasetId) return

        const fetchData = async () => {
            try {
                console.log('fetching dataset', datasetId)
                const datasetResponse = await CrudService.getDatasetCrudDatasetsDatasetIdGet(datasetId)
                console.log('dataset loaded', datasetResponse)
                const summary = getDatasetSummary(datasetResponse)
                setDatasetSummary(summary)
            } catch (err: any) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [datasetId])

    if (loading) return (
        <div className={styles.datasetLoader}>
            <CircularLoader />
            <span>Loading dataset</span>
        </div>
    )
    if (error) return <p>Error: {error}</p>

    return (
        <Card>
            <div className={styles.datasetDetailsWrapper}>
                <div>
                    <span className={styles.label}>Name: </span>
                    <span>{datasetSummary.name}</span>
                </div>
                <div>
                    <span className={styles.label}>Org Units: </span>
                    <span>{datasetSummary.orgUnitCount}</span>
                </div>
                <div>
                    <span className={styles.label}>Time period: </span>
                    <span>{PeriodToIso(datasetSummary.startPeriod)} to {PeriodToIso(datasetSummary.endPeriod)}</span>
                </div>
                <div>
                    <span className={styles.label}>Covariates: </span>
                    <span>{datasetSummary?.covariates?.join(', ') || 'None'}</span>
                </div>
                <div>
                    <span className={styles.label}>Created: </span>
                    <span>{datasetSummary.created}</span>
                </div>
            </div>
        </Card>
    )
}

export default DatasetDetails