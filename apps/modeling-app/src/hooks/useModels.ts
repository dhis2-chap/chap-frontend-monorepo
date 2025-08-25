import { ApiError, CrudService, ModelSpecRead } from "../../../../packages/chap-lib/ui/src";
import { useQuery } from "@tanstack/react-query";

export const useModels = () => {
    const { data, error, isLoading } = useQuery<ModelSpecRead[], ApiError>({
        queryKey: ['models'],
        queryFn: () => CrudService.listModelsCrudModelsGet(),
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: 0,
    });

    return {
        models: data,
        error,
        isLoading,
    };
}