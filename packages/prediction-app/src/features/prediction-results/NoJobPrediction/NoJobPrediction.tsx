import React from 'react'
import styles from './NoJobPrediction.module.css'

export const NoJobPrediction = () => {
    return (
        <div className={styles.text}>
            No predictions found, start by clicking "New prediction"
        </div>
    )
}
