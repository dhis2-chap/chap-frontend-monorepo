import React, { useState } from 'react'
import styles from './JobPredictionPanel.module.css'
import {
    boolean,
    Button,
    Modal,
    IconArrowRight16,
    IconArrowRight24,
    IconDelete24,
    IconImportItems24,
    IconInfo16,
    IconInfo24,
    IconView16,
    IconView24,
    IconArchive24,
    IconVisualizationAreaStacked24,
    IconLaunch24,
    IconRuler24
} from '@dhis2/ui'
import ImportPrediction from '../ImportPrediction/ImportPrediction'
import { JobPrediction } from '../interfaces/JobPrediction'
import { JobsService, PredictionInfo } from '@dhis2-chap/chap-lib'
import { CrudService } from '@dhis2-chap/chap-lib'
import { DataSetRead } from '@dhis2-chap/chap-lib'
import JobPredictionPanelItem from './JobPredictionPanelItem/JobPredictionPanelItem'
import JobLogs from './JobLogs/JobLogs'
import NewEvaluationDrawer from '../../new-evaluation/components/NewEvaluationDrawer'
import EvaluationResult from '../../import-prediction/EvaluationResult'

interface JobPredictionPanel {
    jobPredictions: JobPrediction[]
}

const JobPredictionPanel = ({ jobPredictions }: JobPredictionPanel) => {
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false)
    const [predictionIdToImport, setPredictionToImport] = useState<
        string | undefined
    >(undefined)

    const [newEvaluationDrawerOpen, setNewEvaluationDrawerOpen] =
        useState<boolean>(false)
    const [showEvaluationResultModal, setShowEvaluationResultModal] = useState<boolean>(false)
    const [evaluationResultId, setEvaluationResultId] = useState<number | undefined>(undefined)

    const [datasetIdToEvaluate, setDatasetIdToEvaluate] = useState<number | undefined>(undefined)

    const [showJobLogs, setShowJobLogs] = useState(false)
    const [jobLogsId, setJobLogsId] = useState<string | undefined>(undefined)

    const onClickImport = (predictionId: string) => {
        setIsImportModalOpen(true)
        setPredictionToImport(predictionId)
    }

    const onClickViewEvaluation = (evaluationId: number) => {
        setShowEvaluationResultModal(true)
        setEvaluationResultId(evaluationId)
    }

    const onClickViewLogs = (jobId: string) => {
        setShowJobLogs(true)
        setJobLogsId(jobId)
    }

    const onClickRemove = (item: JobPrediction) => {
        let msg = 'Are you sure you want to permanently remove this item? Any data entries that depend on this item will also be deleted.'
        if (confirm(msg) == true) {
            console.log('Should remove item')
            let dbId = item.result
            if (dbId) {
                if (item.type == 'dataset') {
                    CrudService.deleteDatasetCrudDatasetsDatasetIdDelete(parseInt(dbId))
                } else if (item.type == 'evaluation') {
                    CrudService.deleteBacktestCrudBacktestsBacktestIdDelete(parseInt(dbId))
                } else if (item.type == 'prediction') {
                    CrudService.deletePredictionCrudPredictionsPredictionIdDelete(parseInt(dbId))
                }
            } else {
                let jobId = item.id
                JobsService.deleteJobJobsJobIdDelete(jobId)
            }
        }
    }

    const onClickEvaluateDataset = (datasetId : number | undefined) => {
        console.log('clicked evaluate dataset id', datasetId)
        setDatasetIdToEvaluate(datasetId)
        setNewEvaluationDrawerOpen(true)
    }

    //console.log('socalled jobPredictions', jobPredictions)

    return (
        <>
            {/* add job panel items */}
            {jobPredictions.map((jobPrediction: JobPrediction, i) => (
                <JobPredictionPanelItem 
                    i={i}
                    jobPrediction={jobPrediction}
                    onClickEvaluateDataset={onClickEvaluateDataset}
                    onClickViewEvaluation={onClickViewEvaluation}
                    onClickImport={onClickImport}
                    onClickRemove={onClickRemove}
                    onClickViewLogs={onClickViewLogs}
                />
            ))}

            {/* import modal */}
            {isImportModalOpen && (
                <ImportPrediction
                    setIsImportModalOpen={setIsImportModalOpen}
                    isImportModalOpen={isImportModalOpen}
                    predictionIdToImport={predictionIdToImport}
                />
            )}

            {/* new evaluation drawer */}
            <NewEvaluationDrawer
                isOpen={newEvaluationDrawerOpen}
                setIsOpen={setNewEvaluationDrawerOpen}
                datasetIdToEvaluate={datasetIdToEvaluate}
            />
            {showEvaluationResultModal && (
                <Modal
                    className={styles.evaluationModal}
                    onClose={() => {
                        setShowEvaluationResultModal(false)
                    }}
                >
                    <EvaluationResult evaluationId={evaluationResultId} />
                </Modal>
            )}

            {/* job logs modal */}
            {showJobLogs && (
                <Modal
                    className={styles.jobLogsModal}
                    onClose={() => {
                        setShowJobLogs(false)
                    }}
                >
                    <JobLogs jobId={jobLogsId} />
                </Modal>
            )}
        </>
    )
}

export default JobPredictionPanel
