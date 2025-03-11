import React, { useState } from 'react'
import EvaluationDatasetHeader from './components/EvaluationDatasetHeader/EvaluationDatasetHeader'
import { boolean } from '@dhis2/ui'
import NewDatasetDrawer from '../new-dataset/components/NewDatasetDrawer/NewDatasetDrawer'

const EvaluationOverview = () => {

  const [newDatsetDrawerOpen, setNewDatsetDrawerOpen] = useState<boolean>(false)

  return (
    <div>
      
      <h2>Evaluations</h2>
      <EvaluationDatasetHeader setNewDatsetDrawerOpen={setNewDatsetDrawerOpen} />
      <NewDatasetDrawer isOpen={newDatsetDrawerOpen} setIsOpen={setNewDatsetDrawerOpen} />


      <h3>Results</h3>
    </div>
  )
}

export default EvaluationOverview