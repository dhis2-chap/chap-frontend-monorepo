import React, { useState, useRef } from 'react'
import styles from './JobPredictionPanelItem.module.css'
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
    IconRuler24,
    IconMore16,
    Menu,
    MenuItem,
    Popper,
} from '@dhis2/ui'
import { JobPrediction } from '../../interfaces/JobPrediction'

interface JobPredictionPanelItem {
    i: number
    jobPrediction: JobPrediction
    onClickImport: any
    onClickEvaluateDataset: any
    onClickViewEvaluation: any
    onClickViewLogs: any
    onClickRemove: any
}

const JobPredictionPanelItem = ({ 
    i,
    jobPrediction,
    onClickEvaluateDataset,
    onClickViewEvaluation,
    onClickImport,
    onClickViewLogs,
    onClickRemove,
  }: JobPredictionPanelItem) => {

    const [showMenu, setShowMenu] = useState(false)
    const buttonRef = useRef(null)

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

    return (
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
                                            Import
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

                    {/*
                    <div ref={buttonRef}>
                        <Button
                            small
                            icon={<IconMore16 />}
                            onClick={() => setShowMenu((prev) => !prev)}
                        />
                    </div>

                    {showMenu && (
                        <Popper reference={buttonRef} placement="bottom-end">
                            <Menu>
                                {['SUCCESS', 'FAILURE'].includes(jobPrediction.status) && (
                                    <MenuItem
                                        label="Delete"
                                        icon={<IconDelete24 />}
                                        destructive
                                        onClick={() => {
                                            setShowMenu(false)
                                            onClickRemove(jobPrediction)
                                        }}
                                    />
                                )}
                            </Menu>
                        </Popper>
                    )}
                    */}

                </div>
            </div>
        </div>
    )
}

export default JobPredictionPanelItem