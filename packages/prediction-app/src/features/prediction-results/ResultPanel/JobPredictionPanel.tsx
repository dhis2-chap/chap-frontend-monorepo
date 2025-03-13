import React, { useState } from 'react'
import styles from './JobPredictionPanel.module.css'
import {
    boolean,
    Button,
    IconArrowRight16,
    IconArrowRight24,
    IconDelete24,
    IconImportItems24,
    IconView16,
    IconView24,
} from '@dhis2/ui'
import ImportPrediction from '../ImportPrediction/ImportPrediction'
import { JobPrediction } from '../interfaces/JobPrediction'
import { PredictionInfo } from '@dhis2-chap/chap-lib'

interface JobPredictionPanel {
    jobPredictions: JobPrediction[]
}

const JobPredictionPanel = ({ jobPredictions }: JobPredictionPanel) => {
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false)
    const [predictionToImport, setPredictionToImport] = useState<
        PredictionInfo | undefined
    >(undefined)

    const onClickImport = () => {
        setIsImportModalOpen(true)
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
            {jobPredictions.map((jobPredictions: JobPrediction) => (
                <div className={styles.boxPanel}>
                    <div className={styles.jobPredictionPanelContainer}>
                        <div className={styles.flexMedium}>
                            {jobPredictions.name}
                        </div>
                        <div className={styles.flexMedium}>
                            {jobPredictions.created.toDateString() +
                                ', ' +
                                jobPredictions.created
                                    .toLocaleTimeString()
                                    .slice(0, 5)}
                        </div>
                        <div className={styles.flexMedium}>
                            <span
                                className={getStatusColor(
                                    jobPredictions.status
                                )}
                            >
                                {jobPredictions.status}
                            </span>
                        </div>
                        <div className={styles.flexItemRight}>
                            {jobPredictions.type === 'prediction' ? (
                                <Button
                                    icon={<IconArrowRight24 />}
                                    onClick={onClickImport}
                                    small
                                >
                                    Import prediction
                                </Button>
                            ) : (
                                <div className={styles.buttonGroup}>
                                    {/*
                                    button not yet supported by chap core
                                    <Button small>Logs</Button>
                                    <Button small destructive>
                                        Cancel job
                                    </Button>
                                    
                                    */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {isImportModalOpen && (
                <ImportPrediction
                    setIsImportModalOpen={setIsImportModalOpen}
                    isImportModalOpen={isImportModalOpen}
                    predictionToImport={predictionToImport}
                />
            )}
        </>
    )
}

export default JobPredictionPanel
