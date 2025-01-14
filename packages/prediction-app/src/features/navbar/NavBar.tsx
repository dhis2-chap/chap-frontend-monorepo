import { Menu, MenuItem } from '@dhis2/ui'
import React from 'react'
import styles from './NavBar.module.css'
import NavBarItem from './components/NavBarItem/NavBarItem'
import { maxWidth } from '../../components/PageWrapper'


const navBarItems = [
  {
    label: 'Predictions',
    path : '/',
  },
  {
    label: 'Evaluation',
    path : '/evaluations',
  },
  {
    label: 'Settings',
    path : '/settings',
  },


]

const NavBar = () => {
  return (
    <div>
      <div className={styles.outerNavBar}>
        <div className={styles.innerNavBar} style={{maxWidth : maxWidth}}>
         {navBarItems.map(({ path, label }, i) => (
          <NavBarItem key={i} path={path} label={label}/>
         ))}
        </div>
      </div>
    </div>
  )
}

export default NavBar