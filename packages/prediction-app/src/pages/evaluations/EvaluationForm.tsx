import React from 'react'
import {
    Button,
    Input,
    Label,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './EvaluationForm.module.css'

const evaluationSchema = z.object({
    name: z.string().min(1, { message: i18n.t('Name is required') }),
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
        },
    })

    const handleFormSubmit = (data: EvaluationFormValues) => {
        onSubmit(data)
    }

    return (
        <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>{i18n.t('New evaluation')}</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div>
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
