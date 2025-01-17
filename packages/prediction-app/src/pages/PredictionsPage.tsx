import React, { useState } from 'react'
import PredictionHeader from '../features/predictions-overview/components/PredictionHeader/PredictionHeader'
import NewPredictionDrawer from '../features/new-prediction/NewPredictionDrawer'
import PredictionOverview from '../features/predictions-overview/PredictionOverview'

const PredictionsPage = () => {

  return (
    <div>
      <PredictionOverview/>
    </div>
  )
}

export default PredictionsPage