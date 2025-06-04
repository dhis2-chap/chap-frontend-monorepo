import React, { useMemo } from 'react'
import i18n from '@dhis2/d2-i18n'
import { useLocation } from 'react-router-dom'
import { NewEvaluationForm } from '../../components/NewEvaluationForm'
import { PageHeader } from '../../features/common-features/PageHeader/PageHeader'
import { useOrgUnitsById } from '../../hooks/useOrgUnitsById'
import { EvaluationFormValues } from '../../components/NewEvaluationForm'
import { PERIOD_TYPES } from '../../components/NewEvaluationForm/Sections/PeriodSelector'
import { CircularLoader } from '@dhis2/ui'

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
 *     modelId: '123',
 *     orgUnits: ['org1', 'org2']
 *   }
 * })
 * ```
 */
export const NewEvaluationPage = () => {
  const location = useLocation()
  const locationState = location.state as EvaluationFormLocationState | undefined

  const { data: orgUnitsData, isLoading: isOrgUnitsLoading } = useOrgUnitsById(locationState?.orgUnits || [])

  const initialOrgUnits = useMemo(() => {
    if (!locationState?.orgUnits?.length || !orgUnitsData?.organisationUnits) {
      return []
    }

    return orgUnitsData.organisationUnits.map(ou => ({
      id: ou.id,
      displayName: ou.displayName,
      name: ou.displayName,
      path: ou.path,
    }))
  }, [locationState?.orgUnits, orgUnitsData])

  const initialValues: Partial<EvaluationFormValues> = useMemo(() => ({
    name: locationState?.name || '',
    periodType: locationState?.periodType || PERIOD_TYPES.MONTH,
    fromDate: locationState?.fromDate || '',
    toDate: locationState?.toDate || '',
    orgUnits: initialOrgUnits,
    modelId: locationState?.modelId || '',
  }), [locationState, initialOrgUnits])

  const isLoading = isOrgUnitsLoading && locationState?.orgUnits && locationState.orgUnits.length > 0

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
