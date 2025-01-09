

import React, {useEffect, useState} from 'react';
import  {ComparisonDashboard } from './EvaluationResultDashboard';
import { addModelName } from "../lib/dataProcessing";
import { EvaluationEntryExtend, evaluationResultToViewData, EvaluationForSplitPoint } from "@dhis2-chap/chap-lib";


const EvaluationDemo: React.FC = () => {
  const [data, setData] = useState<EvaluationForSplitPoint[]>();

  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);

  useEffect(() => {
    let evaluationForSplitPoint: EvaluationEntryExtend[] = [];

    fetch(`${process.env.PUBLIC_URL}/demo_data_ewars.json`) // Using PUBLIC_URL to ensure compatibility with different environments
      .then(response => response.json())
      .then(data => {
            evaluationForSplitPoint = addModelName(data.predictions, "EWARS model");
      }).catch(error => console.error('Error loading data:', error));
      fetch(`${process.env.PUBLIC_URL}/demo_data_ar.json`) // Using PUBLIC_URL to ensure compatibility with different environments
      .then(response => response.json())
      .then(data => {
            evaluationForSplitPoint = evaluationForSplitPoint.concat(addModelName(data.predictions, "AR model"));
            const processedData = evaluationResultToViewData(evaluationForSplitPoint, data.actualCases.data);
            setData(processedData);
            const splitPeriods = processedData.map((item) => item.splitPoint);
            setSplitPeriods(splitPeriods);
      }).catch(error => console.error('Error loading data:', error));
  }, []);

  if (!data || !splitPeriods.length) 
    return <div>Loading...</div>;
  return (<ComparisonDashboard data={data} splitPeriods={splitPeriods} />)
}
export default EvaluationDemo