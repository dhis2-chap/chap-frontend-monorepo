import React, { useState } from 'react'
import { boolean } from '@dhis2/ui'
import NewDatasetDrawer from '../new-dataset/components/NewDatasetDrawer/NewDatasetDrawer'
import PageHeader from '../common-features/PageHeader/PageHeader'
import { EvaluationMediumTitle } from './EvaluationMediumTitle/EvaluationUnderTitle'
import Datasets from '../datasets/Datasets'

const EvaluationOverview = () => {
    const [newDatasetDrawerOpen, setNewDatasetDrawerOpen] =
        useState<boolean>(false)

    return (
        <div>
            <PageHeader
                pageTitle="Evaluation"
                setDrawerOpenText="New dataset"
                setDrawerOpen={setNewDatasetDrawerOpen}
            />
            <NewDatasetDrawer
                isOpen={newDatasetDrawerOpen}
                setIsOpen={setNewDatasetDrawerOpen}
            />

            <EvaluationMediumTitle title="Datasets" />
            <Datasets />

            <EvaluationMediumTitle title="Results" />
        </div>
    )
}

export default EvaluationOverview
