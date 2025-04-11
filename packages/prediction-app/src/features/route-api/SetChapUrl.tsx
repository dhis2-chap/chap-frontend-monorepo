import { useConfig } from '@dhis2/app-runtime'
import React, { useEffect } from 'react'
import useGetDataStore from '../../new-view-hooks/useGetDataStore'
import { OpenAPI } from '@dhis2-chap/chap-lib'

interface SetChapUrlProps {
    setIsLoadingRouteConfig: (isLoadingRouteConfig: boolean) => void
}

const SetChapUrl = ({ setIsLoadingRouteConfig }: SetChapUrlProps) => {
    const { error, loading, url: existingUrl } = useGetDataStore('backend-url')

    const config = useConfig()

    useEffect(() => {
        if (loading) return // Skip if still loading

        // Setting the OpenAPI credentials and URL based on the existing URL or the default
        if (!existingUrl || URL.parse(existingUrl)?.origin === config.baseUrl) {
            console.log('Adding credentials to OpenAPI')
            OpenAPI.WITH_CREDENTIALS = true
        }

        if (existingUrl) {
            console.log('Setting OpenAPI url to:', existingUrl)
            OpenAPI.BASE = existingUrl
        } else {
            OpenAPI.BASE = config.baseUrl + '/api/routes/chap/run'
        }

        // Update the loading state now that we've set the URL
        setIsLoadingRouteConfig(false)
    }, [loading, existingUrl, config.baseUrl, setIsLoadingRouteConfig])

    if (loading) {
        return <>Loading...</>
    }

    return <></>
}

export default SetChapUrl
