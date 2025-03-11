import React from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import PredictionPage from '../../components/prediction/PredictionPage'
import styles from "./NewPredictionDrawer.module.css"
import NewPredictionForm from './NewPredictionForm/NewPredictionForm'

interface NewPredictionDrawerProps {
  setIsOpen : (isOpen: boolean) => void
  isOpen : boolean
}

const NewPredictionDrawer = ({setIsOpen, isOpen} : NewPredictionDrawerProps) => {

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
            <NewPredictionForm onClose={() => setIsOpen(false)}/>
          </div>
      </Drawer>
    </div>
  )
}

export default NewPredictionDrawer