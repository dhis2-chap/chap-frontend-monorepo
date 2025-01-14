import React, { useState } from 'react'
import PredictionHeader from '../features/predictions-overview/components/PredictionHeader/PredictionHeader'
import NewPredictionDrawer from '../features/new-prediction/NewPredictionDrawer'

const PredictionsPage = () => {

  const [newPredictionDrawerOpen, setNewPredictionDrawerOpen] = useState<boolean>(false)

  return (
    <div>
      <PredictionHeader setNewPredictionDrawerOpen={setNewPredictionDrawerOpen}/>
      <NewPredictionDrawer isOpen={newPredictionDrawerOpen} setIsOpen={setNewPredictionDrawerOpen} />
    </div>
  )
}

export default PredictionsPage