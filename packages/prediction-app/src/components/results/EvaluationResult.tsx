import React, { useEffect, useState } from 'react'
import { DefaultService, EvaluationResponse } from '@dhis2-chap/chap-lib'
import styles from "./styles/EvaluationResult.module.css"

const EvaluationResult = () => {

  //const [evaluation, setEvaluation] = useState<Record<string, Record<string, HighChartsData>> | undefined>(undefined)
  const [httpError, setHttpError] = useState<string>("")
  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);

  const fetchEvaluation = async () => {
    await DefaultService.getEvaluationResultsGetEvaluationResultsGet()
      .then((response : any) => {
        //const processedData = processDataValues(response.predictions, response.actualCases.data)
        //setEvaluation(processedData)
        //setSplitPeriods(Object.keys(processedData));
      }
      )
      .catch(    
        (err : any) => {
          setHttpError(err.toString())
        } 
      )
  }

  useEffect(() => {
    fetchEvaluation();
  }, [])
  

  return (
    <div>
      <div className={styles.fetchEvaluationError}>
            <p>{httpError}</p>
          </div>
      
    </div>
  )
}

export default EvaluationResult