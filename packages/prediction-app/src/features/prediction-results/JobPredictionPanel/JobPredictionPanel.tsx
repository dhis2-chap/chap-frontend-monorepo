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
} from '@dhis2/ui'
import ImportPrediction from '../ImportPrediction/ImportPrediction'
import { JobPrediction } from '../interfaces/JobPrediction'
import { PredictionInfo } from '@dhis2-chap/chap-lib'
import { CrudService } from '@dhis2-chap/chap-lib'
import { DataSetRead } from '@dhis2-chap/chap-lib'
import JobFailedButton from './JobFailedButton/JobFailedButton'
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

    const [showJobDetails, setShowJobDetails] = useState(false)
    const [jobDetailsToShow, setJobDetailsToShow] = useState<
        JobPrediction | undefined
    >(undefined)

    const onClickImport = (predictionId: string) => {
        setIsImportModalOpen(true)
        setPredictionToImport(predictionId)
    }

    const onClickViewEvaluation = (evaluationId: number) => {
        setShowEvaluationResultModal(true)
        setEvaluationResultId(evaluationId)
    }

    const onClickRemoveFailed = (predictionId: string) => {
        let msg = 'Are you sure you want to permanently remove this failed job?'
        if (confirm(msg) == true) {
            CrudService.deleteFailedJobCrudFailedJobsFailedJobIdDelete(
                parseInt(predictionId)
            )
        }
    }

    const onClickJobDetails = (jobPrediction: JobPrediction) => {
        setShowJobDetails(true)
        setJobDetailsToShow(jobPrediction)
        alert(
            'Should show job details in modal (not finished): \n\n' +
                jobPrediction.description
        )
    }

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'In progress..':
                return styles.inProgress
            case 'active':
                return styles.notStarted
            case 'Failed':
                return styles.failed
            default:
                return styles.completed
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

    console.log('socalled jobPredictions', jobPredictions)

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
                                {jobPrediction.status.replaceAll(
                                    'active',
                                    'In progress..'
                                )}
                            </span>
                        </div>
                        <div className={styles.flexItemRight}>
                            {
                                {
                                    prediction: (
                                        <>
                                            <Button
                                                icon={<IconArrowRight24 />}
                                                onClick={() =>
                                                    onClickImport(
                                                        jobPrediction.id
                                                    )
                                                }
                                                small
                                            >
                                                Import prediction
                                            </Button>
                                        </>
                                    ),
                                    job: (
                                        <>
                                            {jobPrediction.status ==
                                                'Failed' && (
                                                <JobFailedButton
                                                    jobPrediction={
                                                        jobPrediction
                                                    }
                                                    onClickJobDetails={
                                                        onClickJobDetails
                                                    }
                                                    onClickRemoveFailed={
                                                        onClickRemoveFailed
                                                    }
                                                />
                                            )}
                                        </>
                                    ),
                                    dataset: (
                                        <>
                                            <Button
                                                icon={<IconArrowRight24 />}
                                                onClick={() => 
                                                    onClickEvaluateDataset(jobPrediction.id)
                                                }
                                                small
                                            >
                                                Evaluate
                                            </Button>
                                        </>
                                    ),
                                    evaluation: (
                                        <>
                                            <Button
                                                icon={<IconArrowRight24 />}
                                                onClick={() => 
                                                    onClickViewEvaluation(jobPrediction.id)
                                                }
                                                small
                                            >
                                                View
                                            </Button>
                                        </>
                                    ),
                                }[jobPrediction.type]
                            }
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
        </>
    )
}

export default JobPredictionPanel
