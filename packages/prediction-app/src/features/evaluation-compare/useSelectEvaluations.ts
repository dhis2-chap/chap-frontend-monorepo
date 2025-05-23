import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { useEvaluations } from '../../hooks/useEvaluations'
import { BackTestRead } from '@dhis2-chap/chap-lib'

const evaluationParamsSchema = z.object({
    baseEvaluation: z.string().optional(),
    /* May want multiple comparisons in the future, so we use a list 
     Note that this is singular, because useSearchParams will list the same key multiple times when used as a list
     */

    comparisonEvaluation: z.array(z.string()).optional().default([]),
})

evaluationParamsSchema.shape.comparisonEvaluation._type

const PARAMS_KEYS = {
    baseEvaluation: 'baseEvaluation',
    comparisonEvaluation: 'comparisonEvaluation',
    splitPoint: 'splitPoint',
    orgUnit: 'orgUnit',
}

const getParams = (searchParams: URLSearchParams) => {
    return {
        baseEvaluation: searchParams.get(PARAMS_KEYS.baseEvaluation),
        comparisonEvaluation: searchParams.getAll(
            PARAMS_KEYS.comparisonEvaluation
        ),
    }
}

export type EvaluationParams = z.infer<typeof evaluationParamsSchema>

export type Updater<TInput, TOutput = TInput> =
    | TOutput
    | ((input: TInput) => TOutput)

function functionalUpdate<TInput, TOutput = TInput>(
    updater: Updater<TInput, TOutput>,
    input: TInput
): TOutput {
    return typeof updater === 'function'
        ? (updater as (_: TInput) => TOutput)(input)
        : updater
}

const createSearchParamsListUpdater =
    (key: string, valueOrUpdate: Updater<string[] | undefined>) =>
    (prev: URLSearchParams) => {
        const updatedParams = new URLSearchParams(prev)

        const newItems = functionalUpdate(valueOrUpdate, prev.getAll(key))

        updatedParams.delete(key)
        newItems?.forEach((value) => {
            updatedParams.append(key, value)
        })

        return updatedParams
    }

export const useSelectEvaluations = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const params: EvaluationParams = useMemo(() => {
        const params = getParams(searchParams)

        const validated = evaluationParamsSchema.safeParse(params)

        if (validated.success) {
            return validated.data
        }
        return {
            baseEvalation: undefined,
            comparisonEvaluation: [],
        }
    }, [searchParams])

    const setBaseEvaluation = useCallback(
        (baseEvaluationId: string | undefined) => {
            setSearchParams((prev) => {
                const updatedParams = new URLSearchParams(prev)
                if (baseEvaluationId) {
                    updatedParams.set(
                        PARAMS_KEYS.baseEvaluation,
                        baseEvaluationId
                    )
                } else {
                    updatedParams.delete(PARAMS_KEYS.baseEvaluation)
                }
                return updatedParams
            })
        },
        [setSearchParams]
    )

    const setComparisonEvaluations = useCallback(
        (valueOrUpdater: Updater<string[] | undefined>) => {
            setSearchParams(
                createSearchParamsListUpdater(
                    PARAMS_KEYS.comparisonEvaluation,
                    valueOrUpdater
                )
            )
        },
        [setSearchParams]
    )

    const setComparisonEvaluation = useCallback(
        (comparisonEvaluationId: string | undefined) =>
            setComparisonEvaluations(
                comparisonEvaluationId ? [comparisonEvaluationId] : []
            ),
        [setComparisonEvaluations]
    )
    const comparisonEvaluation: string | undefined =
        params.comparisonEvaluation[0]

    return {
        baseEvaluation: params.baseEvaluation,
        comparisonEvaluations: params.comparisonEvaluation,
        comparisonEvaluation: comparisonEvaluation,
        setBaseEvaluation,
        setComparisonEvaluations,
        setComparisonEvaluation,
    }
}

// not that we do not expose comparisonEvaluations here,
// if we want to support more - implement here
export type EvaluationControllerResult = {
    baseEvaluation: BackTestRead | undefined
    comparisonEvaluation: BackTestRead | undefined
    query: ReturnType<typeof useEvaluations>
} & Pick<
    ReturnType<typeof useSelectEvaluations>,
    'setBaseEvaluation' | 'setComparisonEvaluation'
>

export const useSelectedEvaluationsController =
    (): EvaluationControllerResult => {
        const evaluationsQuery = useEvaluations()
        const {
            baseEvaluation,
            comparisonEvaluation,
            comparisonEvaluations,
            setComparisonEvaluations,
            ...selectors
        } = useSelectEvaluations()

        // map selected evaluationIds to the actual evaluations
        const mappedEvaluations = useMemo(() => {
            if (!evaluationsQuery.data) {
                return {
                    baseEvaluation: undefined,
                    comparisonEvaluation: undefined,
                    comparisonEvaluations: [],
                }
            }
            const { evaluationsMap } = evaluationsQuery.data
            return {
                baseEvaluation: baseEvaluation
                    ? evaluationsMap.get(baseEvaluation)
                    : undefined,
                comparisonEvaluation: comparisonEvaluation
                    ? evaluationsMap.get(comparisonEvaluation)
                    : undefined,
            }
        }, [evaluationsQuery.data, baseEvaluation, comparisonEvaluation])

        return {
            ...mappedEvaluations,
            ...selectors,
            query: evaluationsQuery,
        }
    }

export const useSelectedSplitPoint = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const splitPoint = searchParams.get(PARAMS_KEYS.splitPoint)
    const setSplitPoint = useCallback(
        (splitPoint: string | undefined) => {
            setSearchParams((prev) => {
                const updatedParams = new URLSearchParams(prev)
                if (splitPoint) {
                    updatedParams.set(PARAMS_KEYS.splitPoint, splitPoint)
                } else {
                    updatedParams.delete(PARAMS_KEYS.splitPoint)
                }
                return updatedParams
            })
        },
        [setSearchParams]
    )
    return [splitPoint, setSplitPoint] as const
}

export const useSelectedOrgUnits = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const organisationUnits = searchParams.getAll(PARAMS_KEYS.orgUnit)
    const setOrgUnits = useCallback(
        (valueOrUpdater: Updater<string[] | undefined>) => {
            return setSearchParams(
                createSearchParamsListUpdater(
                    PARAMS_KEYS.orgUnit,
                    valueOrUpdater
                )
            )
        },
        [setSearchParams]
    )

    return [organisationUnits, setOrgUnits] as const
}
