import React from 'react'
import styles from './LoadingJobPrediction.module.css'
import { CircularLoader } from '@dhis2/ui'

const LoadingJobPrediction = () => {
    return (
        <>
            <div className={styles.loaderWrapper}>
                <div className={styles.loader}>
                    <CircularLoader />
                </div>
            </div>
            <p className={styles.textLoad}>
                <i>Loading predictions</i>
            </p>
        </>
    )
}

export default LoadingJobPrediction
