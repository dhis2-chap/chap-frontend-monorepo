import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { NewEvaluationForm } from '../../components/NewEvaluationForm'
import { PageHeader } from '../../features/common-features/PageHeader/PageHeader'
import { CircularLoader } from '@dhis2/ui'
import { useEvaluationFormState } from './hooks/useEvaluationFormState'

export type EvaluationFormLocationState = {
  name?: string
  periodType?: "WEEK" | "MONTH"
  fromDate?: string
  toDate?: string
  orgUnits?: string[]
  modelId?: string
}

/**
 * NewEvaluationPage - Create a new evaluation form page
 * 
 * This page accepts initial form values via React Router location state.
 * 
 * Example navigation:
 * ```
 * navigate('/evaluation/new', {
 *   state: {
 *     name: 'EWARS Evaluation 2024',
 *     periodType: 'MONTH',
 *     fromDate: '2024-01',
 *     toDate: '2024-12',
 *     modelId: '5',
 *     orgUnits: ['orgUnitId1', 'orgUnitId2']
 *   }
 * })
 * ```
 */
export const NewEvaluationPage = () => {
  const { initialValues, isLoading } = useEvaluationFormState()

  return (
    <div>
      <PageHeader
        pageTitle={i18n.t('New evaluation')}
        pageDescription={i18n.t('Create a new evaluation to assess the performance of a model')}
      />

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <CircularLoader />
        </div>
      ) : (
        <NewEvaluationForm initialValues={initialValues} />
      )}
    </div>
  )
}
