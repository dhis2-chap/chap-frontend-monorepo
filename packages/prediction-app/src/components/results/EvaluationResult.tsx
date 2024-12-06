import React, { useEffect, useState } from 'react'
import { ComparisonPlotList, DefaultService, EvaluationForSplitPoint, EvaluationResponse, evaluationResultToViewData } from '@dhis2-chap/chap-lib'
import styles from "./styles/EvaluationResult.module.css"
import StyledDropzone from './StyledDropzone'

const EvaluationResult = () => {

  //const [evaluation, setEvaluation] = useState<Record<string, Record<string, HighChartsData>> | undefined>(undefined)
  const [httpError, setHttpError] = useState<string>("")
  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);
  const [proceededData, setProceededData] = useState<EvaluationForSplitPoint[]>()

  const fetchEvaluation = async () => {
    await DefaultService.getEvaluationResultsGetEvaluationResultsGet()
      .then((response : EvaluationResponse) => {
        const processedData = evaluationResultToViewData(response.predictions, response.actualCases.data)
        setProceededData(processedData)
        //setSplitPeriods(Object.keys(processedData));
      }
      )
      .catch(    
        (err : any) => {
          setHttpError(err.toString())
        } 
      )
  }

  const onFileUpload = (data : EvaluationResponse) => {
    const processedData = evaluationResultToViewData(data.predictions, data.actualCases.data)
    setProceededData(processedData)
    //setPredictionTarget(data.diseaseId);
    //setPostHttpError("");
    //setPostStatus("initial");
    //setPrediction(fillWithOrgUnit(data))
  }

  useEffect(() => {
    fetchEvaluation();
  }, [])
  

  return (
    <div>
      <StyledDropzone disabled={false} onLoad={onFileUpload} />
          <div className={styles.fetchEvaluationError}>
            <p>{httpError}</p>
          </div>

          {proceededData && <ComparisonPlotList evaluationPerOrgUnits={proceededData[0].evaluation}/>}
    </div>
  )
}

export default EvaluationResult