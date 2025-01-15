import React from 'react'
import styles from './EvaluationDatasetHeader.module.css'
import { Button, IconAdd16 } from '@dhis2/ui'

interface PredictionHeaderProps {
  setNewDatsetDrawerOpen: (isOpen: boolean) => void
}

const EvaluationDatasetHeader = ({setNewDatsetDrawerOpen} : PredictionHeaderProps) => {
  return (
    <div className={styles.evalutionDatasetHeader}>
        <h2>Predictions</h2>
        <Button onClick={() => setNewDatsetDrawerOpen(true)} icon={<IconAdd16/>} primary>Create dataset</Button>
    </div>
  )
}

export default EvaluationDatasetHeader