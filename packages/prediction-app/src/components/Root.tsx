import { Fragment, useState } from 'react'
import { CssVariables, CssReset, Menu, MenuItem } from '@dhis2/ui'
import { Outlet, useResolvedPath } from 'react-router-dom'
import styles from './styles/Root.module.css'
import { useConfig } from '@dhis2/app-runtime'
import React from 'react'
import WarnRouteNotExists from './setup/WarnRouteNotExists'
import SetOpenApiUrl from './setup/SetOpenApiUrl'
import useGetDataStore from '../hooks/useGetDataStore'
import { OpenAPI } from '@dhis2-chap/chap-lib'

export const appPages = [
    { path: '/', name: '1 | Train and predict' },
    { path: '/status', name: '2 | CHAP Core status' },
    { path: '/results', name: '3 | Results' },
]

const Root = () => {
    const { pathname } = useResolvedPath({})
    const [isSetOpenApiUrlModalOpen, setIsSetOpenApiUrlModalOpen] =
        useState<boolean>(false)

    const {
        error,
        loading,
        url: existingUrl,
        fetching,
    } = useGetDataStore('backend-url')

    const config = useConfig()

    if (loading) {
        return <></>
    } else {
        //if url is not set OR url is set do DHIS2 instance (using route api) add credentials
        if (!existingUrl || URL.parse(existingUrl)?.origin === config.baseUrl) {
            console.log('Adding credentials to OpenAPI')
            OpenAPI.WITH_CREDENTIALS = true
        }

        if (existingUrl) {
            console.log('Setting OpenAPI url to: ', existingUrl)
            OpenAPI.BASE = existingUrl
        } else {
            OpenAPI.BASE = config.baseUrl + '/api/routes/chap/run'
        }
    }

    return (
        <>
            <CssReset />
            <CssVariables spacers colors />
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <Menu>
                        <div className={styles.menuTitle}>Predictions</div>

                        {appPages.map(({ path, name }) => (
                            <Fragment key={path}>
                                <MenuItem
                                    label={name}
                                    href={`#${path}`}
                                    active={
                                        pathname === path ||
                                        (path !== '/' &&
                                            pathname.startsWith(path))
                                    }
                                />
                            </Fragment>
                        ))}
                        <div className={styles.menuTitle}>Settings</div>
                        <Fragment key={'settings'}>
                            <MenuItem
                                onClick={() =>
                                    setIsSetOpenApiUrlModalOpen(true)
                                }
                                label="Edit CHAP-Core url"
                            />
                        </Fragment>
                        <Fragment key={'route-settings'}>
                            <MenuItem
                                label="Routes API settings"
                                href={`#/route-settings`}
                                active={pathname === 'route-settings'}
                            />
                        </Fragment>
                        {isSetOpenApiUrlModalOpen && (
                            <SetOpenApiUrl
                                existingUrl={existingUrl}
                                fetching={fetching}
                                loading={loading}
                                setOpen={setIsSetOpenApiUrlModalOpen}
                            />
                        )}
                    </Menu>
                </div>
                <main className={styles.content}>
                    <WarnRouteNotExists />
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Root
