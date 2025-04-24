import React, { useEffect, useState } from 'react'
import {
    AnalyticsService,
    ComparionPlotWrapper,
    CrudService,
    DefaultService,
    EvaluationForSplitPoint,
    EvaluationResponse,
    evaluationResultToViewData,
    getSplitPeriod,
} from '@dhis2-chap/chap-lib'
import styles from './styles/EvaluationResult.module.css'
//import StyledDropzone from './StyledDropzone'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots'
import useOrgUnits from '../../hooks/useOrgUnits'

const EvaluationResult = ({ evaluationId }: any) => {
    //const [evaluation, setEvaluation] = useState<Record<string, Record<string, HighChartsData>> | undefined>(undefined)
    const [httpError, setHttpError] = useState<string>('')
    const [splitPeriods, setSplitPeriods] = useState<string[]>([])
    const [proceededData, setProceededData] =
        useState<EvaluationForSplitPoint[]>()
    const [unProceededData, setUnProceededData] = useState<EvaluationResponse>()
    const [evaluationName, setEvaluationName] = useState<string>('')
    const [modelName, setModelName] = useState<string>('')
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

    const fetchEvaluationInfo = async (evaluationId: number) => {
        const evaluations = await CrudService.getBacktestsCrudBacktestsGet()
        let evaluationInfo = undefined
        evaluations.forEach((e) => {
            if (e.id == evaluationId) {
                evaluationInfo = e
            }
        })
        return evaluationInfo
    }

    const fetchModelByName = async (modelName: string) => {
        const models = await CrudService.listModelsCrudModelsGet()
        let model = undefined
        models.forEach((m) => {
            if (m.name == modelName) {
                model = m
            }
        })
        return model
    }

    const fetchEvaluation = async () => {
        setIsLoading(true)
        //setHttpError(undefined)

        const quantiles = [0.1, 0.25, 0.5, 0.75, 0.9]

        try {
            const [evaluationInfo, evaluationEntries, actualCases] =
                await Promise.all([
                    fetchEvaluationInfo(evaluationId),
                    AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(
                        evaluationId,
                        quantiles
                    ),
                    AnalyticsService.getActualCasesAnalyticsActualCasesBacktestIdGet(
                        evaluationId
                    ),
                ])

            // Set evaluation name
            setEvaluationName(evaluationInfo.name)

            // Set model name
            const modelInfo = await fetchModelByName(evaluationInfo.modelId)
            setModelName(modelInfo.displayName)

            // Merge and send to state
            const mergedResponse: EvaluationResponse = {
                predictions: evaluationEntries,
                actualCases: actualCases,
            }

            setUnProceededData(mergedResponse)
        } catch (err: any) {
            setHttpError(err.toString())
        } finally {
            setIsLoading(false)
        }
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
                    evaluationName={evaluationName}
                    modelName={modelName}
                    evaluations={proceededData}
                    splitPeriods={splitPeriods}
                />
            )}
        </div>
    )
}

export default EvaluationResult
