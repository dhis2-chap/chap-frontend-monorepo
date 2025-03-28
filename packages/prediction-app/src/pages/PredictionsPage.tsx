import React, { useState } from 'react'

import NewPredictionDrawer from '../features/new-prediction/NewPredictionDrawer'
import PredictionOverview from '../features/predictions-overview/PredictionOverview'

const PredictionsPage = () => {
    return (
        <div>
            <PredictionOverview />
        </div>
    )
}

export default PredictionsPage
