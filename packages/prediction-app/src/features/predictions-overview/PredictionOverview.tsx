import React, { useState } from 'react'
import NewPredictionDrawer from '../new-prediction/NewPredictionDrawer'
import PredictionResults from '../prediction-results/PredictionResults'
import PageHeader from '../common-features/PageHeader/PageHeader'

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
            <PageHeader
                setDrawerOpen={setNewPredictionDrawerOpen}
                pageTitle="Predictions"
                setDrawerOpenText="New prediction"
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
