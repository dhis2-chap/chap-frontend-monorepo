import React from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import PredictionPage from '../../components/prediction/PredictionPage'
import styles from "./NewPredictionDrawer.module.css"
import NewPredictionForm from './NewPredictionForm/NewPredictionForm'

interface NewPredictionDrawerProps {
  onDrawerClose : () => void
  isOpen : boolean
}

const NewPredictionDrawer = ({onDrawerClose, isOpen} : NewPredictionDrawerProps) => {

  const size = window.innerWidth < 900 ? '100vw' : '1000px'

  return (
    <div>
      <Drawer
            open={isOpen}
            onClose={onDrawerClose}
            direction='right'
            size={size}
        >
          <div className={styles.drawerWrapper}>
            <NewPredictionForm onDrawerClose={onDrawerClose}/>
          </div>
      </Drawer>
    </div>
  )
}

export default NewPredictionDrawer