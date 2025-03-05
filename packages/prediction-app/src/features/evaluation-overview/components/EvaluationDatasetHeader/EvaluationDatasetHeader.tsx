import React from 'react'
import styles from './EvaluationDatasetHeader.module.css'
import { Button, IconAdd24 } from '@dhis2/ui'

interface PredictionHeaderProps {
  setNewDatsetDrawerOpen: (isOpen: boolean) => void
}

const EvaluationDatasetHeader = ({setNewDatsetDrawerOpen} : PredictionHeaderProps) => {
  return (
    <div className={styles.evalutionDatasetHeader}>
        <h3>Datasets</h3>
        <Button onClick={() => setNewDatsetDrawerOpen(true)} icon={<IconAdd24/>} primary>Create dataset</Button>
    </div>
  )
}

export default EvaluationDatasetHeader