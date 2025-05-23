import { useQuery } from "@tanstack/react-query";
import { ApiError, DefaultService, ModelTemplateConfig } from "@dhis2-chap/chap-lib";
import { Route } from "./useRoute";

type Props = {
    route: Route | undefined
}

export const useModelTemplates = ({ route }: Props) => {
    const { data: modelTemplates, error, isLoading } = useQuery<Array<ModelTemplateConfig>, ApiError>({
        queryKey: ['modelTemplates', route?.url],
        queryFn: () => DefaultService.listModelTemplatesListModelTemplatesGet(),
        enabled: !!route,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 5 * 60 * 1000, // 5 minutes
        retry: 0, // Don't retry on error
    })

    return {
        modelTemplates,
        error,
        isLoading,
    }
}
