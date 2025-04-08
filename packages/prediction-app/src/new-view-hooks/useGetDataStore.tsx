import { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import type {
    Query,
    QueryOptions,
} from '@dhis2/app-service-data/build/types/engine'

const REQUEST = (key: string): Query => {
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
