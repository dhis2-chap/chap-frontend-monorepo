import React from 'react'
import {
    Input,
    Label,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { EvaluationFormValues } from '../../hooks/useFormController'
import styles from './NameInput.module.css'

type Props = {
    control: Control<EvaluationFormValues>
    errors: FieldErrors<EvaluationFormValues>
}

export const NameInput = ({ control, errors }: Props) => {
    return (
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
                        placeholder={i18n.t('EWARS Evaluation 22-24')}
                    />
                )}
            />
            {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
        </div>
    )
} 