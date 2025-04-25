import React from 'react'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useNavigate } from 'react-router-dom'
import {
    Button,
    IconArrowRight16,
    InputFieldFF,
    NoticeBox,
    ReactFinalForm,
} from '@dhis2/ui'
import styles from './CreateRoute.module.css'
import useGetRoute from '../../hooks/useGetRoute'
import useCreateUpdateRoute from '../../hooks/useCreateUpdateRoute'

const routeDocUrl =
    'https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/route.html'
const chapInfoUrl = 'https://github.com/dhis2-chap/chap-core'

const CreateRoute = () => {
    const navigate = useNavigate()
    const { baseUrl } = useConfig()
    const {
        route,
        isLoading,
        error: routeFetchError,
    } = useGetRoute()

    const { mutate, error, loading, called } =
        useCreateUpdateRoute(route)

    const onClickSave = async (data: unknown) => {
        alert(JSON.stringify(data))
    }

    const naviagteToTestRoute = () => navigate('/settings')

    if (!route) {
        return (
            <div className={styles.outerContainer}>
                <div className={styles.container}> 
                    <h2>{i18n.t('Configure route')}</h2>

                    <NoticeBox warning title={i18n.t('Warning')}>
                        {i18n.t('This will create a new public route in DHIS2. Every logged in user will be able to access this route unless you set up authorities for the route.')}
                    </NoticeBox>

                    <ReactFinalForm.Form onSubmit={onClickSave}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <ReactFinalForm.Field
                                    name='url'
                                    type='text'
                                    label={i18n.t('URL')}
                                    required
                                    component={InputFieldFF}
                                />

                                <div className={styles.sendButton}>
                                    <Button
                                        type="submit"
                                        primary
                                    >
                                        {i18n.t('Save')}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </ReactFinalForm.Form>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <h2>{i18n.t('Configure route')}</h2>
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

                <div className={styles.sendButton}>
                    {route && (
                        <Button
                            onClick={() => navigate('/settings')}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    )}
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

export default CreateRoute;
