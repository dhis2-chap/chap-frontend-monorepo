import { useQuery } from "@tanstack/react-query";
import { ApiError, CrudService, ModelTemplateRead } from "@dhis2-chap/chap-lib";
import { Route } from "./useRoute";

type Props = {
    route: Route | undefined
}

export const useModelTemplates = ({ route }: Props) => {
    const { data: modelTemplates, error, isLoading } = useQuery<ModelTemplateRead[], ApiError>({
        queryKey: ['modelTemplates', route?.url],
        queryFn: () => CrudService.listModelTemplatesCrudModelTemplatesGet(),
        enabled: !!route,
        retry: 0,
    })

    return {
        modelTemplates,
        error,
        isLoading,
    }
}
