import React from 'react'
import styles from './NoJobPrediction.module.css'

interface NoJobPredictionProps {
    type: 'predictions' | 'datasets' | 'evaluations' | 'job'
}

export const NoJobPrediction = ({ type }: NoJobPredictionProps) => {
    return <div className={styles.text}>No {type} found</div>
}
