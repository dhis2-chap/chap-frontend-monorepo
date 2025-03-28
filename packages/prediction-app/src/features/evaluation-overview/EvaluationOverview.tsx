import React, { useEffect, useState } from 'react'
import { boolean } from '@dhis2/ui'
import NewDatasetDrawer from '../new-dataset/components/NewDatasetDrawer/NewDatasetDrawer'
import PageHeader from '../common-features/PageHeader/PageHeader'
import { EvaluationMediumTitle } from './EvaluationMediumTitle/EvaluationUnderTitle'
import Datasets from '../datasets/Datasets'
import PredictionResult from '../../components/results/PredictionResult'
import PredictionResults from '../prediction-results/PredictionResults'

const EvaluationOverview = () => {
    const [newDatasetDrawerOpen, setNewDatasetDrawerOpen] =
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
                pageTitle="Evaluation"
                setDrawerOpenText="New dataset"
                setDrawerOpen={setNewDatasetDrawerOpen}
            />
            <NewDatasetDrawer
                isOpen={newDatasetDrawerOpen}
                onDrawerClose={() => setNewDatasetDrawerOpen(false)}
                onDrawerSubmit={onDrawerSubmit}
            />

            <EvaluationMediumTitle title="Datasets" />
            {reRenderDatasetEvaluation && <PredictionResults type="datasets" />}

            <EvaluationMediumTitle title="Results" />
            {reRenderDatasetEvaluation && (
                <PredictionResults type="evaluations" />
            )}
        </div>
    )
}

export default EvaluationOverview
