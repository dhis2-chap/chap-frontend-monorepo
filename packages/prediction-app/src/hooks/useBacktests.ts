import { QueryOptions, useQuery } from "@tanstack/react-query";
import { BackTestRead, CrudService, ApiError } from "@dhis2-chap/chap-lib";

export const useBacktests = ({ ...queryOptions }: QueryOptions<BackTestRead[], ApiError> = {}) => {
    const { data, error, isLoading } = useQuery<BackTestRead[], ApiError>({
        queryKey: ['backtests'],
        queryFn: () => CrudService.getBacktestsCrudBacktestsGet(),
        staleTime: 5 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        retry: 0,
        ...queryOptions,
    });

    return {
        backtests: data,
        error,
        isLoading,
    };
};
