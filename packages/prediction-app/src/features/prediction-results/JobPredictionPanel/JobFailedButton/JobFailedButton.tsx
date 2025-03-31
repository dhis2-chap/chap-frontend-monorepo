import { Button, IconDelete24, IconInfo24 } from '@dhis2/ui'
import React from 'react'
import styles from './JobFailedButton.module.css'
import { JobPrediction } from '../../interfaces/JobPrediction'

interface JobFailedButtonProps {
    jobPrediction: JobPrediction
    onClickJobDetails: (jobPrediction: JobPrediction) => void
    onClickRemoveFailed: (predictionId: string) => void
}

const JobFailedButton = ({
    jobPrediction,
    onClickJobDetails,
    onClickRemoveFailed,
}: JobFailedButtonProps) => {
    return (
        <div className={styles.buttonGroup}>
            <Button
                icon={<IconInfo24 />}
                small
                onClick={() => onClickJobDetails(jobPrediction)}
            >
                Details
            </Button>
            <Button
                icon={<IconDelete24 />}
                small
                destructive
                onClick={() => onClickRemoveFailed(jobPrediction.id)}
            >
                Remove
            </Button>
        </div>
    )
}

export default JobFailedButton
