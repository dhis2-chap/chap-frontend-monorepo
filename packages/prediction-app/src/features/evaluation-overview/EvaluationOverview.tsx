import React, { useEffect, useState } from 'react'
import { boolean } from '@dhis2/ui'
import NewDatasetDrawer from '../new-dataset/components/NewDatasetDrawer/NewDatasetDrawer'
import NewEvaluationDrawer from '../new-evaluation/components/NewEvaluationDrawer'
import PageHeader from '../common-features/PageHeader/PageHeader'
import Datasets from '../datasets/Datasets'
import PredictionResult from '../../components/results/PredictionResult'
import PredictionResults from '../prediction-results/PredictionResults'

const EvaluationOverview = () => {
    const [newDatasetDrawerOpen, setNewDatasetDrawerOpen] =
        useState<boolean>(false)
    const [newEvaluationDrawerOpen, setNewEvaluationDrawerOpen] =
        useState<boolean>(false)

    const [reRenderDatasetEvaluation, setReRenderDatasetEvaluation] =
        useState<boolean>(false)

    const onDrawerSubmit = () => {
        setReRenderDatasetEvaluation(false)
        setNewDatasetDrawerOpen(false)
    }

    //dirty solution, i know..
    useEffect(() => {
        setReRenderDatasetEvaluation(true)
    }, [reRenderDatasetEvaluation])

    return (
        <div>
            <PageHeader
                pageTitle="Datasets"
                setDrawerOpenText="New Dataset"
                setDrawerOpen={setNewDatasetDrawerOpen}
            />
            {reRenderDatasetEvaluation && <PredictionResults type="datasets" />}
            <NewDatasetDrawer
                isOpen={newDatasetDrawerOpen}
                onDrawerClose={() => setNewDatasetDrawerOpen(false)}
                onDrawerSubmit={onDrawerSubmit}
            />

            <PageHeader
                pageTitle="Evaluations"
                setDrawerOpenText="New Evaluation"
                setDrawerOpen={setNewEvaluationDrawerOpen}
            />
            {reRenderDatasetEvaluation && <PredictionResults type="evaluations" />}
            <NewEvaluationDrawer
                isOpen={newEvaluationDrawerOpen}
                setIsOpen={setNewEvaluationDrawerOpen}
            />
            
        </div>
    )
}

export default EvaluationOverview
