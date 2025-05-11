import { useQuery } from "@tanstack/react-query";
import { Route } from "../../../../hooks/useRoute";
import { ApiError, DefaultService } from "@dhis2-chap/chap-lib";

type Props = {
    route: Route | undefined
}

export const useChapStatus = ({ route }: Props) => {
    const { data: status, error, isLoading } = useQuery<Awaited<ReturnType<typeof DefaultService.systemInfoSystemInfoGet>>, ApiError>({
        queryKey: ['systemInfo', route?.url],
        queryFn: () => DefaultService.systemInfoSystemInfoGet(),
        enabled: !!route,
    })

    return {
        status,
        error,
        isLoading,
    }
}
