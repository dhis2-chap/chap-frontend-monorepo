import { ComparionPlotWrapper, SplitPeriodSelector } from '@dhis2-chap/chap-lib'
import {
    EvaluationCompatibleSelector,
    EvaluationSelectorBase,
} from '../select-evaluation/EvaluationSelector'
import React, { useEffect } from 'react'
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
    useSelectedSplitPeriod,
} from './useSelectEvaluations'
import { usePlotDataForEvaluations } from '../../hooks/usePlotDataForEvaluations'
import { useEvaluationOverlap } from '../../hooks/useEvaluationOverlap'
import { useOrgUnitsById } from '../../hooks/useOrgUnitsById'
import PageHeader from '../common-features/PageHeader/PageHeader'

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
    const [selectedSplitPeriod, setSelectedSplitPeriod] =
        useSelectedSplitPeriod()

    const evaluationOverlap = useEvaluationOverlap({
        baseEvaluation: baseEvaluation?.id,
        comparisonEvaluation: comparisonEvaluation?.id,
    })

    const { combined } = usePlotDataForEvaluations(selectedEvaluations, {
        orgUnits: evaluationOverlap.data?.orgUnits.map((ou) => ou),
        // splitPeriod: selectedSplitPeriod,
    })

    const availableOrgUnitIds = evaluationOverlap.isSuccess
        ? evaluationOverlap.data.orgUnits
        : baseEvaluation?.orgUnits ?? []

    const orgUnits = useOrgUnitsById(availableOrgUnitIds)

    const compatibleSelectedOrgUnits = selectedOrgUnits
        .flatMap((ou) => {
            const unit = orgUnits.data?.organisationUnits.find(
                (o) => o.id === ou
            )
            return unit ? [unit] : []
        })
        .slice(0, MAX_SELECTED_ORG_UNITS)

    const resolvedSplitPeriods = evaluationOverlap.isSuccess
        ? evaluationOverlap.data.splitPeriods
        : combined.splitPeriods

    const noMatchingSplitPeriods =
        evaluationOverlap.isSuccess &&
        evaluationOverlap.data.splitPeriods.length === 0

    // reset split period if not compatible
    useEffect(() => {
        if (
            selectedSplitPeriod &&
            resolvedSplitPeriods.length > 0 &&
            !resolvedSplitPeriods.some((sp) => sp === selectedSplitPeriod)
        ) {
            setSelectedSplitPeriod(undefined)
        }
    }, [resolvedSplitPeriods, selectedSplitPeriod])

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
                        splitPeriods={resolvedSplitPeriods}
                        selectedSplitPeriod={
                            selectedSplitPeriod || resolvedSplitPeriods[0] || ''
                        }
                        setSelectedSplitPeriod={setSelectedSplitPeriod}
                        filterable
                        noMatchText={i18n.t('No split periods found')}
                        disabled={noMatchingSplitPeriods || resolvedSplitPeriods.length < 1}
                    />
                    <MultiSelect
                        prefix={i18n.t('Organisation Units')}
                        selected={compatibleSelectedOrgUnits.map((ou) => ou.id)}
                        disabled={availableOrgUnitIds.length < 1}
                        onChange={({ selected }) => {
                            console.log({ selected })
                            setSelectedOrgUnits(selected)
                        }}
                        inputMaxHeight="26px"
                    >
                        {compatibleSelectedOrgUnits.length >=
                            MAX_SELECTED_ORG_UNITS && (
                            <Help>
                                {i18n.t(
                                    'You cannot select more than {{max}} organisation units at a time',
                                    {
                                        max: MAX_SELECTED_ORG_UNITS,
                                    }
                                )}
                            </Help>
                        )}
                        {orgUnits.data?.organisationUnits.map((ou) => (
                            <MultiSelectOption
                                key={ou.id}
                                label={ou.displayName}
                                value={ou.id}
                            />
                        ))}
                    </MultiSelect>
                </div>
            </div>

            <div>
                {combined.viewData.length > 0 && (
                    <ComparionPlotWrapper
                        evaluationName="test"
                        modelName="test"
                        evaluations={combined.viewData}
                        splitPeriods={resolvedSplitPeriods}
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
