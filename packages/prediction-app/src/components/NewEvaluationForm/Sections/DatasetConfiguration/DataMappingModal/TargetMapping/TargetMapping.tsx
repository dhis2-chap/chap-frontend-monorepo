import React from 'react'
import { FeatureType } from '@dhis2-chap/chap-lib'
import { useFormContext, useWatch } from 'react-hook-form'
import { EvaluationFormValues, useValidationHelpers } from '../../../../hooks/useFormController'
import SearchSelectField from '../../../../../../features/search-dataitem/SearchSelectField'
import styles from './TargetMapping.module.css'

type Props = {
    target: FeatureType
}

export const TargetMapping = ({ target }: Props) => {
    const methods = useFormContext<EvaluationFormValues>()
    const validationHelpers = useValidationHelpers()
    const modelId = useWatch({ control: methods.control, name: 'modelId' })
    const targetMapping = useWatch({ control: methods.control, name: 'targetMapping' })

    // Get validation error for target mapping
    const targetError = validationHelpers.validateTargetMapping(modelId, targetMapping)

    // Check if the form has been submitted
    const isFormSubmitted = methods.formState.isSubmitted

    const handleTargetMapping = (
        targetName: string,
        dataItemId: string
    ) => {
        methods.setValue('targetMapping', {
            covariateName: targetName,
            dataItemId,
        }, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    const createFeatureFromTarget = (target: FeatureType) => ({
        id: target.name || target.displayName,
        name: target.displayName,
        displayName: target.displayName,
        description: target.description,
    })

    const feature = createFeatureFromTarget(target)

    const shouldShowDescription = (target: FeatureType) => {
        return target.description
            && target.description.toLowerCase() !== (target.displayName ?? target.name).toLowerCase()
    }

    return (
        <div className={styles.targetMappingWrapper}>
            <h4 className={styles.sectionTitle}>Target</h4>
            <p className={styles.sectionDescription}>
                Map the model target to the corresponding data item in DHIS2
            </p>

            <div className={styles.targetItem}>
                <SearchSelectField
                    feature={feature}
                    onChangeSearchSelectField={(feature, dataItemId) => {
                        handleTargetMapping(
                            target.name || target.displayName,
                            dataItemId
                        )
                    }}
                />
                {/* Show specific target validation error only after form submission */}
                {isFormSubmitted && (targetError || methods.formState.errors.targetMapping) && (
                    <p className={styles.errorMessage}>
                        {targetError || methods.formState.errors.targetMapping?.message}
                    </p>
                )}
                {shouldShowDescription(target) && (
                    <p className={styles.targetDescription}>
                        {target.description}
                    </p>
                )}
            </div>
        </div>
    )
} 