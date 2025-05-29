import React from 'react'
import { FeatureType } from '@dhis2-chap/chap-lib'
import { Control, useFormContext, useWatch } from 'react-hook-form'
import { EvaluationFormValues, useValidationHelpers } from '../../../../hooks/useFormController'
import SearchSelectField from '../../../../../../features/search-dataitem/SearchSelectField'
import styles from './CovariateMapping.module.css'

type Props = {
    covariates: FeatureType[]
    control: Control<EvaluationFormValues>
}

type CovariateDataMapping = {
    covariateName: string
    dataItemId: string
}

export const CovariateMapping = ({ covariates, control }: Props) => {
    const methods = useFormContext<EvaluationFormValues>()
    const validationHelpers = useValidationHelpers()
    const covariateMappings = useWatch({ control, name: 'covariateMappings' }) || []
    const modelId = useWatch({ control, name: 'modelId' })

    // Get validation errors for individual covariates
    const covariateErrors = validationHelpers.validateCovariateMapping(modelId, covariateMappings)

    // Check if the form has been submitted
    const isFormSubmitted = methods.formState.isSubmitted

    const handleCovariateMapping = (
        covariateName: string,
        dataItemId: string
    ) => {
        const existingMappings: CovariateDataMapping[] = covariateMappings || []
        const existingIndex = existingMappings.findIndex(
            (mapping) => mapping.covariateName === covariateName
        )

        let updatedMappings: CovariateDataMapping[]

        if (existingIndex >= 0) {
            // Update existing mapping
            updatedMappings = [...existingMappings]
            updatedMappings[existingIndex] = {
                covariateName,
                dataItemId,
            }
        } else {
            // Add new mapping
            updatedMappings = [
                ...existingMappings,
                {
                    covariateName,
                    dataItemId,
                },
            ]
        }

        methods.setValue('covariateMappings', updatedMappings, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    const createFeatureFromCovariate = (covariate: FeatureType) => ({
        id: covariate.name || covariate.displayName,
        name: covariate.displayName,
        displayName: covariate.displayName,
        description: covariate.description,
        optional: true,
    })

    const shouldShowDescription = (covariate: FeatureType) => {
        const shouldShow = covariate.description
            && covariate.description.toLowerCase() !== (covariate.displayName ?? covariate.name).toLowerCase()
        return shouldShow
    }

    return (
        <div className={styles.covariateMappingWrapper}>
            <h4 className={styles.sectionTitle}>Covariates</h4>
            <p className={styles.sectionDescription}>
                Map each model covariate to the corresponding data item in DHIS2
            </p>

            {covariates.map((covariate, index) => {
                const feature = createFeatureFromCovariate(covariate)
                const covariateName = covariate.name || covariate.displayName
                const hasError = covariateName && covariateErrors[covariateName]

                return (
                    <div key={covariate.name || index} className={styles.covariateItem}>
                        <SearchSelectField
                            feature={feature}
                            onChangeSearchSelectField={(feature, dataItemId) =>
                                handleCovariateMapping(
                                    covariate.name || covariate.displayName,
                                    dataItemId
                                )
                            }
                        />
                        {/* Show error only after form submission */}
                        {isFormSubmitted && hasError && (
                            <p className={styles.errorMessage}>
                                {covariateErrors[covariateName!]}
                            </p>
                        )}
                        {shouldShowDescription(covariate) && (
                            <p className={styles.covariateDescription}>
                                {covariate.description}
                            </p>
                        )}
                    </div>
                )
            })}

            {/* Show general error message if there are any covariate validation errors and form submitted */}
            {isFormSubmitted && methods.formState.errors.covariateMappings && (
                <p className={styles.generalErrorMessage}>
                    {methods.formState.errors.covariateMappings.message}
                </p>
            )}
        </div>
    )
} 