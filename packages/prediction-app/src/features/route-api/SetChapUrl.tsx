import { useConfig } from '@dhis2/app-runtime';
import React from 'react'
import useGetDataStore from '../../new-view-hooks/useGetDataStore';
import { OpenAPI } from '@dhis2-chap/chap-lib';

interface SetChapUrlProps {
  setIsLoadingRouteConfig : (isLoadingRouteConfig : boolean) => void
}

const SetChapUrl = ({setIsLoadingRouteConfig} : SetChapUrlProps) => {
  const {error, loading, url : existingUrl, fetching} = useGetDataStore('backend-url');
  
  const config = useConfig();
  
  if(loading){
    return <>Loading...</>
  }

  else{
    //if url is not set OR url is set do DHIS2 instance (using route api) add credentials
    if (!existingUrl || URL.parse(existingUrl)?.origin === config.baseUrl) {
      console.log("Adding credentials to OpenAPI")
      OpenAPI.WITH_CREDENTIALS = true
    }

    if(existingUrl){
      console.log("Setting OpenAPI url to: ", existingUrl)
      OpenAPI.BASE = existingUrl
    }
    else{
      OpenAPI.BASE = config.baseUrl+'/api/routes/chap/run'
    }

    setIsLoadingRouteConfig(false)
  }
  return (
    <></>
  )
}

export default SetChapUrl