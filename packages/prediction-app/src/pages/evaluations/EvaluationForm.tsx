import React from 'react'
import {
    Button,
    Input,
    Label,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './EvaluationForm.module.css'

const evaluationSchema = z.object({
    name: z.string().min(1, { message: i18n.t('Name is required') }),
    periodType: z.string().min(1, { message: i18n.t('Period type is required') }),
    fromDate: z.string().min(1, { message: i18n.t('Start date is required') }),
    toDate: z.string().min(1, { message: i18n.t('End date is required') }),
})

export type EvaluationFormValues = z.infer<typeof evaluationSchema>

interface EvaluationFormProps {
    onSubmit: (data: EvaluationFormValues) => void
    isSubmitting?: boolean
}

export const EvaluationForm = ({
    onSubmit,
    isSubmitting = false,
}: EvaluationFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationSchema),
        defaultValues: {
            name: '',
            periodType: '',
            fromDate: '',
            toDate: '',
        },
    })

    const periodType = useWatch({ control, name: 'periodType' });

    const handleFormSubmit = (data: EvaluationFormValues) => {
        onSubmit(data)
    }

    return (
        <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>{i18n.t('New evaluation')}</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className={styles.formField}>
                    <Label htmlFor="evaluation-name">{i18n.t('Evaluation name')}</Label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                error={!!errors.name}
                                onChange={(payload) => field.onChange(payload.value)}
                                dataTest="evaluation-name-input"
                            />
                        )}
                    />
                    {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
                </div>
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
                                <SingleSelectOption value="daily" label={i18n.t('Daily')} />
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
                                <div style={{ opacity: periodType ? 1 : 0.6 }}>
                                    <input
                                        className={styles.input}
                                        type={periodType || 'text'}
                                        disabled={!periodType}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        data-test="evaluation-from-date-input"
                                    />
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
                                <div style={{ opacity: periodType ? 1 : 0.6 }}>
                                    <input
                                        className={styles.input}
                                        type={periodType || 'text'}
                                        disabled={!periodType}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        data-test="evaluation-to-date-input"
                                    />
                                    {errors.toDate && (
                                        <p className={styles.errorText}>{errors.toDate.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Button
                        type="submit"
                        primary
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {i18n.t('Start job')}
                    </Button>
                </div>
            </form>
        </div>
    )
}
