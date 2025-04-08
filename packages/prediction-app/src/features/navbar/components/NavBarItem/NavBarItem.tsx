import { MenuItem } from '@dhis2/ui'
import React from 'react'
import { useResolvedPath } from 'react-router-dom'

interface MenuItemProps {
  path : string
  label : string
}

const NavBarItem = ({path, label} : MenuItemProps) => {
  const { pathname } = useResolvedPath({});

  return (
       <MenuItem label={label}
        href={`#${path}`} 
        active={
          pathname === path ||
          (path !== "/" && pathname.startsWith(path))
        }/>
  )
}

export default NavBarItem