import { Button, IconArrowRight24 } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { ApiError, DefaultService, OpenAPI } from '@dhis2-chap/chap-lib'
import { Link, useNavigate } from 'react-router-dom'
import styles from './TestRoute.module.css'
import useGetRoute from '../../hooks/useGetRoute'
import { useConfig } from '@dhis2/app-runtime'
import SetOpenApiUrl from './SetOpenApiUrl'
import useGetDataStore from '../../new-view-hooks/useGetDataStore'

const Settings = () => {
    const [status, setStatus] = useState<any>(undefined)
    const [errorMessage, setErrorMessage] = useState<any>(undefined)
    const [showRouteDetails, setShowRouteDetails] = useState(false)
    const [isSetOpenApiUrlModalOpen, setIsSetOpenApiUrlModalOpen] =
        useState<boolean>(false)

    const { route } = useGetRoute()

    const {
        error,
        loading,
        url: existingUrl,
        fetching,
    } = useGetDataStore('backend-url')

    const [isLoading, setIsLoading] = useState(false)

    const fetchStatus = async () => {
        setErrorMessage('')
        setStatus(undefined)
        setIsLoading(true)
        await DefaultService.healthHealthGet()
            .catch((error: ApiError) => {
                setErrorMessage({
                    body: error?.body,
                    status: error?.status,
                    statusText: error?.statusText,
                    r: error?.request,
                    message: error?.message,
                    name: error?.name,
                    url: error?.url,
                })
                setIsLoading(false)
            })
            .then((status: any) => {
                setStatus(status)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchStatus()
    }, [])

    const naviagteToTestRoute = () => {
        window.location.replace('#/route/create-route')
    }

    const getRouteDetails = () => {
        return (
            <>
                <table>
                    <tbody>
                        <tr>
                            <td>name</td>
                            <td>{route?.name}</td>
                        </tr>
                        <tr>
                            <td>url</td>
                            <td>{route?.url}</td>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>{route?.id}</td>
                        </tr>
                        <tr>
                            <td>headers</td>
                            <td>{JSON.stringify(route?.headers)}</td>
                        </tr>
                        <tr>
                            <td>code</td>
                            <td>{route?.code}</td>
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }

    const config = useConfig()

    return (
        <div className={styles.container}>
            <h2>Settings</h2>

            <table className={styles.settingsTable}>
                <tr>
                    <td className={styles.cellTable}>
                        <b>{config?.appName} is connecting to Chap Core via:</b>
                    </td>
                    <td className={styles.cellTable}>{OpenAPI?.BASE}</td>
                    <td className={styles.cellTable}></td>
                    <td className={styles.cellTableLarge}>
                        <Button
                            small
                            primary
                            loading={loading}
                            onClick={() => setIsSetOpenApiUrlModalOpen(true)}
                        >
                            Edit Chap core URL ➔
                        </Button>
                    </td>
                </tr>
                <tr>
                    <td className={styles.cellTable}>
                        <b>DHIS2 is connecting to Chap Core through:</b>
                    </td>
                    <td className={styles.cellTable}>
                        {route?.url} <br />
                    </td>
                    <td className={styles.cellTableLarge}>
                        <Button
                            small
                            onClick={() =>
                                setShowRouteDetails(!showRouteDetails)
                            }
                        >
                            {showRouteDetails
                                ? 'Hide route details'
                                : 'Show route details'}
                        </Button>
                        {showRouteDetails && getRouteDetails()}
                    </td>
                    <td className={styles.cellTable}>
                        <Button small primary onClick={naviagteToTestRoute}>
                            Create/edit route ➔
                        </Button>
                    </td>
                </tr>
            </table>

            <h3>Healthy status:</h3>

            {isLoading && <p>Loading...</p>}

            {status && (
                <div
                    className={
                        status?.status !== 'success'
                            ? styles.status_not_ok
                            : styles.status_ok
                    }
                >
                    {status && <pre>{JSON.stringify(status, null, 2)}</pre>}
                </div>
            )}
            {errorMessage && (
                <div className={styles.errorContainer}>
                    <h3>
                        Error:{' '}
                        {errorMessage &&
                            'Unable to establish connection with Chap Core.'}
                    </h3>
                    <p>
                        <pre>{JSON.stringify(errorMessage, null, 2)}</pre>
                    </p>
                </div>
            )}

            {isSetOpenApiUrlModalOpen && (
                <SetOpenApiUrl
                    existingUrl={existingUrl}
                    fetching={fetching}
                    loading={loading}
                    setOpen={setIsSetOpenApiUrlModalOpen}
                />
            )}
        </div>
    )
}

export default Settings
