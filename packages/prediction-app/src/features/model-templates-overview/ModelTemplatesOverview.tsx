import React, { useState } from 'react'
import { PageHeader } from '../common-features/PageHeader/PageHeader'
import { useModelTemplates } from '../../hooks/useModelTemplates'
import { useRoute } from '../../hooks/useRoute'
import { CircularLoader } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import styles from './ModelTemplatesOverview.module.css'
import ModelTemplateConfigForm, { ModelTemplateConfigFormValues } from './components/ModelTemplateConfigForm/ModelTemplateConfigForm'

export const ModelTemplatesOverview = () => {
    const { route } = useRoute()
    const { modelTemplates, error, isLoading } = useModelTemplates({ route })
    const [configuredModel, setConfiguredModel] = useState<ModelTemplateConfigFormValues | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (data: ModelTemplateConfigFormValues) => {
        setIsSubmitting(true)
        console.log('Configured model:', data)
        setConfiguredModel(data)
        setIsSubmitting(false)
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className={styles.loadingContainer}>
                    <CircularLoader />
                </div>
            )
        }

        if (error) {
            return (
                <div className={styles.errorContainer}>
                    <p>{i18n.t('Error loading model templates:')}</p>
                    <p>{error.message}</p>
                </div>
            )
        }

        if (!modelTemplates || modelTemplates.length === 0) {
            return (
                <div className={styles.emptyContainer}>
                    <p>{i18n.t('No model templates found.')}</p>
                </div>
            )
        }

        return (
            <div>
                <ModelTemplateConfigForm 
                    onSubmit={handleSubmit} 
                    isLoading={isSubmitting} 
                />
                
                <div className={styles.dataContainer}>
                    <h3>{i18n.t('Available Templates')}</h3>
                    <pre>{JSON.stringify(modelTemplates, null, 2)}</pre>
                    
                    {configuredModel && (
                        <div className={styles.configuredModelContainer}>
                            <h3>{i18n.t('Configured Model')}</h3>
                            <pre>{JSON.stringify(configuredModel, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div>
            <PageHeader
                pageTitle={i18n.t("Model Templates")}
                pageDescription={i18n.t("Base models that can be configured with covariates and parameters to create configured models.")}
            />
            {renderContent()}
        </div>
    )
}

export default ModelTemplatesOverview
