import { Button, IconSettings24, Menu, MenuItem } from '@dhis2/ui'
import React from 'react'
import styles from './NavBar.module.css'
import NavBarItem from './components/NavBarItem/NavBarItem'
import { useHistory } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const maxWidth: string = '1400px'

const navBarItems = [
    {
        label: 'Evaluate',
        path: '/evaluate',
    },
    {
        label: 'Predict',
        path: '/predict',
    },
]

const NavBar = () => {
    const navigate = useNavigate()

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
                    <Button
                        small
                        icon={<IconSettings24 />}
                        onClick={handleSettingsClick}
                    >
                        Settings
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NavBar
