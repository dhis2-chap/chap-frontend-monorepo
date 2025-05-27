import { ComparisonPlotList, SplitPeriodSelector } from '@dhis2-chap/chap-lib'
import {
    EvaluationCompatibleSelector,
    EvaluationSelectorBase,
} from '../select-evaluation/EvaluationSelector'
import React, { useMemo } from 'react'
import css from './EvaluationCompare.module.css'
import {
    IconArrowLeft16,
    IconArrowRight16,
    IconVisualizationLine24,
    IconVisualizationLineMulti24,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { usePlotDataForEvaluations } from '../../hooks/usePlotDataForEvaluations'
import { PageHeader } from '../common-features/PageHeader/PageHeader'
import OrganisationUnitMultiSelect from '../../components/OrganisationUnitsSelect/OrganisationUnitMultiSelect'
import { useCompareSelectionController } from './useCompareSelectionController'

const MAX_SELECTED_ORG_UNITS = 10

export const EvaluationCompare = () => {
    const {
        selectedEvaluations,
        baseEvaluation,
        comparisonEvaluation,
        evaluations,
        selectedOrgUnits,
        selectedSplitPeriod,
        orgUnits,
        splitPeriods,
        hasNoMatchingSplitPeriods,
        setSelectedOrgUnits,
        setBaseEvaluation,
        setComparisonEvaluation,
        setSelectedSplitPeriod: setSelectedSplitPoint,
    } = useCompareSelectionController({
        maxSelectedOrgUnits: MAX_SELECTED_ORG_UNITS,
    })

    const { combined } = usePlotDataForEvaluations(selectedEvaluations, {
        orgUnits: selectedOrgUnits,
    })

    const evaluationsPerOrgUnit = useMemo(() => {
        return combined.viewData
            .filter((v) => v.splitPoint === selectedSplitPeriod)
            .flatMap((v) =>
                v.evaluation.map((e) => ({
                    ...e,
                    orgUnitName:
                        orgUnits?.find((ou) => ou.id === e.orgUnitId)
                            ?.displayName ?? e.orgUnitId,
                }))
            )
    }, [combined.viewData, selectedSplitPeriod, orgUnits])

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
                        available={evaluations?.evaluations ?? []}
                        loading={evaluations === undefined}
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
                            hasNoMatchingSplitPeriods
                                ? i18n.t(
                                      'Evaluations do not share any split periods'
                                  )
                                : i18n.t('Split Period')
                        }
                        splitPeriods={splitPeriods}
                        selectedSplitPeriod={selectedSplitPeriod}
                        setSelectedSplitPeriod={setSelectedSplitPoint}
                        filterable
                        noMatchText={i18n.t('No split periods found')}
                        disabled={
                            hasNoMatchingSplitPeriods || splitPeriods.length < 1
                        }
                    />
                    <OrganisationUnitMultiSelect
                        prefix={i18n.t('Organisation Units')}
                        selected={selectedOrgUnits}
                        disabled={!orgUnits}
                        onSelect={({ selected }) =>
                            setSelectedOrgUnits(selected)
                        }
                        available={orgUnits ?? []}
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
