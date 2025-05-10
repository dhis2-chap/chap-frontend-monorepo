import { useQuery } from "@tanstack/react-query";
import { Route } from "../../../../hooks/useRoute";
import { ApiError, DefaultService } from "@dhis2-chap/chap-lib";

type Props = {
    route: Route
}

export const useChapStatus = ({ route }: Props) => {
    const { data: status, error, isLoading } = useQuery<Awaited<ReturnType<typeof DefaultService.systemInfoSystemInfoGet>>, ApiError>({
        queryKey: ['systemInfo', route.url],
        queryFn: () => DefaultService.systemInfoSystemInfoGet(),
    })

    return {
        status,
        error,
        isLoading,
    }
}