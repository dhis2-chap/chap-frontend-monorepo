import React from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import PredictionPage from '../../components/prediction/PredictionPage'
import styles from "./NewPredictionDrawer.module.css"

interface NewPredictionDrawerProps {
  setIsOpen : (isOpen: boolean) => void
  isOpen : boolean
}

const NewPredictionDrawer = ({setIsOpen, isOpen} : NewPredictionDrawerProps) => {
  return (
    <div>
            <Drawer
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  direction='right'
                  size="60vw"
              >
                <div className={styles.drawerWrapper}>
                  <PredictionPage/>
                </div>
            </Drawer>
    </div>
  )
}

export default NewPredictionDrawer