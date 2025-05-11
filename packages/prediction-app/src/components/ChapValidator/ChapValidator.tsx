import React, { useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import { Button, Card, NoticeBox } from '@dhis2/ui'
import { CircularLoader } from '@dhis2/ui'
import { useNavigate } from 'react-router-dom'
import styles from './ChapValidator.module.css'
import { useChapStatus } from '../../features/settings/ChapSettings/hooks/useChapStatus'
import { useRoute } from '../../hooks/useRoute'

type Props = {
    children: React.ReactNode
}

export const ChapValidator = ({ children }: Props) => {
    const { route } = useRoute()
    const { status, error, isLoading } = route ? useChapStatus({ route }) : { status: undefined, error: undefined, isLoading: false }
    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            console.error('CHAP connection error:', error)
        }
    }, [error])

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularLoader />
            </div>
        )
    }

    if (error || !status) {
        return (
            <div className={styles.errorContainer}>
                <Card>
                    <div className={styles.errorContent}>
                        <NoticeBox error title={i18n.t('Unable to connect to CHAP')}>
                            {i18n.t('The app is not able to connect to the CHAP server. Please check your route configuration and make sure the CHAP server is running.')}
                        </NoticeBox>
                        <div className={styles.errorActions}>
                            <Button onClick={() => navigate('/settings')}>
                                {i18n.t('Check settings')}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    return children
}
