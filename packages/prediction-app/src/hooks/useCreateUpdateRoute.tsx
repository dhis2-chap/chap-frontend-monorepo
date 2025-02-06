import { useState } from 'react'
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import {
    CreateMutation,
    Mutation,
    UpdateMutation,
} from '@dhis2/app-service-data/build/types/engine/types/Mutation'

export const content = {
    data: ({ url }: any) => ({
        name: 'chap',
        code: 'chap',
        disabled: false,
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
    }),
}

const routeUpdateMutation: any = {
    type: 'update',
    resource: 'routes',
    id: ({ id }: any): any => id as any,
    ...content,
}

const routeCreateMutation: CreateMutation = {
    type: 'create',
    resource: 'routes',
    ...content,
}

const useCreateUpdateRoute = (
    route: { id: string; url: string } | undefined
) => {
    const [createMutate, createMutateParams] =
        useDataMutation(routeCreateMutation)
    const [updateMutate, updateMutateParams] =
        useDataMutation(routeUpdateMutation)

    //create if route does not exisits
    if (!route) {
        return {
            mutate: createMutate,
            ...createMutateParams,
        }
    }

    //update if route exisits
    return {
        mutate: updateMutate,
        ...updateMutateParams,
    }
    //update if route exisits
}

export default useCreateUpdateRoute
