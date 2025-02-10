import { Button, IconArrowRight24 } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { DefaultService, OpenAPI } from '@dhis2-chap/chap-lib'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/TestRoute.module.css'
import useGetRoute from '../../hooks/useGetRoute'

const TestRoute = () => {
    const [status, setStatus] = useState(undefined)
    const [errorMessage, setErrorMessage] = useState('')

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

    return (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <h2>Test connection to CHAP</h2>
                <div className={styles.link}>
                    <Button primary onClick={naviagteToTestRoute}>
                        Create/edit route ➔
                    </Button>
                </div>

                <p>
                    <b>Prediction App is connecting to CHAP Core trough: </b>
                    {OpenAPI.BASE}
                </p>

                {route && (
                    <>
                        <b>Current route</b>

                        <table className={styles.table}>
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
                )}

                <h3>Test result:</h3>

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
        </div>
    )
}

export default TestRoute
