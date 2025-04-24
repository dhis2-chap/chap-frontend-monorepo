import { useQuery } from '@tanstack/react-query'
import { useDataEngine } from '@dhis2/app-runtime'

const REQUEST = {
    routes: {
        resource: 'routes',
        params: {
            paging: false,
            filter: `code:eq:chap`,
            fields: 'id,code,displayName,url,authorities,disabled,headers',
        },
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
    const dataEngine = useDataEngine()

    const fetchRoute = async (): Promise<Route> => {
        const data = await dataEngine.query(REQUEST)
        return data?.routes?.routes?.[0]
    }

    return useQuery<Route, Error>({
        queryKey: ['routes', 'chap'],
        queryFn: fetchRoute,
    })
}


  return {
    route : (route as any)?.routes?.routes[0],
    error,
    loading,
  };
};

export default useGetRoute;
