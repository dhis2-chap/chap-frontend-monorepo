import React, { useEffect, useState } from 'react'
import { boolean } from '@dhis2/ui'
import NewDatasetDrawer from '../new-dataset/components/NewDatasetDrawer/NewDatasetDrawer'
import PageHeader from '../common-features/PageHeader/PageHeader'
import Datasets from '../datasets/Datasets'
import PredictionResult from '../../components/results/PredictionResult'
import PredictionResults from '../prediction-results/PredictionResults'

const EvaluationOverview = () => {
    const [newDatasetDrawerOpen, setNewDatasetDrawerOpen] =
        useState<boolean>(false)

    const onDrawerSubmit = () => {
        setNewDatasetDrawerOpen(false)
    }

    return (
        <div>
            <PageHeader
                pageTitle="Datasets"
                setDrawerOpenText="New Dataset"
                setDrawerOpen={setNewDatasetDrawerOpen}
            />
            <PredictionResults type="datasets" />
            <NewDatasetDrawer
                isOpen={newDatasetDrawerOpen}
                onDrawerClose={() => setNewDatasetDrawerOpen(false)}
                onDrawerSubmit={onDrawerSubmit}
            />

            <PageHeader
                pageTitle="Evaluations"
            />
            <PredictionResults type="evaluations" />

        </div>
    )
}

export default EvaluationOverview
