import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { z } from 'zod'
import { useOrgUnitsById } from '../../../hooks/useOrgUnitsById'
import { EvaluationFormValues } from '../../../components/NewEvaluationForm'
import { PERIOD_TYPES } from '../../../components/NewEvaluationForm/Sections/PeriodSelector'
import { EvaluationFormLocationState } from '../NewEvaluationPage'

const evaluationFormLocationStateSchema = z.object({
    name: z.string().optional(),
    periodType: z.enum([PERIOD_TYPES.WEEK, PERIOD_TYPES.MONTH]).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    orgUnits: z.array(z.string()).optional(),
    modelId: z.string().optional(),
}).optional()

export const useEvaluationFormState = () => {
    const location = useLocation()

    const validationResult = evaluationFormLocationStateSchema.safeParse(location.state)
    const locationState = validationResult.success
        ? validationResult.data as EvaluationFormLocationState | undefined
        : undefined

    if (!validationResult.success) {
        console.warn('Invalid location state:', validationResult.error.errors)
    }

    const {
        data: orgUnitsData,
        isInitialLoading: isOrgUnitsInitialLoading,
    } = useOrgUnitsById(locationState?.orgUnits || [])


    const initialValues: Partial<EvaluationFormValues> = useMemo(() => ({
        name: locationState?.name || '',
        periodType: locationState?.periodType || PERIOD_TYPES.MONTH,
        fromDate: locationState?.fromDate || '',
        toDate: locationState?.toDate || '',
        orgUnits: orgUnitsData?.organisationUnits || [],
        modelId: locationState?.modelId || '',
    }), [locationState, orgUnitsData])

    const isLoading = isOrgUnitsInitialLoading
        && locationState?.orgUnits
        && locationState.orgUnits.length > 0


    return {
        initialValues,
        isLoading,
        locationState,
        isLocationStateValid: validationResult.success
    }
} 