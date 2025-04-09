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
import DatasetDetails from '../../../dataset-details/DatasetDetails'
import SelectModel from '../../../select-model/SelectModel'
import { AnalyticsService, CrudService } from '@dhis2-chap/chap-lib'

interface NewEvaluationFormProps {
    onDrawerClose: () => void
    datasetIdToEvaluate: number | undefined
}

const NewEvaluationForm = ({ onDrawerClose, datasetIdToEvaluate }: NewEvaluationFormProps) => {
    const [evaluationName, setEvaluationName] = useState<string | undefined>('')
    const [selectedModel, setSelectedModel] = useState<any>(undefined)

    const onClickEvaluate = () : any => {
        console.log('should evaluate', evaluationName, datasetIdToEvaluate, selectedModel)
        if (evaluationName && datasetIdToEvaluate && selectedModel) {
            const response = AnalyticsService.createBacktestAnalyticsCreateBacktestPost({
                name: evaluationName,
                datasetId: datasetIdToEvaluate,
                modelId: selectedModel.name,
            })
            console.log('evaluate response', response)
            onDrawerClose()
        }
    }

    return (
        <>
            <div className={styles.formWrapper}>

                <div className={styles.newEvaluationTitle}>
                    <h2>New model evaluation</h2>
                    <Button icon={<IconCross24 />} onClick={onDrawerClose} />
                </div>

                <InputField
                    autoComplete=""
                    label="Evaluation name"
                    value={evaluationName}
                    onChange={(e) => setEvaluationName(e.value)}
                    helpText="Name your evaluation"
                    placeholder="Example: EWARS evaluation, 2020-2024"
                />
                
                <h2>Dataset Details</h2>
                <DatasetDetails datasetId={datasetIdToEvaluate} />

                <SelectModel selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
                
                <div className={styles.buttons} >
                    <Button
                        primary
                        icon={<IconArrowRight24 />}
                        onClick={onClickEvaluate}
                    >
                        Evaluate
                    </Button>
                </div>
            </div>
        </>
    )
}

export default NewEvaluationForm
