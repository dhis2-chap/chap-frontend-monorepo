import React from 'react'
import styles from './EvaluationMediumTitle.module.css'

interface EvaluationMediumTitleProps {
    title: string
}

export const EvaluationMediumTitle = ({
    title,
}: EvaluationMediumTitleProps) => {
    return <div className={styles.title}>{title}</div>
}
