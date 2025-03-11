import React, { useState } from 'react'
import { JobResult, Result } from '../PredictionResults'
import styles from './JobResultPanel.module.css'
import { boolean, Button, IconArrowRight16, IconArrowRight24, IconDelete24, IconImportItems24, IconView16, IconView24 } from '@dhis2/ui'
import ImportPrediction from '../ImportPrediction/ImportPrediction'

interface JobResultPanel {
  jobResults : JobResult[]
}

const JobResultPanel = ({jobResults} : JobResultPanel) => {

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false)
  const [predictionToImport, setPredictionToImport] = useState<Result | undefined>(undefined)


  const onClickImport = () => {
    setIsImportModalOpen(true)
  }


  const getStatusColor = (status : string | undefined) => {
    switch(status) {
      case "In progress..":
        return styles.inProgress
      case "Not started":
        return styles.notStarted
      case "Failed":
        return styles.failed
      default:
        return styles.notStarted
    }
  }

  const formatDateTime = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  return (
   <>
      {
        jobResults.map((jobResult : JobResult) => (
          <div className={styles.boxPanel}>
            <div className={styles.jobResultPanelContainer}>
              <div className={styles.flexMedium}>{jobResult.name}</div>
              <div className={styles.flexMedium}>{jobResult.created.toDateString() + ", " + jobResult.created.toLocaleTimeString().slice(0, 5)}</div>
              <div className={styles.flexMedium}><span className={getStatusColor(jobResult.status)}>{jobResult.status}</span></div>          
              <div className={styles.flexItemRight}>
                {jobResult.type === "result" ? 
                  <Button icon={<IconArrowRight24/>} onClick={onClickImport} small>Import prediction</Button> 
                  : 
                  <div className={styles.buttonGroup}>
                    <Button small>Logs</Button>
                    <Button small destructive>Cancel job</Button>
                  </div>
                }
              </div>
            </div>
          </div>
        ))
      }
      {isImportModalOpen && <ImportPrediction setIsImportModalOpen={setIsImportModalOpen} isImportModalOpen={isImportModalOpen} predictionToImport={predictionToImport} />}
      </>
  )
}

export default JobResultPanel