import { useConfig } from '@dhis2/app-runtime'
import React, { useEffect, useState, useRef } from 'react'
import { ApiError, enableQueue, OpenAPI } from '@dhis2-chap/chap-lib'
import { CircularLoader } from '@dhis2/ui'
import { useQueryClient } from '@tanstack/react-query'

type Queue = ReturnType<typeof enableQueue>

export const SetChapUrl = ({ children }: { children: React.ReactNode }) => {
    const { baseUrl } = useConfig()
    const [isReady, setIsReady] = useState(false)
    const queryClient = useQueryClient()
    const queueRef = useRef<Queue>()

    useEffect(() => {
        OpenAPI.WITH_CREDENTIALS = true
        OpenAPI.BASE = baseUrl + '/api/routes/chap/run'

        queryClient.setDefaultOptions({
            queries: {
                retry: (failureCount, error) => {
                    // Route API has issues with 503 errors
                    // retry and enable queueing
                    if (error instanceof ApiError && error.status > 500) {
                        if (queueRef.current == undefined) {
                            queueRef.current = enableQueue({
                                concurrency: 2,
                            })
                        }
                        if (failureCount > 0 && queueRef.current?.concurrency) {
                            console.log('set API request concurrency to 1')
                            queueRef.current.concurrency = 1
                        }
                        return failureCount < 2
                    }
                    return false
                },
            },
        })
        setIsReady(true)
    }, [baseUrl, queryClient])

    if (!isReady) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularLoader />
            </div>
        )
    }

    return <>{children}</>
}
