import React from 'react'
import {
    IconError16,
    IconErrorFilled16,
    IconErrorFilled24,
    Label,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { Controller, Control, FieldErrors, useWatch } from 'react-hook-form'
import { EvaluationFormValues } from '../../NewEvaluationForm'
import styles from './PeriodSelector.module.css'

type Props = {
    control: Control<EvaluationFormValues>
    errors: FieldErrors<EvaluationFormValues>
}

const getInputType = (periodType: string): string => {
    switch (periodType) {
        case 'daily':
            return 'date';
        case 'weekly':
            return 'week';
        case 'monthly':
            return 'month';
        default:
            return 'text';
    }
};

export const PeriodSelector = ({ control, errors }: Props) => {
    const periodType = useWatch({ control, name: 'periodType' });

    return (
        <>
            <div className={styles.formField}>
                <Label>{i18n.t('Period type')}</Label>
                <Controller
                    name="periodType"
                    control={control}
                    render={({ field }) => (
                        <SingleSelectField
                            selected={field.value}
                            error={!!errors.periodType}
                            onChange={({ selected }) => field.onChange(selected)}
                            dataTest="evaluation-period-type-select"
                        >
                            <SingleSelectOption disabled value="daily" label={i18n.t('Daily')} />
                            <SingleSelectOption value="weekly" label={i18n.t('Weekly')} />
                            <SingleSelectOption value="monthly" label={i18n.t('Monthly')} />
                        </SingleSelectField>
                    )}
                />
                {errors.periodType && <p className={styles.errorText}>{errors.periodType.message}</p>}
            </div>
            <div className={styles.datePickersContainer}>
                <div className={styles.datePickerField}>
                    <Label>{i18n.t('From date')}</Label>
                    <Controller
                        name="fromDate"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        className={styles.input}
                                        type={periodType ? getInputType(periodType) : 'text'}
                                        disabled={!periodType}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        data-test="evaluation-from-date-input"
                                        style={{ opacity: periodType ? 1 : 0.6 }}
                                    />
                                    {errors.fromDate && <IconErrorFilled24 color='#d32f2f' />}
                                </div>
                                {errors.fromDate && (
                                    <p className={styles.errorText}>{errors.fromDate.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>
                <div className={styles.datePickerField}>
                    <Label>{i18n.t('To date')}</Label>
                    <Controller
                        name="toDate"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        className={styles.input}
                                        type={periodType ? getInputType(periodType) : 'text'}
                                        disabled={!periodType}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        data-test="evaluation-to-date-input"
                                        style={{ opacity: periodType ? 1 : 0.6 }}
                                    />
                                    {errors.toDate && <IconErrorFilled24 color='#d32f2f' />}
                                </div>
                                {errors.toDate && (
                                    <p className={styles.errorText}>{errors.toDate.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    )
}
