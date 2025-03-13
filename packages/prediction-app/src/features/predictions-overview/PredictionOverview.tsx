import React, { useState } from 'react'
import PredictionHeader from './components/PredictionHeader/PredictionHeader'
import NewPredictionDrawer from '../new-prediction/NewPredictionDrawer'
import PredictionResults from '../prediction-results/PredictionResults'

const PredictionOverview = () => {
    const [newPredictionDrawerOpen, setNewPredictionDrawerOpen] =
        useState<boolean>(false)
    const [triggerUpdateJobs, setTriggerUpdateJobs] = useState({})

    const onDrawerClose = () => {
        setNewPredictionDrawerOpen(false)
        setTriggerUpdateJobs({})
    }

    return (
        <div>
            <PredictionHeader
                setNewPredictionDrawerOpen={setNewPredictionDrawerOpen}
            />
            <NewPredictionDrawer
                isOpen={newPredictionDrawerOpen}
                onDrawerClose={onDrawerClose}
            />
            <PredictionResults triggerUpdateJobs={triggerUpdateJobs} />
        </div>
    )
}

export default PredictionOverview
