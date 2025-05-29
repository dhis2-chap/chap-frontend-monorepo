import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import i18n from '@dhis2/d2-i18n'
import { OrganisationUnit } from '../../OrganisationUnitSelector'
import { PERIOD_TYPES } from '../Sections/PeriodSelector'
import { isAfter, isEqual, parseISO } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { ModelSpecRead } from '@dhis2-chap/chap-lib'
import { useCreateNewBacktest } from './useCreateNewBacktest'

export type CovariateMapping = z.infer<typeof covariateMappingSchema>

const orgUnitSchema = z.object({
  id: z.string().min(1, { message: i18n.t('Missing id for org unit') }),
  name: z.string().optional(),
  displayName: z.string().optional(),
  path: z.string().optional(),
})

const covariateMappingSchema = z.object({
  covariateName: z.string(),
  dataItemId: z.string(),
})

const evaluationSchema = z.object({
  name: z.string().min(1, { message: i18n.t('Name is required') }),
  periodType: z.enum(["WEEK", "MONTH"], { message: i18n.t('Period type is required') }),
  fromDate: z.string().min(1, { message: i18n.t('Start date is required') }),
  toDate: z.string().min(1, { message: i18n.t('End date is required') }),
  orgUnits: z.array(orgUnitSchema).min(1, { message: i18n.t('At least one org unit is required') }),
  modelId: z.string().min(1, { message: i18n.t('Model is required') }),
  covariateMappings: z.array(covariateMappingSchema).min(1, { message: i18n.t('At least one covariate must be mapped') }),
  targetMapping: covariateMappingSchema.required(),
})
  .refine((data) => {
    const fromDate = parseISO(data.fromDate)
    const toDate = parseISO(data.toDate)
    return isAfter(toDate, fromDate) || isEqual(toDate, fromDate)
  }, { path: ['toDate'], message: i18n.t('End period must be after start period') })

export type EvaluationFormValues = z.infer<typeof evaluationSchema>

export const useFormController = () => {
  const { createNewBacktest } = useCreateNewBacktest()

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
  })

  const onUpdateOrgUnits = (orgUnits: OrganisationUnit[]) => {
    methods.setValue('orgUnits', orgUnits, { shouldValidate: true, shouldDirty: true });
  }

  const handleSubmit = (data: EvaluationFormValues) => createNewBacktest(data)

  const handleStartJob = () => {
    methods.handleSubmit(handleSubmit)()
  }

  return {
    methods,
    onUpdateOrgUnits,
    handleSubmit,
    handleStartJob,
  }
}
