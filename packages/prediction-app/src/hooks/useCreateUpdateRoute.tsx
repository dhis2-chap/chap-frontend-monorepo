import { useState } from 'react'
import { useConfig, useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import {
    CreateMutation,
    Mutation,
    UpdateMutation,
} from '@dhis2/app-service-data/build/types/engine/types/Mutation'
import { CHAP_MODELING_APP_AUTHORITY } from '../utils/global-authorities'
import { useCurrentUser } from '../utils/useUser'

export const content = {
    data: ({ url }: any) => ({
        name: 'chap',
        code: 'chap',
        disabled: false,
        url: url,
        authorities: [CHAP_MODELING_APP_AUTHORITY],
        headers: {
            'Content-Type': 'application/json',
        },
    }),
}

const routeUpdateMutation : any = {
  type: "update",
  resource : "routes",
  id: ({ id } : any) : any => id as any,
  ...content
}


const routeCreateMutation : CreateMutation= {
    type: 'create',
    resource : "routes",
    ...content
}

const useCreateUpdateRoute = (route : {id : string, url : string} | undefined) => {
  const { data: user, isLoading } = useCurrentUser();

  const [createMutate, createMutateParams] = useDataMutation(routeCreateMutation);
  const [updateMutate, updateMutateParams] = useDataMutation(routeUpdateMutation);

  //create if route does not exisits
  if(!route){
    return {
      mutate : createMutate,
      ...createMutateParams
    }
  }
  
  //update if route exisits
  return {
    mutate : updateMutate,
      ...updateMutateParams
  }
  //update if route exisits

};

export default useCreateUpdateRoute;
