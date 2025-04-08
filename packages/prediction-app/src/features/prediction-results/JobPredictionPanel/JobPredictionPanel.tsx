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
import { PredictionInfo } from '@dhis2-chap/chap-lib'
import { CrudService } from '@dhis2-chap/chap-lib'
import { DataSetRead } from '@dhis2-chap/chap-lib'
import JobFailedButton from './JobFailedButton/JobFailedButton'
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

    const onClickRemoveFailed = (predictionId: string) => {
        let msg = 'Are you sure you want to permanently remove this failed job?'
        if (confirm(msg) == true) {
            CrudService.deleteFailedJobCrudFailedJobsFailedJobIdDelete(
                parseInt(predictionId)
            )
        }
    }

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'STARTED':
                return styles.inProgress
            case 'PENDING':
                return styles.notStarted
            case 'FAILURE':
                return styles.failed
            default:
                return styles.completed
        }
    }

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case 'STARTED':
                return 'In progress..'
            case 'PENDING':
                return 'Pending..'
            case 'FAILURE':
                return 'Failed'
            default:
                return 'Completed'
        }
    }

    const formatDateTime = (date: Date) => {
        const pad = (num: number) => num.toString().padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
        )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
        )}`
    }

    const onClickEvaluateDataset = (datasetId : number | undefined) => {
        console.log('clicked evaluate dataset id', datasetId)
        setDatasetIdToEvaluate(datasetId)
        setNewEvaluationDrawerOpen(true)
    }

    //console.log('socalled jobPredictions', jobPredictions)

    return (
        <>
            {jobPredictions.map((jobPrediction: JobPrediction, i) => (
                <div key={i} className={styles.boxPanel}>
                    <div className={styles.jobPredictionPanelContainer}>
                        <div className={styles.flexMedium}>
                            {jobPrediction.name}
                        </div>
                        <div className={styles.flexMedium}>
                            {jobPrediction.created.toDateString() +
                                ', ' +
                                jobPrediction.created
                                    .toLocaleTimeString()
                                    .slice(0, 5)}
                        </div>
                        <div className={styles.flexMedium}>
                            <span
                                className={getStatusColor(jobPrediction.status)}
                            >
                                {getStatusText(jobPrediction.status)}
                            </span>
                        </div>
                        <div className={styles.flexItemRight}>
                            {
                                {
                                    prediction: (
                                        <>
                                            {jobPrediction.status == 
                                            'SUCCESS' && (
                                                <Button
                                                    icon={<IconLaunch24 />}
                                                    onClick={() =>
                                                        onClickImport(
                                                            jobPrediction.result
                                                        )
                                                    }
                                                    small
                                                >
                                                    Publish
                                                </Button>
                                            )}
                                        </>
                                    ),
                                    dataset: (
                                        <>
                                            {jobPrediction.status == 
                                            'SUCCESS' && (
                                                <Button
                                                    icon={<IconRuler24 />}
                                                    onClick={() => 
                                                        onClickEvaluateDataset(jobPrediction.result)
                                                    }
                                                    small
                                                >
                                                    Evaluate
                                                </Button>
                                            )}
                                        </>
                                    ),
                                    evaluation: (
                                        <>
                                            {jobPrediction.status == 
                                            'SUCCESS' && (
                                                <Button
                                                    icon={<IconVisualizationAreaStacked24 />}
                                                    onClick={() => 
                                                        onClickViewEvaluation(jobPrediction.result)
                                                    }
                                                    small
                                                >
                                                    View
                                                </Button>
                                            )}
                                        </>
                                    ),
                                }[jobPrediction.type]
                            }

                            {jobPrediction.status == 
                                'FAILURE' && (
                                    <Button
                                        icon={<IconArchive24 />}
                                        onClick={() => 
                                            onClickViewLogs(jobPrediction.id)
                                        }
                                        small
                                    >
                                        Logs
                                    </Button>
                            )}

                        </div>
                    </div>
                </div>
            ))}

            {isImportModalOpen && (
                <ImportPrediction
                    setIsImportModalOpen={setIsImportModalOpen}
                    isImportModalOpen={isImportModalOpen}
                    predictionIdToImport={predictionIdToImport}
                />
            )}

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
