import { useEffect, useMemo } from 'react'
import {
    useSelectedEvaluationsController,
    useSelectedOrgUnits,
    useSelectedSplitPeriod,
} from './useSearchParamSelections'
import { useEvaluationOverlap } from '../../hooks/useEvaluationOverlap'
import { useOrgUnitsById } from '../../hooks/useOrgUnitsById'

export const useCompareSelectionController = ({
    maxSelectedOrgUnits = 10,
} = {}) => {
    const {
        query: evaluationsQuery,
        baseEvaluation,
        comparisonEvaluation,
        setBaseEvaluation,
        setComparisonEvaluation,
    } = useSelectedEvaluationsController()

    const selectedEvaluations = useMemo(
        () => [baseEvaluation, comparisonEvaluation].filter((e) => !!e),
        [baseEvaluation, comparisonEvaluation]
    )

    const [selectedSplitPeriod, setSelectedSplitPeriod] = useSelectedSplitPeriod()

    const evaluationOverlap = useEvaluationOverlap({
        baseEvaluation: baseEvaluation?.id,
        comparisonEvaluation: comparisonEvaluation?.id,
    })

    const resolvedSplitPeriods = evaluationOverlap.isSuccess
        ? evaluationOverlap.data.splitPeriods
        : baseEvaluation?.splitPeriods ?? []

    const resolvedSelectedSplitPeriod =
        selectedSplitPeriod ?? resolvedSplitPeriods[0]

    const { availableOrgUnitIds, availableOrgUnitSet } = useMemo(() => {
        const availableOrgUnitIds = evaluationOverlap.data
            ? evaluationOverlap.data.orgUnits
            : baseEvaluation?.orgUnits ?? []
        return {
            availableOrgUnitIds,
            availableOrgUnitSet: new Set(availableOrgUnitIds),
        }
    }, [evaluationOverlap.data, baseEvaluation?.orgUnits])

    const orgUnits = useOrgUnitsById(availableOrgUnitIds)

    const [selectedOrgUnits, setSelectedOrgUnits] = useSelectedOrgUnits({
        initialValue: availableOrgUnitIds.slice(0, maxSelectedOrgUnits),
    })

    const compatibleSelectedOrgUnits = useMemo(
        () => selectedOrgUnits.filter((ou) => availableOrgUnitSet.has(ou)),
        [selectedOrgUnits, availableOrgUnitSet]
    )

    const hasNoMatchingSplitPeriods =
        evaluationOverlap.isSuccess &&
        evaluationOverlap.data.splitPeriods.length === 0

    // reset split period if not compatible
    useEffect(() => {
        if (
            resolvedSelectedSplitPeriod &&
            resolvedSplitPeriods.length > 0 &&
            !resolvedSplitPeriods.some((sp) => sp === selectedSplitPeriod)
        ) {
            setSelectedSplitPeriod(undefined)
        }
    }, [resolvedSplitPeriods, selectedSplitPeriod])

    return {
        selectedEvaluations,
        baseEvaluation,
        comparisonEvaluation,
        selectedSplitPeriod: resolvedSelectedSplitPeriod,
        selectedOrgUnits: compatibleSelectedOrgUnits,
        evaluations: evaluationsQuery.data,
        splitPeriods: resolvedSplitPeriods,
        orgUnits: orgUnits.data?.organisationUnits,
        hasNoMatchingSplitPeriods,
        setBaseEvaluation,
        setComparisonEvaluation,
        setSelectedOrgUnits,
        setSelectedSplitPeriod,
    }
}
