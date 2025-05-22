import {
    AnalyticsService,
    BackTestRead,
    DataList,
    EvaluationEntry,
    evaluationResultToViewData,
    getSplitPeriod,
} from '@dhis2-chap/chap-lib'
import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'

const quantiles = [0.1, 0.25, 0.5, 0.75, 0.9]

const select = (data: {
    data: [EvaluationEntry[], DataList]
    evaluation: BackTestRead
}) => {
    const [evaluationEntries, actualCases] = data.data
    const splitPeriods = getSplitPeriod(evaluationEntries)

    return {
        evaluationEntries: evaluationEntries.map((e) => ({
            ...e,
            modelName: data.evaluation.name || undefined,
        })),
        actualCases: actualCases.data,
        splitPeriods,
        evaluation: data.evaluation,
    }
}

type UsePlotDataForEvaluationsOptions = {
    splitPeriod?: string
    orgUnits?: string[]
}
const defaultOptions = {
    splitPeriod: undefined,
    orgUnits: undefined,
}
export const usePlotDataForEvaluations = (
    evaluations: BackTestRead[],
    { orgUnits, splitPeriod }: UsePlotDataForEvaluationsOptions = defaultOptions
) => {
    const evaluationQueries = useQueries({
        queries: evaluations.map((evaluation) => ({
            queryKey: [
                'evaluation-entry',
                evaluation.id,
                { splitPeriod, orgUnits },
            ],
            queryFn: async () => {
                const evaluationEntries =
                    AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(
                        evaluation.id,
                        quantiles,
                        splitPeriod,
                        orgUnits
                    )
                const actualCases =
                    AnalyticsService.getActualCasesAnalyticsActualCasesBacktestIdGet(
                        evaluation.id,
                        orgUnits
                    )
                const data = await Promise.all([evaluationEntries, actualCases])
                return {
                    data,
                    evaluation: evaluation,
                }
            },
            select: select,
            enabled: !!evaluation,
            staleTime: 60 * 1000, // Data is considered fresh for 60 seconds
        })),
    })

    const combined = useMemo(() => {
        const realData = evaluationQueries[0]?.data?.actualCases || []
        const allEntries = evaluationQueries.flatMap(
            (q) => q.data?.evaluationEntries || []
        )
        const viewData = evaluationResultToViewData(allEntries, realData)
        const splitPeriods = evaluationQueries.flatMap(
            (q) => q.data?.splitPeriods || []
        )
        return { viewData, splitPeriods }
    }, [evaluationQueries])

    return { queries: evaluationQueries, combined }
}
