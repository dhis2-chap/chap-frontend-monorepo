import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import i18n from '@dhis2/d2-i18n'
import { OrganisationUnit } from '../../OrganisationUnitSelector'
import { PERIOD_TYPES } from '../Sections/PeriodSelector'
import { isAfter, isEqual, parseISO } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { ModelSpecRead } from '@dhis2-chap/chap-lib'

export type CovariateMapping = z.infer<typeof covariateMappingSchema>

const covariateMappingSchema = z.object({
  covariateName: z.string(),
  dataItemId: z.string(),
})

const evaluationSchema = z.object({
  name: z.string().min(1, { message: i18n.t('Name is required') }),
  periodType: z.enum(["", "WEEK", "MONTH"], { message: i18n.t('Period type is required') }),
  fromDate: z.string().min(1, { message: i18n.t('Start date is required') }),
  toDate: z.string().min(1, { message: i18n.t('End date is required') }),
  orgUnits: z.array(z.object({
    id: z.string().min(1, { message: i18n.t('Missing id for org unit') }),
    name: z.string().optional(),
    displayName: z.string().optional(),
    path: z.string().optional(),
  })).min(1, { message: i18n.t('At least one org unit is required') }),
  modelId: z.string().min(1, { message: i18n.t('Model is required') }),
  covariateMappings: z.array(covariateMappingSchema).optional(),
  targetMapping: covariateMappingSchema.optional(),
})
.refine((data) => {
  const fromDate = parseISO(data.fromDate)
  const toDate = parseISO(data.toDate)
  return isAfter(toDate, fromDate) || isEqual(toDate, fromDate)
}, { path: ['toDate'], message: i18n.t('End period must be after start period') })

export type EvaluationFormValues = z.infer<typeof evaluationSchema>

// Custom validation functions
export const useValidationHelpers = () => {
  const queryClient = useQueryClient()

  const getSelectedModel = (modelId: string): ModelSpecRead | undefined => {
    if (!modelId) return undefined
    return queryClient.getQueryData<ModelSpecRead[]>(['models'])?.find((model) => model.id === Number(modelId))
  }

  const validateTargetMapping = (modelId: string, targetMapping?: CovariateMapping): string | null => {
    const model = getSelectedModel(modelId)
    if (!model || !model.target) return null
    
    if (!targetMapping) {
      return i18n.t('Target "{{targetName}}" must be mapped to a data item', { 
        targetName: model.target.displayName || model.target.name 
      })
    }

    if (targetMapping.covariateName !== model.target.name || !targetMapping.dataItemId) {
      return i18n.t('Target "{{targetName}}" must be mapped to a data item', { 
        targetName: model.target.displayName || model.target.name 
      })
    }

    return null
  }

  const validateCovariateMapping = (modelId: string, covariateMappings?: CovariateMapping[]): Record<string, string> => {
    const model = getSelectedModel(modelId)
    const errors: Record<string, string> = {}
    
    if (!model || !model.covariates) return errors

    model.covariates.forEach((covariate) => {
      if (!covariate.name) return // Skip covariates without a name
      
      const mapping = covariateMappings?.find(m => m.covariateName === covariate.name)
      
      if (!mapping || !mapping.dataItemId) {
        errors[covariate.name] = i18n.t('Covariate "{{covariateName}}" must be mapped to a data item', {
          covariateName: covariate.displayName || covariate.name
        })
      }
    })

    return errors
  }

  const getMissingMappings = (modelId: string, covariateMappings?: CovariateMapping[], targetMapping?: CovariateMapping) => {
    const model = getSelectedModel(modelId)
    if (!model) return { missingCovariates: [], missingTarget: false }

    const missingCovariates = model.covariates?.filter(covariate => 
      !covariateMappings?.some(mapping => 
        mapping.covariateName === covariate.name && mapping.dataItemId
      )
    ) || []

    const missingTarget = !targetMapping || 
      !model.target ||
      targetMapping.covariateName !== model.target.name || 
      !targetMapping.dataItemId

    return { missingCovariates, missingTarget }
  }

  return {
    getSelectedModel,
    validateTargetMapping,
    validateCovariateMapping,
    getMissingMappings,
  }
}

// Custom hook for validation status
export const useMappingValidationStatus = () => {
  const methods = useFormContext<EvaluationFormValues>()
  const validationHelpers = useValidationHelpers()
  
  const modelId = useWatch({ control: methods.control, name: 'modelId' })
  const covariateMappings = useWatch({ control: methods.control, name: 'covariateMappings' })
  const targetMapping = useWatch({ control: methods.control, name: 'targetMapping' })

  const getValidationSummary = () => {
    if (!modelId) {
      return {
        isValid: false,
        hasMissingMappings: false,
        missingCovariates: [],
        missingTarget: false,
        totalCovariates: 0,
        mappedCovariates: 0,
      }
    }

    const model = validationHelpers.getSelectedModel(modelId)
    if (!model) {
      return {
        isValid: false,
        hasMissingMappings: false,
        missingCovariates: [],
        missingTarget: false,
        totalCovariates: 0,
        mappedCovariates: 0,
      }
    }

    const { missingCovariates, missingTarget } = validationHelpers.getMissingMappings(
      modelId, 
      covariateMappings, 
      targetMapping
    )

    const totalCovariates = model.covariates?.length || 0
    const mappedCovariates = totalCovariates - missingCovariates.length
    const hasMissingMappings = missingCovariates.length > 0 || missingTarget

    return {
      isValid: !hasMissingMappings,
      hasMissingMappings,
      missingCovariates,
      missingTarget,
      totalCovariates,
      mappedCovariates,
    }
  }

  return getValidationSummary()
}

export const useFormController = () => {
  const queryClient = useQueryClient()
  const validationHelpers = useValidationHelpers()
  
  const methods = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      name: '',
      periodType: PERIOD_TYPES.MONTH,
      fromDate: '',
      toDate: '',
      orgUnits: [],
      modelId: '',
      covariateMappings: [],
      targetMapping: undefined,
    },
    mode: 'onChange', // Enable real-time validation
  })

  // Custom validation that runs in addition to schema validation
  const validateMappings = () => {
    const values = methods.getValues()
    const { modelId, covariateMappings, targetMapping } = values

    if (!modelId) return true

    // Validate target mapping
    const targetError = validationHelpers.validateTargetMapping(modelId, targetMapping)
    if (targetError) {
      methods.setError('targetMapping', { message: targetError })
      return false
    } else {
      methods.clearErrors('targetMapping')
    }

    // Validate covariate mappings
    const covariateErrors = validationHelpers.validateCovariateMapping(modelId, covariateMappings)
    if (Object.keys(covariateErrors).length > 0) {
      // Set a generic error for the covariateMappings field
      methods.setError('covariateMappings', { 
        message: i18n.t('Some covariates are not mapped to data items') 
      })
      return false
    } else {
      methods.clearErrors('covariateMappings')
    }

    return true
  }

  const onUpdateOrgUnits = (orgUnits: OrganisationUnit[]) => {
    methods.setValue('orgUnits', orgUnits, { shouldValidate: true, shouldDirty: true });
  }

  const handleSubmit = (data: EvaluationFormValues) => {
    // Final validation before submission
    if (!validateMappings()) {
      console.warn('Form has validation errors')
      return
    }
    
    debugger;
    console.log('Evaluation form submitted:', data)
  }

  const handleStartJob = () => {
    methods.handleSubmit(handleSubmit)()
  }

  return {
    methods,
    onUpdateOrgUnits,
    handleSubmit,
    handleStartJob,
    validationHelpers,
    validateMappings,
  }
}
