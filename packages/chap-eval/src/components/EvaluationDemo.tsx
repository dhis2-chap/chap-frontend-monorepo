// @ts-nocheck

import React, {useEffect, useState} from 'react';
import  {ComparisonDashboard} from './EvaluationResultDashboard';
import { processDataValues } from "../lib/dataProcessing";
import { HighChartsData } from "../interfaces/HighChartsData";


const EvaluationDemo: React.FC = () => {
  const [data, setData] = useState<Record<string, Record<string, HighChartsData>>>();
  const [data2, setData2] = useState<Record<string, Record<string, HighChartsData>>>();
  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/demo_data_ewars.json`) // Using PUBLIC_URL to ensure compatibility with different environments
      .then(response => response.json())
      .then(data => {
            const processedData = processDataValues(data.predictions, data.actualCases.data);
            const splitPeriods = Object.keys(processedData);
            setData(processedData);
            setSplitPeriods(splitPeriods);
      }).catch(error => console.error('Error loading data:', error));
        fetch(`${process.env.PUBLIC_URL}/demo_data_ar.json`) // Using PUBLIC_URL to ensure compatibility with different environments
      .then(response => response.json())
      .then(data => {
            const processedData = processDataValues(data.predictions, data.actualCases.data);
            const splitPeriods = Object.keys(processedData);
            setData2(processedData);
      }).catch(error => console.error('Error loading data:', error));
  }, []);

  if (!data2 || !data || !splitPeriods.length) return <div>Loading...</div>;
  return (<ComparisonDashboard data={data} data2={data2} splitPeriods={splitPeriods} name={'CHAP_EWARS'} name2={'CHAP_AR'} />)
}
export default EvaluationDemo