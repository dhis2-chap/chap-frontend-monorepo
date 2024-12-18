import React, { useEffect, useState } from 'react';
import {ComparisonDashboard} from './EvaluationResultDashboard';
import { addModelName, processDataValues } from "../lib/dataProcessing";
import { DataElement, HighChartsData, EvaluationEntry, EvaluationForSplitPoint, EvaluationEntryExtend, evaluationResultToViewData } from '@dhis2-chap/chap-lib'

const EvaluationResultChartFromFileSelector: React.FC = () => {
  const [data, setData] = useState<EvaluationEntryExtend[]>();
  const [data2, setData2] = useState<EvaluationEntryExtend[]>();
  const [realCases, setRealCases] = useState<DataElement[]>([])

  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);
  const [proceededData, setProceededData] = useState<EvaluationForSplitPoint[]>([])

  const dataSetters = [setData, setData2];
  
  const extractModelName = (filename: string) => {
    const match = filename.match(/response_(k.*?)\.json/);
    if (match) {
      return match[1];
    } else {
      return filename;
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, file_id: number = 0) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = JSON.parse(e.target?.result as string);
          const filename = file.name;
          
          const withModelName = addModelName(fileData.predictions, extractModelName(filename));
          setRealCases(fileData.actualCases.data);

          dataSetters[file_id](withModelName);

        
        } catch (error) {
          console.error("Error reading or processing file", error);
        }
      };
      reader.readAsText(file);
    }
  };
  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event, 1);

  useEffect(() => {
    if(data === undefined || data2 === undefined) return;

    const allData = data.concat(data2);

    const processedData : EvaluationForSplitPoint[] = evaluationResultToViewData(allData, realCases);
    setProceededData(processedData);
    const splitPeriods = processedData.map((item) => item.splitPoint);
    setSplitPeriods(splitPeriods);
  }, [data2, data])
  

  return (
    <div>
      <h2> Upload a file</h2>
        <p>Upload a JSON file containing the evaluation results from CHAP to view the results.</p>
      <p><label>Choose file:</label>
        <input type="file" accept=".json" onChange={handleFileChange} />
      </p>
      <p><label>Choose comparison file:</label>
        <input type="file" accept=".json" onChange={handleFileChange2} />
      </p>

      {(splitPeriods.length > 0) && (proceededData != undefined) &&
          <ComparisonDashboard data={proceededData} splitPeriods={splitPeriods}/>
        //<EvaluationResultsDashboard data={data} splitPeriods={splitPeriods} />
      }
    </div>
  );
};

export default EvaluationResultChartFromFileSelector;
