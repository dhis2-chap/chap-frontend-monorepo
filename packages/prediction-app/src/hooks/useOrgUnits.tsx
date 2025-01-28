import { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'

const REQUEST = {
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            paging: false,
            fields: ['id', 'displayName'],
        },
    },
}

const useOrgUnits = () => {
    const { loading, error, data } = useDataQuery(REQUEST)
    return {
        orgUnits: (data as any)?.orgUnits,
        error,
        loading,
    }
}

export default useOrgUnits
