import React, { useState } from 'react'
import styles from './JobPredictionPanel.module.css'
import {
    boolean,
    Button,
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

interface JobPredictionPanel {
    jobPredictions: JobPrediction[]
}

const JobPredictionPanel = ({ jobPredictions }: JobPredictionPanel) => {
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false)
    const [predictionIdToImport, setPredictionToImport] = useState<
        string | undefined
    >(undefined)

    const onClickImport = (predictionId: string) => {
        setIsImportModalOpen(true)
        setPredictionToImport(predictionId)
    }

    const onClickRemoveFailed = (predictionId: string) => {
        let msg = 'Are you sure you want to permanently remove this failed job?'
        if (confirm(msg) == true) {
            CrudService.deleteFailedJobCrudFailedJobsFailedJobIdDelete(parseInt(predictionId))
        }
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
                                className={getStatusColor(
                                    jobPrediction.status
                                )}
                            >
                                {jobPrediction.status.replaceAll(
                                    'active',
                                    'In progress..'
                                )}
                            </span>
                        </div>
                        <div className={styles.flexItemRight}>
                            {jobPrediction.type === 'prediction' ? (
                                <Button
                                    icon={<IconArrowRight24 />}
                                    onClick={() =>
                                        onClickImport(jobPrediction.id)
                                    }
                                    small
                                >
                                    Import prediction
                                </Button>
                            ) : (
                                <>
                                    {jobPrediction.status === 'Failed' && 
                                    <div className={styles.buttonGroup}>
                                        <Button
                                            icon={<IconInfo24 />} 
                                            small
                                            onClick={() => alert('Reason for failure: ' + jobPrediction.description)}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            icon={<IconDelete24 />} 
                                            small
                                            destructive
                                            onClick={() =>
                                                onClickRemoveFailed(jobPrediction.id)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>}
                                </>
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
        </>
    )
}

export default JobPredictionPanel
