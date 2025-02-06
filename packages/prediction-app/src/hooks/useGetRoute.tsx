import { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'

const REQUEST = {
    routes: {
        resource: 'routes',
        params: {
            paging: false,
            filter: `code:eq:chap`,
            fields: '*',
        },
    },
}

const useGetRoute = () => {
    const { data: route, loading, error } = useDataQuery(REQUEST)

    return {
        route: (route as any)?.routes?.routes[0],
        error,
        loading,
    }
}

export default useGetRoute
