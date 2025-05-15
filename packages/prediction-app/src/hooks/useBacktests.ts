import { useQuery } from "@tanstack/react-query";
import { BackTestRead, CrudService, ApiError } from "@dhis2-chap/chap-lib";

export const useBacktests = () => {
    const { data, error, isLoading } = useQuery<BackTestRead[], ApiError>({
        queryKey: ['backtests'],
        queryFn: () => CrudService.getBacktestsCrudBacktestsGet(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 5 * 60 * 1000, // 5 minutes
        retry: 0, // Don't retry on error
    });

    return {
        backtests: data,
        error,
        isLoading,
    };
};
