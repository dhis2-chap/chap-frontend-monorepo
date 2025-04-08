import React, { useEffect, useState } from 'react'
import { InputField, Button, IconSave24, IconArrowRight16 } from '@dhis2/ui'
import styles from './CreateRoute.module.css'
import TestRoute from './Settings'
import { useNavigate, useRoutes } from 'react-router-dom'
import useGetRoute from '../../hooks/useGetRoute'
import { useConfig } from '@dhis2/app-runtime'
import useCreateUpdateRoute from '../../hooks/useCreateUpdateRoute'

const Setup = () => {
    const routeDocUrl =
        'https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/route.html'
    const chapInfoUrl = 'https://github.com/dhis2-chap/chap-core'

    const [url, setUrl] = useState<string>('')
    const [existingRoute, setExistingRoute] = useState<
        { id: string; url: string } | undefined
    >(undefined)

    const { mutate, error, loading, called, engine } =
        useCreateUpdateRoute(existingRoute)

    const {
        loading: loadingGetRoute,
        route,
        error: routeFetchError,
    } = useGetRoute()

    const { baseUrl } = useConfig()

    const onClickSave = async () => {
        await mutate({
            id: existingRoute?.id,
            url: url,
        })
    }

    useEffect(() => {
        if (route) {
            setUrl(route.url)
            setExistingRoute(route)
        }
    }, [route])

    const naviagteToTestRoute = () => {
        window.location.replace('#/settings')
    }

    return (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <h2>Configure route</h2>
                <p>
                    CHAP requires that you set up a{' '}
                    <a about="_blank" href={routeDocUrl}>
                        route
                    </a>{' '}
                    in DHIS2 to enable communication with the CHAP Core server.
                </p>
                <p>
                    You also needs to set up the CHAP server itself. Setup guide
                    <a about="_blank" href={chapInfoUrl}>
                        {' '}
                        github.com/dhis2/chap-core
                    </a>
                    .
                </p>
                <p>
                    By clicking "Save" you create a new route in DHIS2, with
                    name 'chap' and code 'chap'.
                </p>
                <p>
                    <a about="_blank" href={baseUrl + '/api/routes?fields=*'}>
                        Existing routes in DHIS2 ➔
                    </a>
                </p>

                <InputField
                    value={url}
                    onChange={(e: any) => setUrl(e.value)}
                    placeholder="http://chap:8000/**"
                    label="URL"
                />
                <div className={styles.sendButton}>
                    <Button
                        disabled={called || url === ''}
                        onClick={onClickSave}
                        icon={<IconSave24 />}
                        primary
                    >
                        Save
                    </Button>
                </div>
                {called && !error && !loading && (
                    <>
                        <p className={styles.ok}>Route successfully created!</p>
                        <div className={styles.sendButton}>
                            <Button
                                icon={<IconArrowRight16 />}
                                onClick={naviagteToTestRoute}
                            >
                                Test route
                            </Button>
                        </div>
                    </>
                )}

                <p>{loading && 'Setting up route...'}</p>
            </div>
            {error && (
                <div className={styles.error}>
                    <span>
                        ERROR
                        <pre>{JSON.stringify(error, null, 2)}</pre>
                    </span>
                </div>
            )}
        </div>
    )
}

export default Setup
