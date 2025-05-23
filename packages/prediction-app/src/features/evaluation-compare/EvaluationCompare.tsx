import {
    ComparionPlotWrapper,
    ComparisonPlotList,
    SplitPeriodSelector,
} from '@dhis2-chap/chap-lib'
import {
    EvaluationCompatibleSelector,
    EvaluationSelectorBase,
} from '../select-evaluation/EvaluationSelector'
import React, { useEffect, useMemo } from 'react'
import css from './EvaluationCompare.module.css'
import {
    Help,
    IconArrowLeft16,
    IconArrowRight16,
    IconVisualizationLine24,
    IconVisualizationLineMulti24,
    MultiSelect,
    MultiSelectOption,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import {
    useSelectedEvaluationsController,
    useSelectedOrgUnits,
    useSelectedSplitPoint,
} from './useSelectEvaluations'
import { usePlotDataForEvaluations } from '../../hooks/usePlotDataForEvaluations'
import { useEvaluationOverlap } from '../../hooks/useEvaluationOverlap'
import { useOrgUnitsById } from '../../hooks/useOrgUnitsById'
import PageHeader from '../common-features/PageHeader/PageHeader'
import OrganisationUnitMultiSelect from '../../components/OrganisationUnitsSelect/OrganisationUnitMultiSelect'

const MAX_SELECTED_ORG_UNITS = 10

export const EvaluationCompare = () => {
    const {
        query: evaluationsQuery,
        baseEvaluation,
        comparisonEvaluation,
        setBaseEvaluation,
        setComparisonEvaluation,
    } = useSelectedEvaluationsController()

    const selectedEvaluations = [baseEvaluation, comparisonEvaluation].filter(
        (e) => !!e
    )
    const [selectedOrgUnits, setSelectedOrgUnits] = useSelectedOrgUnits()
    const [selectedSplitPoint, setSelectedSplitPoint] = useSelectedSplitPoint()

    const evaluationOverlap = useEvaluationOverlap({
        baseEvaluation: baseEvaluation?.id,
        comparisonEvaluation: comparisonEvaluation?.id,
    })

    const resolvedSplitPoints = evaluationOverlap.isSuccess
        ? evaluationOverlap.data.splitPeriods
        : baseEvaluation?.splitPeriods ?? []

    const resolvedSelectedSplitPoint =
        selectedSplitPoint ?? resolvedSplitPoints[0]

    const availableOrgUnitIds = evaluationOverlap.isSuccess
        ? evaluationOverlap.data.orgUnits
        : baseEvaluation?.orgUnits ?? []

    const orgUnits = useOrgUnitsById(availableOrgUnitIds)

    console.log({ resolvedSplitPoints })
    const resolvedSelectedOrgUnits =
        selectedOrgUnits?.length > 0 ? selectedOrgUnits : availableOrgUnitIds
    const compatibleSelectedOrgUnits = resolvedSelectedOrgUnits
        .flatMap((ou) => {
            const unit = orgUnits.data?.organisationUnits.find(
                (o) => o.id === ou
            )
            return unit ? [unit] : []
        })
        .slice(0, MAX_SELECTED_ORG_UNITS)

    const noMatchingSplitPeriods =
        evaluationOverlap.isSuccess &&
        evaluationOverlap.data.splitPeriods.length === 0

    const { combined } = usePlotDataForEvaluations(selectedEvaluations, {
        orgUnits: compatibleSelectedOrgUnits.map((ou) => ou.id),
        splitPeriod: resolvedSelectedSplitPoint ?? undefined,
    })

    // reset split period if not compatible
    useEffect(() => {
        if (
            resolvedSelectedSplitPoint &&
            resolvedSplitPoints.length > 0 &&
            !resolvedSplitPoints.some((sp) => sp === selectedSplitPoint)
        ) {
            setSelectedSplitPoint(undefined)
        }
    }, [resolvedSplitPoints, selectedSplitPoint])

    const evaluationsPerOrgUnit = useMemo(() => {
        return combined.viewData
            .filter((v) => v.splitPoint === resolvedSelectedSplitPoint)
            .flatMap((v) =>
                v.evaluation.map((e) => ({
                    ...e,
                    orgUnitName:
                        orgUnits.data?.organisationUnits.find(
                            (ou) => ou.id === e.orgUnitId
                        )?.displayName ?? e.orgUnitId,
                }))
            )
    }, [
        combined.viewData,
        resolvedSelectedSplitPoint,
        orgUnits.data?.organisationUnits,
    ])
    console.log({ data: evaluationsPerOrgUnit, resolvedSelectedSplitPoint })
    return (
        <div className={css.wrapper}>
            <PageHeader
                pageTitle={i18n.t('Compare evaluations')}
                pageDescription={i18n.t(
                    'Compare evaluations to assess model, co-variates and data performance.'
                )}
            />

            <div className={css.selectionToolbar}>
                <div className={css.compareSelectors}>
                    <EvaluationSelectorBase
                        onSelect={(evaluation1) => {
                            setBaseEvaluation(evaluation1?.id.toString())
                        }}
                        selected={baseEvaluation}
                        available={evaluationsQuery.data?.evaluations ?? []}
                        loading={evaluationsQuery.isLoading}
                        placeholder={i18n.t('Select base evaluation')}
                    />
                    <EvaluationCompatibleSelector
                        onSelect={(evaluation2) => {
                            setComparisonEvaluation(evaluation2?.id.toString())
                        }}
                        selected={comparisonEvaluation}
                        compatibleEvaluationId={baseEvaluation?.id}
                    />
                </div>
                <div className={css.selectorRow}>
                    <SplitPeriodSelector
                        prefix={
                            noMatchingSplitPeriods
                                ? i18n.t(
                                      'Evaluations do not share any split periods'
                                  )
                                : i18n.t('Split Period')
                        }
                        splitPeriods={resolvedSplitPoints}
                        selectedSplitPeriod={resolvedSelectedSplitPoint}
                        setSelectedSplitPeriod={setSelectedSplitPoint}
                        filterable
                        noMatchText={i18n.t('No split periods found')}
                        disabled={
                            noMatchingSplitPeriods ||
                            resolvedSplitPoints.length < 1
                        }
                    />
                    <OrganisationUnitMultiSelect
                        prefix={i18n.t('Organisation Units')}
                        selected={compatibleSelectedOrgUnits.map((ou) => ou.id)}
                        disabled={availableOrgUnitIds.length < 1}
                        onSelect={({ selected }) =>
                            setSelectedOrgUnits(selected)
                        }
                        available={orgUnits.data?.organisationUnits ?? []}
                        inputMaxHeight="26px"
                        maxSelections={MAX_SELECTED_ORG_UNITS}
                    />
                </div>
            </div>

            <div>
                {combined.viewData.length > 0 && (
                    <ComparisonPlotList
                        useVirtuoso={false}
                        evaluationPerOrgUnits={evaluationsPerOrgUnit}
                    />
                )}
            </div>
            {selectedEvaluations.length === 0 && <EmptySelection />}
        </div>
    )
}

export default EvaluationCompare

const EmptySelection = () => {
    return (
        <div className={css.emptySelection}>
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
