import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    IconArrowRightMulti16,
    StackedTable,
    StackedTableHead,
    StackedTableRowHead,
    StackedTableCellHead,
    StackedTableBody,
    StackedTableRow,
    StackedTableCell
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { type Control, useWatch } from 'react-hook-form'
import styles from './Summary.module.css'
import { InspectDatasetModal } from '../../../InspectDatasetModal'
import { getSelectionSummary, OrganisationUnit } from '../../../OrganisationUnitSelector'
import { CovariateMapping, EvaluationFormValues } from '../../hooks/useFormController'

type Props = {
    control: Control<EvaluationFormValues>
    isValid: boolean
    onStartJob?: () => void
}

const PERIOD_TYPE_LABELS = {
    DAY: i18n.t('Daily'),
    WEEK: i18n.t('Weekly'),
    MONTH: i18n.t('Monthly'),
} as const

type PeriodType = keyof typeof PERIOD_TYPE_LABELS

export const Summary = ({
    control,
    isValid,
    onStartJob
}: Props) => {
    const formValues = useWatch({ control })
    const [isInspectDatasetModalOpen, setIsInspectDatasetModalOpen] = useState(false)

    const summaryRows = [
        {
            key: 'periodType',
            label: i18n.t('Period type'),
            value: PERIOD_TYPE_LABELS[formValues.periodType as PeriodType] ?? <p></p>
        },
        {
            key: 'orgUnits',
            label: i18n.t('Organisation units'),
            value: formValues.orgUnits && formValues.orgUnits.length > 0 ? getSelectionSummary(formValues.orgUnits) : <p></p>
        }
    ]

    return (
        <>
            <div className={styles.summarySection}>
                <p>{i18n.t('Summary')}</p>

                {summaryRows.length > 0 && (
                    <div className={styles.summaryTable}>
                        <StackedTable>
                            <StackedTableHead>
                                <StackedTableRowHead>
                                    {summaryRows.map((row) => (
                                        <StackedTableCellHead key={row.key}>
                                            {row.label}
                                        </StackedTableCellHead>
                                    ))}
                                </StackedTableRowHead>
                            </StackedTableHead>
                            <StackedTableBody>
                                <StackedTableRow>
                                    {summaryRows.map((row) => (
                                        <StackedTableCell key={row.key}>
                                            {row.value}
                                        </StackedTableCell>
                                    ))}
                                </StackedTableRow>
                            </StackedTableBody>
                        </StackedTable>
                    </div>
                )}

                <ButtonStrip end>
                    <Button
                        onClick={() => setIsInspectDatasetModalOpen(true)}
                        disabled={!isValid}
                    >
                        {i18n.t('Open dataset')}
                    </Button>

                    <Button
                        onClick={onStartJob}
                        primary
                        icon={<IconArrowRightMulti16 />}
                        disabled={!isValid}
                    >
                        {i18n.t('Start job')}
                    </Button>
                </ButtonStrip>

            </div>

            {isInspectDatasetModalOpen && isValid && (
                <InspectDatasetModal
                    onClose={() => setIsInspectDatasetModalOpen(false)}
                    selectedOrgUnits={formValues.orgUnits as OrganisationUnit[]}
                    periodType={formValues.periodType as PeriodType}
                    fromDate={formValues.fromDate as string}
                    toDate={formValues.toDate as string}
                    covariateMappings={formValues.covariateMappings as CovariateMapping[]}
                    targetMapping={formValues.targetMapping as CovariateMapping}
                />
            )}
        </>
    )
} 