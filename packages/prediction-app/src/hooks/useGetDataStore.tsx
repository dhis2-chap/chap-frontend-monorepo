import { useDataQuery } from '@dhis2/app-runtime'

const REQUEST = (key: string) => {
    return {
        request: {
            resource: `dataStore/modeling/${key}`,
        },
    }
}

const useGetDataStore = (key: string) => {
    const { data, loading, error, fetching, engine, refetch } = useDataQuery(
        REQUEST(key)
    )

    return {
        url: (data?.request as any)?.url,
        error,
        loading,
        fetching,
        refetch,
    }
}

export default useGetDataStore
