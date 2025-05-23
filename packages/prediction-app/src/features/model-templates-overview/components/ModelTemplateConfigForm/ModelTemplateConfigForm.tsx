import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    InputField,
    Label,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModelTemplates } from '../../../../hooks/useModelTemplates'
import { useRoute } from '../../../../hooks/useRoute'
import styles from './ModelTemplateConfigForm.module.css'

const modelTemplateConfigSchema = z.object({
    name: z.string().min(1, { message: i18n.t('Name is required') }),
    templateName: z.string().min(1, { message: i18n.t('Template is required') }),
    covariates: z.array(
        z.object({
            name: z.string().min(1, { message: i18n.t('Covariate name is required') })
        })
    )
})

export type ModelTemplateConfigFormValues = z.infer<typeof modelTemplateConfigSchema>

interface ModelTemplateConfigFormProps {
    onSubmit: (data: ModelTemplateConfigFormValues) => void
    isLoading?: boolean
}

export const ModelTemplateConfigForm = ({
    onSubmit,
    isLoading = false
}: ModelTemplateConfigFormProps) => {
    const { route } = useRoute()
    const { modelTemplates, error, isLoading: isLoadingTemplates } = useModelTemplates({ route })
    const [newCovariate, setNewCovariate] = useState('')

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
    } = useForm<ModelTemplateConfigFormValues>({
        resolver: zodResolver(modelTemplateConfigSchema),
        defaultValues: {
            name: '',
            templateName: '',
            covariates: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'covariates'
    })

    const handleAddCovariate = () => {
        if (newCovariate.trim()) {
            append({ name: newCovariate.trim() })
            setNewCovariate('')
        }
    }

    const handleFormSubmit = (data: ModelTemplateConfigFormValues) => {
        onSubmit(data)
    }

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>{i18n.t('Configure Model Template')}</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className={styles.formField}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                label={i18n.t('Configured Model Name')}
                                value={field.value}
                                error={!!errors.name}
                                placeholder={i18n.t('Enter model name')}
                                disabled={isLoading}
                                onChange={({ value }) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
                </div>

                <div className={styles.formField}>
                    <Label>{i18n.t('Model Template')}</Label>
                    <Controller
                        name="templateName"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                selected={field.value}
                                loading={isLoadingTemplates}
                                error={!!errors.templateName}
                                placeholder={i18n.t('Select a model template')}
                                disabled={isLoading || isLoadingTemplates || !modelTemplates}
                                onChange={({ selected }) => field.onChange(selected)}
                            >
                                {modelTemplates?.map((template) => (
                                    <SingleSelectOption
                                        key={template.name}
                                        label={template.name}
                                        value={template.name}
                                    />
                                ))}
                            </SingleSelect>
                        )}
                    />
                    {errors.templateName && <p className={styles.errorText}>{errors.templateName.message}</p>}
                </div>

                <div className={styles.formField}>
                    <Label>{i18n.t('Additional Covariates')}</Label>
                    <div className={styles.covariate}>
                        <div className={styles.covariateInput}>
                            <InputField
                                value={newCovariate}
                                placeholder={i18n.t('Enter covariate name')}
                                disabled={isLoading}
                                onChange={({ value }) => setNewCovariate(value || '')}
                            />
                        </div>
                        <Button
                            onClick={handleAddCovariate}
                            disabled={!newCovariate.trim() || isLoading}
                        >
                            {i18n.t('Add')}
                        </Button>
                    </div>
                    
                    <div className={styles.covariatesList}>
                        {fields.map((field, index) => (
                            <div key={field.id} className={styles.covariateItem}>
                                <span className={styles.covariateItemText}>
                                    {watch(`covariates.${index}.name`)}
                                </span>
                                <Button
                                    onClick={() => remove(index)}
                                    disabled={isLoading}
                                >
                                    {i18n.t('Remove')}
                                </Button>
                            </div>
                        ))}
                    </div>
                    {errors.covariates && <p className={styles.errorText}>{i18n.t('Please check covariates')}</p>}
                </div>

                <div className={styles.actionButtons}>
                    <ButtonStrip>
                        <Button
                            primary
                            type="submit"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {i18n.t('Configure Model')}
                        </Button>
                    </ButtonStrip>
                </div>
            </form>
        </div>
    )
}

export default ModelTemplateConfigForm
