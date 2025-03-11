import React, { useState } from 'react'
import PredictionHeader from './components/PredictionHeader/PredictionHeader'
import NewPredictionDrawer from '../new-prediction/NewPredictionDrawer'
import PredictionResults from '../prediction-results/PredictionResults'

const PredictionOverview = () => {
  const [newPredictionDrawerOpen, setNewPredictionDrawerOpen] = useState<boolean>(false)
  

  return (
    <div>
      <PredictionHeader setNewPredictionDrawerOpen={setNewPredictionDrawerOpen}/>
      <NewPredictionDrawer isOpen={newPredictionDrawerOpen} setIsOpen={setNewPredictionDrawerOpen} />
      <PredictionResults />
    </div>
  )
}

export default PredictionOverview