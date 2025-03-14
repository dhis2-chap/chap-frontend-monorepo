import { Button, IconArrowRight24 } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { DefaultService, OpenAPI } from '@dhis2-chap/chap-lib'
import { Link, useNavigate } from 'react-router-dom'
import styles from './TestRoute.module.css'
import useGetRoute from '../../hooks/useGetRoute'
import { useConfig } from '@dhis2/app-runtime'

const Settings = () => {
    const [status, setStatus] = useState(undefined)
    const [errorMessage, setErrorMessage] = useState('')
    const [showRouteDetails, setShowRouteDetails] = useState(false)

    const { route } = useGetRoute()

    const [isLoading, setIsLoading] = useState(false)

    const fetchStatus = async () => {
        setErrorMessage('')
        setStatus(undefined)
        setIsLoading(true)
        await DefaultService.getStatusStatusGet()
            .catch((error: any) => {
                setErrorMessage(error)
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

    const naviagteHome = () => {
        window.location.replace('/')
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
                        <Button small primary onClick={naviagteToTestRoute}>
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

            <h3>Healthy result:</h3>

            {isLoading && <p>Loading...</p>}

            {status && (
                <div className={styles.status_ok}>
                    {status && <pre>{JSON.stringify(status, null, 2)}</pre>}
                </div>
            )}
            {errorMessage && (
                <div className={styles.errorContainer}>
                    <p className={styles.status_not_ok}>
                        <pre>{JSON.stringify(errorMessage, null, 2)}</pre>
                    </p>
                </div>
            )}
        </div>
    )
}

export default Settings
