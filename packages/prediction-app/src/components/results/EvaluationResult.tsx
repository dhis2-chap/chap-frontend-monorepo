import React, { useEffect, useState } from 'react'
import {
    ComparionPlotWrapper,
    DefaultService,
    EvaluationForSplitPoint,
    EvaluationResponse,
    evaluationResultToViewData,
    getSplitPeriod,
} from '@dhis2-chap/chap-lib'
import styles from './styles/EvaluationResult.module.css'
import StyledDropzone from './StyledDropzone'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots'
import useOrgUnits from '../../hooks/useOrgUnits'

const EvaluationResult = () => {
    //const [evaluation, setEvaluation] = useState<Record<string, Record<string, HighChartsData>> | undefined>(undefined)
    const [httpError, setHttpError] = useState<string>('')
    const [splitPeriods, setSplitPeriods] = useState<string[]>([])
    const [proceededData, setProceededData] =
        useState<EvaluationForSplitPoint[]>()
    const [unProceededData, setUnProceededData] = useState<EvaluationResponse>()
    const [isLoading, setIsLoading] = useState(false)

    const { orgUnits, error, loading } = useOrgUnits()

    useEffect(() => {
        if (orgUnits && unProceededData) {
            const processedData = evaluationResultToViewData(
                unProceededData.predictions,
                unProceededData.actualCases.data,
                ''
            )

            //fill with orgUnitName
            processedData.forEach((evaluationPerSplitPoint) => {
                evaluationPerSplitPoint.evaluation.forEach(
                    (evaluationPerOrgUnit) => {
                        const orgUnitName = orgUnits?.organisationUnits.find(
                            (root: { displayName: string; id: string }) =>
                                root.id === evaluationPerOrgUnit.orgUnitId
                        )
                        if (orgUnitName) {
                            evaluationPerOrgUnit.orgUnitName =
                                orgUnitName.displayName
                        }
                    }
                )
            })

            setProceededData(processedData)
            setSplitPeriods(getSplitPeriod(unProceededData.predictions))
        }
    }, [orgUnits, unProceededData])

    const fetchEvaluation = async () => {
        setIsLoading(true)
        await DefaultService.getEvaluationResultsGetEvaluationResultsGet()
            .then((response: EvaluationResponse) => {
                setUnProceededData(response)
                //add id to process data
            })
            .catch((err: any) => {
                setHttpError(err.toString())
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchEvaluation()
    }, [])

    return (
        <div>
            {httpError && <p>Not available</p>}
            {isLoading && <p>Loading..</p>}

            {proceededData && (
                <ComparionPlotWrapper
                    evaluations={proceededData}
                    splitPeriods={splitPeriods}
                />
            )}
        </div>
    )
}

export default EvaluationResult
