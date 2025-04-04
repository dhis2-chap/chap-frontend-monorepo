import React, { useEffect, useState } from 'react'
import NewPredictionDrawer from '../new-prediction/NewPredictionDrawer'
import PredictionResults from '../prediction-results/PredictionResults'
import PageHeader from '../common-features/PageHeader/PageHeader'

const PredictionOverview = () => {
    const [newPredictionDrawerOpen, setNewPredictionDrawerOpen] =
        useState<boolean>(false)

    const [reRenderDatasetEvaluation, setReRenderDatasetEvaluation] =
        useState<boolean>(false)

    const onDrawerSubmit = () => {
        setReRenderDatasetEvaluation(false)
        setNewPredictionDrawerOpen(false)
    }

    //dirty solution, i know..
    useEffect(() => {
        setReRenderDatasetEvaluation(true)
    }, [reRenderDatasetEvaluation])

    return (
        <div>
            <PageHeader
                setDrawerOpen={setNewPredictionDrawerOpen}
                pageTitle="Import Predictions"
                setDrawerOpenText="New prediction"
            />
            <NewPredictionDrawer
                isOpen={newPredictionDrawerOpen}
                onDrawerClose={() => setNewPredictionDrawerOpen(false)}
                onDrawerSubmit={onDrawerSubmit}
            />
            {reRenderDatasetEvaluation && (
                <PredictionResults type="predictions" />
            )}
        </div>
    )
}

export default PredictionOverview
