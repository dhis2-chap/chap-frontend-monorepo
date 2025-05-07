import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Button, IconArrowLeft16 } from '@dhis2/ui'
import styles from './Settings.module.css'
import { useNavigate } from 'react-router-dom'
import { RouteSettings } from './RouteSettings'
import { ChapSettings } from './ChapSettings'
import { useRoute } from '../../hooks/useRoute'

export const maxWidth: string = '1400px'

const style: React.CSSProperties = {
    maxWidth: maxWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px 10px 20px 10px',
}

export const SettingsPage = () => {
    const navigate = useNavigate()
    const { route } = useRoute();

    return (
        <div style={style}>
            <div className={styles.settingsContainer}>
                <div>
                    <Button
                        small
                        onClick={() => navigate('/')}
                        icon={<IconArrowLeft16 />}
                    >
                        {i18n.t('Back to main page')}
                    </Button>
                </div>

                <RouteSettings />

                {route && <ChapSettings route={route} />}
            </div>
        </div>
    )
}
