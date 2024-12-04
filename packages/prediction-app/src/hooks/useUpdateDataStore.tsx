import { useEffect, useState } from "react";
import { useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import { CreateMutation } from "@dhis2/app-service-data/build/types/engine/types/Mutation";

export const REQUEST = (data : any, key: string, method : 'update' | 'create') => {
  return {
    resource: `dataStore/chap/${key}`,
    type: method,
    id : "",
    data: data,
  }
};

const usePostDataStore = (data : any, key : string, method : 'update' | 'create') => {
  
  const [mutate, { error, loading, called }] = useDataMutation(REQUEST(data, key, method));

  //await mutate();

  return {
    error,
    loading,
    called,
    mutate
  };
};

export default usePostDataStore;
