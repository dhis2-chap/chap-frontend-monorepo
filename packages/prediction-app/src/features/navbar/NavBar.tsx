import { Button, IconSettings24 } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import styles from './NavBar.module.css'
import NavBarItem from './components/NavBarItem/NavBarItem'
import { useLocation, useNavigate } from 'react-router-dom'

export const maxWidth: string = '1400px'

const navBarItems = [
    {
        label: 'Evaluate',
        path: '/evaluate',
    },
    {
        label: i18n.t('Active jobs'),
        path: '/active-jobs',
    },
    {
        label: 'Predict',
        path: '/predict',
    },
]

const NavBar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const handleSettingsClick = () => {
        navigate('/settings')
    }

    return (
        <div>
            <div className={styles.outerNavBar}>
                <div
                    className={styles.innerNavBar}
                    style={{ maxWidth: maxWidth }}
                >
                    <div className={styles.leftNavBarLinks}>
                        {navBarItems.map(({ path, label }, i) => (
                            <NavBarItem key={i} path={path} label={label} />
                        ))}
                    </div>
                    {pathname !== '/settings' && (
                        <Button
                            icon={<IconSettings24 />}
                            onClick={handleSettingsClick}
                        >
                            {i18n.t('Settings')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavBar
