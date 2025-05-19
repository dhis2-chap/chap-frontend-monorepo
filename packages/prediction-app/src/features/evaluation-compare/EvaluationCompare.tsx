import {
    AnalyticsService,
    BackTestRead,
    ComparionPlotWrapper,
    DataList,
    EvaluationEntry,
    evaluationResultToViewData,
    getSplitPeriod,
    SplitPeriodSelector,
} from '@dhis2-chap/chap-lib'
import {
    EvaluationCompatibleSelector,
    EvaluationSelector,
} from '../select-evaluation/EvaluationSelector'
import React, { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import css from './EvaluationCompare.module.css'
import {
    IconArrowLeft16,
    IconArrowRight16,
    IconVisualizationLine24,
    IconVisualizationLineMulti24,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

const quantiles = [0.1, 0.25, 0.5, 0.75, 0.9]

const select = (data: {
    data: [EvaluationEntry[], DataList]
    evaluation: BackTestRead
}) => {
    const [evaluationEntries, actualCases] = data.data
    const splitPeriods = getSplitPeriod(evaluationEntries)
    const viewData = evaluationResultToViewData(
        evaluationEntries.map((e) => ({
            ...e,
            modelName: data.evaluation.name || undefined,
        })),
        actualCases.data,
        data.evaluation.id.toString()
    )

    return {
        evaluationEntries: evaluationEntries.map((e) => ({
            ...e,
            modelName: data.evaluation.name || undefined,
        })),
        actualCases: actualCases.data,
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
                const evaluationEntries =
                    AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(
                        evaluation.id,
                        quantiles
                    )
                const actualCases =
                    AnalyticsService.getActualCasesAnalyticsActualCasesBacktestIdGet(
                        evaluation.id
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
        const viewData = evaluationResultToViewData(allEntries, realData!)
        const splitPeriods = evaluationQueries.flatMap(
            (q) => q.data?.splitPeriods || []
        )
        return { viewData, splitPeriods }
    }, [evaluationQueries])
    return { queries: evaluationQueries, combined }
}

export const EvaluationCompare = () => {
    const [evaluations, setEvaluations] = React.useState<
        (BackTestRead | undefined)[]
    >([])

    const [splitPeriod, setSplitPeriod] = React.useState<string | undefined>()
    const { queries, combined } = usePlotDataForEvaluations(
        evaluations.filter((e) => !!e)
    )

    const [searchParams, setSearchParams] = useSearchParams()
    
    const isComparisonSelected =
        evaluations.length > 1 &&
        evaluations[0] != undefined &&
        evaluations[1] != undefined
    const splitPeriods = useQuery({
        queryKey: ['split-periods', evaluations.map((e) => e?.id)],
        queryFn: () => {
            return AnalyticsService.getBacktestOverlapAnalyticsBacktestOverlapBacktestId1BacktestId2Get(
                evaluations[0]?.id,
                evaluations[1]?.id
            )
        },
        enabled: isComparisonSelected,
    })

    console.log({
        viewData: combined.viewData,
        splitPeriods: combined.splitPeriods,
    })
    const noMatchingSplitPeriods =
        splitPeriods.isSuccess && splitPeriods.data.splitPeriods.length === 0
    return (
        <div className={css.wrapper}>
            <div className={css.compareSelectors}>
                <EvaluationSelector
                    onSelect={(evaluation1) => {
                        setEvaluations((prev) => [
                            evaluation1,
                            ...prev.slice(1),
                        ])
                        setSearchParams(
                            (prev) => ({
                                ...prev,
                                baseEvaluation: evaluation1?.id.toString(),
                            }),
                            { replace: true }
                        )
                    }}
                    selected={evaluations[0]}
                />
                <EvaluationCompatibleSelector
                    onSelect={(evaluation2) => {
                        setEvaluations((prev) => [
                            ...prev.slice(0, 1),
                            evaluation2,
                        ])
                        setSearchParams(
                            (prev) => ({
                                ...prev,
                                baseEvaluation: evaluations[0]?.id.toString(),
                                comparisonEvaluation: [
                                    evaluation2?.id.toString(),
                                    evaluation2?.id.toString(),
                                ],
                            }),
                            { replace: true }
                        )
                    }}
                    selected={evaluations[1]}
                    compatibleEvaluationId={evaluations[0]?.id}
                />
            </div>
            {splitPeriods.data?.splitPeriods && (
                <SplitPeriodSelector
                    prefix={
                        noMatchingSplitPeriods
                            ? 'Evaluations do not share any split periods'
                            : 'Split Period'
                    }
                    inputWidth="350px"
                    splitPeriods={
                        splitPeriods.data?.splitPeriods.filter((s) => !!s) || []
                    }
                    selectedSplitPeriod={splitPeriod || ''}
                    setSelectedSplitPeriod={setSplitPeriod}
                    filterable
                    noMatchText={'No split periods found'}
                    disabled={
                        !splitPeriods.data?.splitPeriods ||
                        noMatchingSplitPeriods
                    }
                />
            )}
            <div>
                {combined.viewData.length > 0 &&
                    combined.splitPeriods.length > 0 && (
                        // <ComparisonPlotList evaluationPerOrgUnits={combined.viewData.map(vd => vd.evaluation.map(e => e.))} />
                        <ComparionPlotWrapper
                            evaluationName="test"
                            modelName="test"
                            evaluations={combined.viewData}
                            splitPeriods={combined.splitPeriods}
                        />
                    )}
            </div>
            {evaluations.length === 0 && <EmptySelection />}
        </div>
    )
}

export default EvaluationCompare

const EmptySelection = () => {
    return (
        <div className={css.emptySelection}>
            <h2>{i18n.t('Compare evaluations')}</h2>
            <div className={css.iconGroup}>
                <IconVisualizationLine24 />
                <div className={css.arrowIcons}>
                    <IconArrowRight16 />
                    <IconArrowLeft16 />
                </div>
                <IconVisualizationLineMulti24 />
            </div>
            <div className={css.textGroup}>
                <p>
                    {i18n.t(`Select two evaluations to compare their results. The
                    selected evaluations must be compatible.`)}
                </p>
                <p>
                    {i18n.t(
                        `Compatible evaluations have overlapping organisation units and split periods.`
                    )}
                </p>
            </div>
        </div>
    )
}
