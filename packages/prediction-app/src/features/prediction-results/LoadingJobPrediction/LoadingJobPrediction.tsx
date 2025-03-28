import React from 'react'
import styles from './LoadingJobPrediction.module.css'
import { CircularLoader } from '@dhis2/ui'

interface LoadingJobPredictionProps {
    type: 'predictions' | 'datasets' | 'evaluations'
}

const LoadingJobPrediction = ({ type }: LoadingJobPredictionProps) => {
    return (
        <>
            <div className={styles.loaderWrapper}>
                <div className={styles.loader}>
                    <CircularLoader />
                </div>
            </div>
            <p className={styles.textLoad}>
                <i>Loading {type}</i>
            </p>
        </>
    )
}

export default LoadingJobPrediction
