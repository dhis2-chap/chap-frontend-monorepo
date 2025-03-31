import React, { useEffect, useState } from 'react'
import styles from './NewEvaluationForm.module.css'
import {
    Button,
    IconArrowLeft16,
    IconArrowLeft24,
    IconArrowRight16,
    IconArrowRight24,
    IconCross24,
    InputField,
} from '@dhis2/ui'
import SelectModel from '../../../select-model/SelectModel'
import SelectDataset from '../../../select-dataset/SelectDataset'

interface NewEvaluationFormProps {
    onDrawerClose: () => void
}

const NewEvaluationForm = ({ onDrawerClose }: NewEvaluationFormProps) => {
    const [datasetName, setDatasetName] = useState<string | undefined>('')
    const [selectedModel, setSelectedModel] = useState<any>(undefined)
    const [selectedDataset, setSelectedDataset] = useState<any>(undefined)

    return (
        <>
            <div className={styles.formWrapper}>
                <div className={styles.newEvaluationTitle}>
                    <h2>New evaluation</h2>
                    <Button icon={<IconCross24 />} onClick={onDrawerClose} />
                </div>
                <InputField
                    autoComplete=""
                    label="Evaluation name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.value)}
                    helpText="Name your evaluation"
                    placeholder="Example: EWARS evaluation, 2020-2024"
                />
                
                <h2>Select Dataset</h2>
                <SelectDataset selectedDataset={selectedDataset} setSelectedDataset={setSelectedDataset}/>

                <SelectModel selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
                
                <Button primary>
                    Fake Evaluate Button
                </Button>
            </div>
        </>
    )
}

export default NewEvaluationForm
