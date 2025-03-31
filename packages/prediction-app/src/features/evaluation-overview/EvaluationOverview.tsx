import React, { useState } from 'react'
import { boolean } from '@dhis2/ui'
import NewDatasetDrawer from '../new-dataset/components/NewDatasetDrawer/NewDatasetDrawer'
import NewEvaluationDrawer from '../new-evaluation/components/NewEvaluationDrawer'
import PageHeader from '../common-features/PageHeader/PageHeader'
import Datasets from '../datasets/Datasets'

const EvaluationOverview = () => {
    const [newDatasetDrawerOpen, setNewDatasetDrawerOpen] =
        useState<boolean>(false)
    const [newEvaluationDrawerOpen, setNewEvaluationDrawerOpen] =
        useState<boolean>(false)

    return (
        <div>
            <PageHeader
                pageTitle="Datasets"
                setDrawerOpenText="New Dataset"
                setDrawerOpen={setNewDatasetDrawerOpen}
            />
            <Datasets />
            <NewDatasetDrawer
                isOpen={newDatasetDrawerOpen}
                setIsOpen={setNewDatasetDrawerOpen}
            />

            <PageHeader
                pageTitle="Evaluations"
                setDrawerOpenText="New Evaluation"
                setDrawerOpen={setNewEvaluationDrawerOpen}
            />
            <NewEvaluationDrawer
                isOpen={newEvaluationDrawerOpen}
                setIsOpen={setNewEvaluationDrawerOpen}
            />
        </div>
    )
}

export default EvaluationOverview
