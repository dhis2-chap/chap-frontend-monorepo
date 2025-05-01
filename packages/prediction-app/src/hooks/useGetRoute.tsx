import { useApiDataQuery } from '../utils/useApiDataQuery'

const RouteRequest = {
    resource: 'routes',
    params: {
        filter: `code:eq:chap`,
        fields: 'id,code,displayName,url,authorities,disabled,headers',
    },
}

type Route = {
    id: string
    code: string
    displayName: string
    url: string
    authorities: string[]
}

const useGetRoute = () => {
    const { data, error, isLoading, isError } = useApiDataQuery<{ routes: Route[] }, Error, Route>({
        queryKey: ['routes', 'chap'],
        query: RouteRequest,
        select: (data) => data.routes[0],
    });

    return {
        route: data,
        error,
        isLoading,
        isError,
    }
};

export default useGetRoute;
export default useGetRoute;
