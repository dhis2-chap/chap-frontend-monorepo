import React from 'react'
import styles from './PredictionHeader.module.css'
import { Button, IconAdd16 } from '@dhis2/ui'

interface PredictionHeaderProps {
  setNewPredictionDrawerOpen: (isOpen: boolean) => void
}

const PredictionHeader = ({setNewPredictionDrawerOpen} : PredictionHeaderProps) => {
  return (
    <div className={styles.predictionHeader}>
      <h2>Predictions</h2>
      <Button onClick={() => setNewPredictionDrawerOpen(true)} icon={<IconAdd16/>} primary>Create new prediction</Button>
    </div>
  )
}

export default PredictionHeader