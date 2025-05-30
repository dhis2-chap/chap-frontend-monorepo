import React, { useState, useMemo } from 'react'
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
import { UserOptionsFields } from '../UserOptionsFields'
import styles from './ModelTemplateConfigForm.module.css'

const modelTemplateConfigSchema = z.object({
    name: z.string().min(1, { message: i18n.t('Name is required') }),
    templateId: z.number().min(1, { message: i18n.t('Template is required') }),
    covariates: z.array(
        z.object({
            name: z.string()
                .min(1, { message: i18n.t('Covariate name is required') })
                .regex(/^\S*$/, { message: i18n.t('Covariate name cannot contain spaces') })
        })
    ),
    userOptions: z.record(z.any())
})

export type ModelTemplateConfigFormValues = z.infer<typeof modelTemplateConfigSchema>

interface ModelTemplateConfigFormProps {
    onSubmit: (data: ModelTemplateConfigFormValues) => void
    isSubmitting: boolean
}

export const ModelTemplateConfigForm = ({
    onSubmit,
    isSubmitting,
}: ModelTemplateConfigFormProps) => {
    const { route } = useRoute()
    const { modelTemplates, isLoading: isLoadingTemplates } = useModelTemplates({ route })
    const [newCovariate, setNewCovariate] = useState('')
    const [covariateError, setCovariateError] = useState('')

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<ModelTemplateConfigFormValues>({
        resolver: zodResolver(modelTemplateConfigSchema),
        defaultValues: {
            name: '',
            templateId: 0,
            covariates: [],
            userOptions: {}
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'covariates'
    })

    // Watch for template changes
    const watchedTemplateId = watch('templateId')
    const currentTemplate = useMemo(() => {
        return modelTemplates?.find(template => template.id === watchedTemplateId)
    }, [modelTemplates, watchedTemplateId])

    const requiredCovariates = currentTemplate?.requiredCovariates || []

    const handleAddCovariate = () => {
        if (newCovariate.trim()) {
            const trimmedName = newCovariate.trim()

            if (/\s/.test(trimmedName)) {
                setCovariateError(i18n.t('Covariate name cannot contain spaces'))
                return
            }

            const existsInRequired = requiredCovariates.includes(trimmedName)

            const existsInAdditional = fields.some(field =>
                watch(`covariates.${fields.indexOf(field)}.name`) === trimmedName
            )

            if (!existsInRequired && !existsInAdditional) {
                append({ name: trimmedName })
                setNewCovariate('')
                setCovariateError('')
            } else {
                setCovariateError(i18n.t('Covariate already exists'))
                return
            }
        }
    }

    const handleFormSubmit = (data: ModelTemplateConfigFormValues) => {
        onSubmit(data)
    }

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>{i18n.t('Configure Model')}</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className={styles.formField}>
                    <Label>{i18n.t('Model Template')}</Label>
                    <Controller
                        name="templateId"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                selected={field.value > 0 ? field.value.toString() : ''}
                                loading={isLoadingTemplates}
                                error={!!errors.templateId}
                                placeholder={i18n.t('Select a model template')}
                                disabled={isLoadingTemplates || !modelTemplates}
                                onChange={({ selected }) => field.onChange(selected ? Number(selected) : 0)}
                            >
                                {modelTemplates?.map((template) => (
                                    <SingleSelectOption
                                        key={template.id}
                                        label={template.displayName ?? template.name}
                                        value={template.id.toString()}
                                    />
                                ))}
                            </SingleSelect>
                        )}
                    />
                    {errors.templateId && <p className={styles.errorText}>{errors.templateId.message}</p>}
                </div>

                <div className={styles.formField}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                label={i18n.t('Configured Model Name')}
                                value={field.value}
                                error={!!errors.name}
                                disabled={!watchedTemplateId}
                                placeholder={i18n.t('Enter something to identify your model, e.g. "Debug" or "Malaria"')}
                                onChange={({ value }) => field.onChange(value)}
                                helpText={field.value ?
                                    i18n.t('Your model will be saved as {{modelName}} [{{configuredModelName}}]',
                                        {
                                            modelName: currentTemplate?.displayName,
                                            configuredModelName: field.value,
                                            escape: ':'
                                        }
                                    ) : undefined
                                }
                            />
                        )}
                    />
                    {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
                </div>

                {/* User Options Section */}
                <UserOptionsFields
                    control={control}
                    setValue={setValue}
                    currentTemplate={currentTemplate}
                    disabled={!watchedTemplateId}
                />

                <div className={styles.formField}>
                    <Label>{i18n.t('Additional Covariates')}</Label>
                    <div className={styles.covariate}>
                        <div className={styles.covariateInput}>
                            <InputField
                                value={newCovariate}
                                placeholder={i18n.t('Enter covariate name')}
                                onChange={({ value }) => {
                                    setNewCovariate(value || '')
                                    if (covariateError) {
                                        setCovariateError('')
                                    }
                                }}
                                disabled={!watchedTemplateId}
                                error={!!covariateError}
                            />

                        </div>
                        <Button
                            onClick={handleAddCovariate}
                            disabled={!newCovariate.trim()}
                        >
                            {i18n.t('Add')}
                        </Button>
                    </div>

                    <div className={styles.covariatesList}>
                        {/* Required Covariates */}
                        {requiredCovariates.map((covariate, index) => (
                            <div key={`required-${index}`} className={`${styles.covariateItem} ${styles.requiredCovariateItem}`}>
                                <span className={styles.covariateItemText}>
                                    {covariate}
                                </span>
                                <span className={styles.requiredLabel}>{i18n.t('Required')}</span>
                            </div>
                        ))}

                        {/* User-added Additional Covariates */}
                        {fields.map((field, index) => (
                            <div key={field.id} className={styles.covariateItem}>
                                <span className={styles.covariateItemText}>
                                    {watch(`covariates.${index}.name`)}
                                </span>
                                <Button
                                    onClick={() => remove(index)}
                                    small
                                >
                                    {i18n.t('Remove')}
                                </Button>
                            </div>
                        ))}
                    </div>
                    {covariateError && <p className={styles.errorText}>{covariateError}</p>}
                    {errors.covariates && <p className={styles.errorText}>{i18n.t('Please check covariates')}</p>}
                </div>

                <div className={styles.actionButtons}>
                    <ButtonStrip>
                        <Button
                            primary
                            loading={isSubmitting}
                            type="submit"
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