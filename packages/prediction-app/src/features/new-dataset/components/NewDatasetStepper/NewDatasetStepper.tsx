import React, { useState } from 'react'
import NewDatasetForm from '../NewDatasetForm/NewDatasetForm'
import styles from './NewDatasetStepper.module.css'
import { DatasetLayer } from '../../interfaces/DataSetLayer'
import {
    Button,
    IconArrowLeft16,
    IconArrowLeft24,
    IconArrowRight16,
    IconArrowRight24,
    IconCross24,
} from '@dhis2/ui'
import { PeriodTypeSelector } from '../../../timeperiod-selector/components/PeriodTypeSelector'

interface NewDatasetStepperProps {
    onDrawerSubmit: () => void
    onDrawerClose: () => void
}

const NewDatasetStepper = ({
    onDrawerClose,
    onDrawerSubmit,
}: NewDatasetStepperProps) => {
    return (
        <>
            <div className={styles.newDatasetWrapper}>
                <div className={styles.newEvaluationDatsetTitle}>
                    <h2>New evaluation dataset</h2>
                    <Button icon={<IconCross24 />} onClick={onDrawerClose} />
                </div>

                <NewDatasetForm onDrawerSubmit={onDrawerSubmit} />

                {/*
          {
            "1": <SelectData setDataSetLayer={setDataSetLayer} datasetLayers={datasetLayers} />,
            "2": //Add a review data section
          }[step]
        */}
            </div>
            {/*<div className={styles.navFooterOuter}>
        <div className={styles.navFooter}>
          <div>
            {step !== "1" && <Button icon={<IconArrowLeft24 />} onClick={() => setStep("1")}>Back</Button>}
          </div>
          <div>
            <Button primary icon={<IconArrowRight24 />} onClick={() => setStep("2")}>Next</Button>
          </div>
        </div>
      </div>*/}
        </>
    )
}

export default NewDatasetStepper
