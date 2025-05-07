import { useConfig } from '@dhis2/app-runtime'
import React, { useEffect, useState } from 'react'
import { OpenAPI } from '@dhis2-chap/chap-lib'
import { CircularLoader } from '@dhis2/ui'

export const SetChapUrl = ({ children }: { children: React.ReactNode }) => {
    const { baseUrl } = useConfig()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        OpenAPI.WITH_CREDENTIALS = true
        OpenAPI.BASE = baseUrl + '/api/routes/chap/run'
        setIsReady(true)
    }, [baseUrl])

    if (!isReady) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularLoader />
            </div>
        )
    }

    return <>{children}</>
}

