import { Button, IconSettings24, Menu, MenuItem } from '@dhis2/ui'
import React from 'react'
import styles from './NavBar.module.css'
import NavBarItem from './components/NavBarItem/NavBarItem'
import { maxWidth } from '../../components/PageWrapper'

const navBarItems = [
    {
        label: 'Evaluate',
        path: '/evaluate',
    },
    {
        label: 'Import',
        path: '/import',
    },
]

const NavBar = () => {
    const handleSettingsClick = () => {
        window.location.replace('/#settings')
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
