import {
    AnalyticsService,
    BackTestRead,
    CrudService,
    DataList,
    EvaluationEntry,
    evaluationResultToViewData,
    getSplitPeriod,
    SplitPeriodSelector,
} from '@dhis2-chap/chap-lib'
import EvaluationSelector from '../features/select-evaluation/EvaluationSelector'
import React from 'react'
import { useQueries, useQuery, UseQueryOptions } from '@tanstack/react-query'

const quantiles = [0.1, 0.25, 0.5, 0.75, 0.9]

const select = (data: {
    data: [EvaluationEntry[], DataList]
    evaluation: BackTestRead
}) => {
    console.log({ data })
    const [evaluationEntries, actualCases] = data.data
    const splitPeriods = getSplitPeriod(evaluationEntries)
    const viewData = evaluationResultToViewData(
        evaluationEntries,
        actualCases.data
    )

    return {
        evaluationEntries,
        actualCases,
        splitPeriods,
        viewData,
        evaluation: data.evaluation,
    }
}
const usePlotDataForEvaluations = (evaluations: BackTestRead[]) => {
    const evaluationQueries = useQueries({
        queries: evaluations.map((evaluation) => ({
            queryKey: ['evaluation-entry', evaluation.id],
            queryFn: async () => {
                const predictions =
                    AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(
                        evaluation.id,
                        quantiles
                    )
                const actualCases =
                    AnalyticsService.getActualCasesAnalyticsActualCasesBacktestIdGet(
                        evaluation.id
                    )
                const data = await Promise.all([predictions, actualCases])
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

    return evaluationQueries
}

export const EvaluationCompare = () => {
    const [evaluations, setEvaluations] = React.useState<
        (BackTestRead | undefined)[]
    >([])

    const [splitPeriod, setSplitPeriod] = React.useState<string | undefined>()
    const queries = usePlotDataForEvaluations(evaluations.filter((e) => !!e))
    const splitPeriods = useQuery({
        queryKey: ['split-periods', evaluations.map((e) => e?.id)],
        queryFn: () => {
            return AnalyticsService.getBacktestOverlapAnalyticsBacktestOverlapBacktestId1BacktestId2Get(
                evaluations[0]?.id,
                evaluations[1]?.id
            )
        },
        enabled: !!evaluations.length,
    })
    console.log('Queries:', queries)
    console.log({ splitPeriods })
    return (
        <div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <EvaluationSelector
                    onSelect={(evaluation1) => {
                        setEvaluations((prev) => [
                            evaluation1,
                            ...prev.slice(1),
                        ])
                    }}
                    selected={evaluations[0]}
                />
                <EvaluationSelector
                    onSelect={(evaluation2) => {
                        setEvaluations((prev) => [
                            ...prev.slice(0, 1),
                            evaluation2,
                        ])
                    }}
                    selected={evaluations[1]}
                />
            </div>
            {splitPeriods.data?.splitPeriods && <SplitPeriodSelector
                splitPeriods={splitPeriods.data?.splitPeriods.filter(s => !!s) || []}
                selectedSplitPeriod={splitPeriod || ''}
                setSelectedSplitPeriod={setSplitPeriod}
            />}
            <div>
                <h1>Evaluation Compare</h1>
                <p>Compare different evaluations here.</p>
                <p>Use the selector above to choose an evaluation.</p>
            </div>
        </div>
    )
}

export default EvaluationCompare
