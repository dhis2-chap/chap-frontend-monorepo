import { CrudService } from '@dhis2-chap/chap-lib'
import {
    useQuery
} from '@tanstack/react-query'

export const useEvaluations = () => {
    return useQuery({
        queryKey: ['backtests'],
        staleTime: 60 * 5 * 1000,
        queryFn: () => CrudService.getBacktestsCrudBacktestsGet(),
        select: (data) => {
            return {
                evaluations: data,
                evaluationsMap: new Map(
                    data.map((evaluation) => [
                        evaluation.id.toString(),
                        evaluation,
                    ])
                ),
            }
        },
    })
}
