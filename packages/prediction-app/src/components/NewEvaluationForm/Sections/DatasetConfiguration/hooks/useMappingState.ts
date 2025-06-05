import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ModelSpecRead } from '@dhis2-chap/chap-lib'
import { EvaluationFormValues, CovariateMapping } from '../../../hooks/useFormController'
import { useDatasetValidation } from '../useDatasetValidation'

type LocalMappingState = {
    targetMapping?: CovariateMapping
    covariateMappings: Record<string, { id: string, displayName: string }>
}

export const useMappingState = (model: ModelSpecRead) => {
    const methods = useFormContext<EvaluationFormValues>()
    const { validateTargetMapping, validateCovariateMapping } = useDatasetValidation()

    const [localState, setLocalState] = useState<LocalMappingState>(() => {
        const existingMappings = methods.getValues('covariateMappings') || []
        const covariateMappingsObject = existingMappings.reduce((acc, mapping) => {
            acc[mapping.covariateName] = {
                id: mapping.dataItem.id,
                displayName: mapping.dataItem.displayName
            }
            return acc
        }, {} as Record<string, { id: string, displayName: string }>)

        return {
            targetMapping: methods.getValues('targetMapping'),
            covariateMappings: covariateMappingsObject,
        }
    })

    const handleTargetMapping = (targetName: string, dataItemId: string, dataItemDisplayName: string) => {
        setLocalState(prev => ({
            ...prev,
            targetMapping: {
                covariateName: targetName,
                dataItem: {
                    id: dataItemId,
                    displayName: dataItemDisplayName,
                },
            }
        }))
    }

    const handleCovariateMapping = (covariateName: string, dataItemId: string, dataItemDisplayName: string) => {
        setLocalState(prev => ({
            ...prev,
            covariateMappings: {
                ...prev.covariateMappings,
                [covariateName]: {
                    id: dataItemId,
                    displayName: dataItemDisplayName,
                }
            }
        }))
    }

    // Convert local state to format expected by validation functions
    const getLocalStateForValidation = () => {
        const covariateMappingsArray = Object.entries(localState.covariateMappings).map(
            ([covariateName, dataItem]) => ({
                covariateName,
                dataItem: {
                    id: dataItem.id,
                    displayName: dataItem.displayName,
                }
            })
        )
        return {
            targetMapping: localState.targetMapping,
            covariateMappings: covariateMappingsArray
        }
    }

    const isTargetMapped = () => {
        const { targetMapping } = getLocalStateForValidation()
        const error = validateTargetMapping(model.id.toString(), targetMapping)
        return error === null
    }

    const areAllCovariatesMapped = () => {
        const { covariateMappings } = getLocalStateForValidation()
        const errors = validateCovariateMapping(model.id.toString(), covariateMappings)
        return Object.keys(errors).length === 0
    }

    const isFormValid = isTargetMapped() && areAllCovariatesMapped()

    const getMappingsForSubmission = () => {
        if (!localState.targetMapping) return null

        const { targetMapping, covariateMappings } = getLocalStateForValidation()
        return { targetMapping, covariateMappings }
    }

    return {
        localState,
        handleTargetMapping,
        handleCovariateMapping,
        isTargetMapped,
        areAllCovariatesMapped,
        isFormValid,
        getMappingsForSubmission,
    }
} 