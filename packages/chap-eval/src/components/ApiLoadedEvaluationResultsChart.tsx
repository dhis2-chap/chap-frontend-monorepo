import React, { useEffect, useState } from 'react';
import { DefaultService } from "../httpfunctions";
import { processDataValues } from "../lib/dataProcessing";
import EvaluationResultsDashboard from './EvaluationResultDashboard';
import {HighChartsData} from "../interfaces/HighChartsData";

const ApiLoadedEvaluationResultsChart: React.FC = () => {
  const [data, setData] = useState<Record<string, Record<string, HighChartsData>>>({});
  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);

  const getData = async () => {
    const response = await DefaultService.getEvaluationResultsGetEvaluationResultsGet();
    const processedData = processDataValues(response.predictions, response.actualCases.data);
    setData(processedData);
    setSplitPeriods(Object.keys(processedData));
  };

  useEffect(() => {
    getData();
  }, []);

  if (!splitPeriods.length) return <div>Loading...</div>;

  return <EvaluationResultsDashboard data={data} splitPeriods={splitPeriods} />;
};

export default ApiLoadedEvaluationResultsChart;


// import React from 'react'
// import {ResultPlot} from "./ResultPlot";
// import {useEffect, useState} from "react";
// import {DefaultService, EvaluationResponse} from "../httpfunctions";
// import {HighChartsData} from "../interfaces/HighChartsData";
// import {processDataValues} from "../lib/dataProcessing";
//
//
// const EvaluationResultsChart = () => {
//   const [orgUnitsData, setOrgUnitsData] = useState<Record<string, HighChartsData>>({});
//   const [selectedSplitPeriod, setSelectedSplitPeriod] = useState<string>('');
//   const [allSplitPeriods, setAllSplitPeriods] = useState<string[]>([]);
//   const [allData, setAllData] = useState<Record<string, Record<string, HighChartsData>>>({} as Record<string, Record<string, HighChartsData>>);
//   const getData = async () => {
//     const response = await DefaultService.getEvaluationResultsGetEvaluationResultsGet()
//     const orgUnitsProcessedData = processDataValues(response.predictions, response.actualCases.data);
//     let strings = Object.keys(orgUnitsProcessedData);
//     console.log(strings);
//     setAllSplitPeriods(strings);
//     setSelectedSplitPeriod(strings[0])
//     setAllData(orgUnitsProcessedData);
//     setOrgUnitsData(orgUnitsProcessedData[strings[0]]);
//   }
//
//   useEffect(() => {
//     getData();
//   }, []);
//   return (
//       <div>
//         <div>
//           <select value={selectedSplitPeriod} onChange={e => {setOrgUnitsData(allData[e.target.value]); setSelectedSplitPeriod(e.target.value)}}>
//             {allSplitPeriods.map(splitPeriod => (
//                 <option key={splitPeriod} value={splitPeriod}>{splitPeriod}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           {Object.keys(orgUnitsData).map(orgUnit => (
//             <div key={orgUnit} style={{marginBottom: '40px'}}>
//               <h2>Predicted Disease Cases for {orgUnit}</h2>
//               <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]}/>
//             </div>
//         ))}
//           </div>
//       </div>
//   );
// }
// export default EvaluationResultsChart;