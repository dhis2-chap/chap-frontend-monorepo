import React, { useState } from 'react'
import { boolean } from '@dhis2/ui'
import NewDatasetDrawer from '../new-dataset/components/NewDatasetDrawer/NewDatasetDrawer'
import PageHeader from '../common-features/PageHeader/PageHeader'
import { EvaluationMediumTitle } from './EvaluationMediumTitle/EvaluationUnderTitle'

const EvaluationOverview = () => {
    const [newDatsetDrawerOpen, setNewDatsetDrawerOpen] =
        useState<boolean>(false)

    return (
        <div>
            <PageHeader
                pageTitle="Evaluation"
                setDrawerOpenText="New dataset"
                setDrawerOpen={setNewDatsetDrawerOpen}
            />
            <NewDatasetDrawer
                isOpen={newDatsetDrawerOpen}
                setIsOpen={setNewDatsetDrawerOpen}
            />

            <EvaluationMediumTitle title="Datasets" />

            <EvaluationMediumTitle title="Results" />
        </div>
    )
}

export default EvaluationOverview
