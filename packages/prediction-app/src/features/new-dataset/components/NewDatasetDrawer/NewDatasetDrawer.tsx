import React from 'react'
import styles from './NewDatasetDrawer.module.css'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import NewDatasetForm from '../NewDatasetForm/NewDatasetForm'
import NewDatasetStepper from '../NewDatasetStepper/NewDatasetStepper'

interface NewDatasetDrawerProps{
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const NewDatasetDrawer = ({isOpen, setIsOpen} : NewDatasetDrawerProps) => {

  const size = window.innerWidth < 900 ? '100vw' : '1000px'

  return (
    <div>
        <Drawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            direction='right'
            size={size}
        >
      <div className={styles.drawerWrapper}>
        <NewDatasetStepper/>
      </div>
      </Drawer>
    </div>
  )
}

export default NewDatasetDrawer