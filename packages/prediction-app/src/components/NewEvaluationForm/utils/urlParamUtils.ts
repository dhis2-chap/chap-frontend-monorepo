import { NavigateFunction } from 'react-router-dom'
import { EvaluationFormLocationState } from '../../../pages/NewEvaluationPage/NewEvaluationPage'

/**
 * Navigates to the new evaluation page with initial form values
 * @param navigate - The navigate function from useNavigate()
 * @param initialValues - The initial form values
 */
export const navigateToEvaluationForm = (
    navigate: NavigateFunction,
    initialValues: EvaluationFormLocationState
): void => {
    navigate('/evaluation/new', {
        state: initialValues
    })
}

/**
 * Example usage:
 * 
 * ```typescript
 * import { useNavigate } from 'react-router-dom'
 * import { navigateToEvaluationForm } from './path/to/utils'
 * 
 * const navigate = useNavigate()
 * 
 * navigateToEvaluationForm(navigate, {
 *     name: 'EWARS Evaluation 2024',
 *     periodType: 'MONTH',
 *     fromDate: '2024-01',
 *     toDate: '2024-12',
 *     modelId: '123',
 *     orgUnits: ['org1', 'org2']
 * })
 * ```
 */ 