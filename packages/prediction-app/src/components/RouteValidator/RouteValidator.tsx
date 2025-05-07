import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { useRoute } from '../../hooks/useRoute'
import { Button, CircularLoader } from '@dhis2/ui'
import { Card } from '@dhis2-chap/chap-lib'
import { useNavigate } from 'react-router-dom'
import styles from './RouteValidator.module.css'

type Props = {
    children: React.ReactNode
}

// This is the icon for the Capture app. Replace this before merging.
const EmptyStateIcon = () => (
    <svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#F3F5F7" d="M0 0h64v64H0z" />
        <path fill="#F3F5F7" stroke="#A0ADBA" strokeWidth="2" d="M4 13h36v48H4z" />
        <path fill="#F3F5F7" stroke="#A0ADBA" strokeWidth="2" d="M10 8h40v53H10z" />
        <path fill="#F3F5F7" stroke="#404B5A" strokeWidth="2" d="M16 3h44v58H16z" />
        <path fill="#F3F5F7" stroke="#404B5A" strokeWidth="2" d="M22 9h32v16H22z" />
        <path d="M26 14h21M26 19h11" stroke="#404B5A" strokeWidth="2" />
        <path fill="#F3F5F7" stroke="#A0ADBA" strokeWidth="2" d="M22 33h32v16H22z" />
        <path d="M26 38h21M26 43h11" stroke="#A0ADBA" strokeWidth="2" />
    </svg>
);

export const RouteValidator = ({ children }: Props) => {
    const { route, isLoading, error } = useRoute()
    const navigate = useNavigate()

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularLoader />
            </div>
        )
    }

    if (!route) {
        return (
            <div className={styles.noRouteContainer}>
                <div className={styles.noRouteContent}>
                    <EmptyStateIcon />

                    <h1 className={styles.noRouteTitle}>{i18n.t('Get started with the Modeling app')}</h1>

                    <div className={styles.noRouteText}>
                        <p>{i18n.t('To get started with the Modeling app, please create a route that points to a running CHAP server.')}</p>
                        <p>{i18n.t('Open the settings page to configure the required configuration. Not sure what this is?')}</p>
                        <a
                            href="https://github.com/dhis2-chap/chap-core/wiki"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.noRouteLink}
                        >
                            {i18n.t('Learn more about CHAP')}
                        </a>
                    </div>


                    <Button primary onClick={() => navigate('/settings')}>
                        {i18n.t('Open settings')}
                    </Button>
                </div>
            </div>
        )
    }

    return children
}