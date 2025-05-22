import { useMemo } from 'react'
import { Query, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApiDataQuery } from '../utils/useApiDataQuery'

type OrganisationUnit = {
    id: string
    displayName: string
    path: string
}

type OrgUnitResult = {
    organisationUnits: OrganisationUnit[]
}

const isOrgUnitResult = (data: any): data is OrgUnitResult => {
    return data && Array.isArray(data.organisationUnits)
}
const isOrgUnitQuery = (query: Query<any>): query is Query<OrgUnitResult> => {
    return !!query.state.data && isOrgUnitResult(query.state.data)
}

export const useOrgUnitsById = (orgUnitIds: string[]) => {
    const queryClient = useQueryClient()

    const initialData = useMemo(() => {
        const idsSet = new Set(orgUnitIds)

        const allOrgUnitsQuery = queryClient
            .getQueryCache()
            .findAll([{ orgUnits: { resource: 'organisationUnits' } }], {
                exact: false,
                type: 'all',
            })
        console.log({ allOrgUnitsQuery })

        const cachedOrgUnits = queryClient
            .getQueryCache()
            .findAll(['organisationUnits'], { exact: false })
            .flatMap((query) =>
                isOrgUnitQuery(query)
                    ? query.state.data?.organisationUnits ?? []
                    : []
            )
            .filter((ou) => idsSet.has(ou.id))

        // remove duplicates
        const cachedMap = new Map(cachedOrgUnits.map((ou) => [ou.id, ou]))
        const hasAllOrgUnits = orgUnitIds.every((id) => cachedMap.has(id))

        return hasAllOrgUnits
            ? { organisationUnits: cachedOrgUnits }
            : undefined
    }, [orgUnitIds, queryClient])

    return useApiDataQuery({
        queryKey: ['organisationUnits', orgUnitIds],
        initialData,
        query: {
            resource: 'organisationUnits',
            params: {
                paging: false,
                fields: ['id', 'displayName'],
                filter: `id:in:[${orgUnitIds.join(',')}]`,
            },
        },
        enabled: orgUnitIds.length > 0,
        cacheTime: Infinity,
        staleTime: Infinity,
    })
}
