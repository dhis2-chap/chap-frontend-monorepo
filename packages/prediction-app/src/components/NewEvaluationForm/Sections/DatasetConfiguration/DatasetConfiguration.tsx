import React, { useState } from 'react'
import {
    Button,
    Label,
    IconArrowRightMulti16,
    ButtonStrip,
    IconVisualizationLine16,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import cn from 'classnames'
import { Control, FieldErrors, useFormContext, useWatch } from 'react-hook-form'
import { EvaluationFormValues, useMappingValidationStatus, CovariateMapping } from '../../hooks/useFormController'
import { useModels } from '../../../../hooks/useModels'
import { DataMappingModal } from './DataMappingModal'
import styles from './DatasetConfiguration.module.css'

type Props = {
    control: Control<EvaluationFormValues>
    errors: FieldErrors<EvaluationFormValues>
}

export const DatasetConfiguration = ({
    control,
    errors,
}: Props) => {
    const [isDataMappingModalOpen, setIsDataMappingModalOpen] = useState(false)
    const methods = useFormContext<EvaluationFormValues>()
    const modelId = useWatch({ control, name: 'modelId' })
    const mappingStatus = useMappingValidationStatus()
    const { models } = useModels()

    const selectedModel = models?.find((model) => model.id.toString() === modelId)

    const handleModalClose = () => {
        setIsDataMappingModalOpen(false)
    }

    const handleModalConfirm = (targetMapping: CovariateMapping, covariateMappings: CovariateMapping[]) => {
        methods.setValue('targetMapping', targetMapping, { shouldValidate: true, shouldDirty: true })
        methods.setValue('covariateMappings', covariateMappings, { shouldValidate: true, shouldDirty: true })
        setIsDataMappingModalOpen(false)
    }

    const getMappingSummary = () => {
        if (!selectedModel) {
            return i18n.t('No model selected')
        }

        if (mappingStatus.isValid) {
            return i18n.t('All data items mapped')
        }

        return i18n.t('{{mapped}}/{{total}} data items mapped', {
            mapped: mappingStatus.mappedCovariates + (mappingStatus.missingTarget ? 0 : 1),
            total: mappingStatus.totalCovariates + 1
        })
    }

    return (
        <>
            <div className={cn(styles.formField, styles.datasetConfiguration)}>
                <Label>{i18n.t('Dataset Configuration')}</Label>
                <p className={styles.mutedText}>{getMappingSummary()}</p>

                <ButtonStrip>
                    <Button
                        onClick={() => setIsDataMappingModalOpen(true)}
                        icon={<IconArrowRightMulti16 />}
                        dataTest="evaluation-data-mapping-button"
                        disabled={!selectedModel}
                        small
                        >
                        {i18n.t('Configure data mappings')}
                    </Button>

                    <Button
                        small
                        disabled={!selectedModel || !mappingStatus.isValid}
                        icon={<IconVisualizationLine16 />}
                    >
                        {i18n.t('Inspect dataset')}
                    </Button>
                </ButtonStrip>

                {/* Show validation errors */}
                {errors.targetMapping && (
                    <p className={styles.errorText}>{errors.targetMapping.message}</p>
                )}
                {errors.covariateMappings && (
                    <p className={styles.errorText}>{errors.covariateMappings.message}</p>
                )}
            </div>

            {isDataMappingModalOpen && selectedModel && (
                <DataMappingModal
                    model={selectedModel}
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}
        </>
    )
} 