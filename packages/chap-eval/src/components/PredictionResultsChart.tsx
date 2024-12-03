// src/ResultsChart.js
import React, {useEffect, useState} from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import {DefaultService} from "../httpfunctions";
import {PredictionResponse} from "../httpfunctions/models/PredictionResponse";
import {ResultPlot} from "../components/ResultPlot";
import {createHighChartsData} from "../lib/dataProcessing";
import {HighChartsData} from "../interfaces/HighChartsData";

HighchartsMore(Highcharts); // Enables the 'arearange' series type

function groupBy(array: PredictionResponse[]): Record<string, PredictionResponse[]> {
  return array.reduce((result: Record<string, PredictionResponse[]>, currentItem:PredictionResponse) => {
    // Get the value of the specified key to group by
    const groupKey: string = currentItem.orgUnit;
    // If the group does not exist, create it
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    // Push the current item into the appropriate group
    result[groupKey].push(currentItem);
    console.log(result)
    return result;
  }, {}); // Start with an empty object
};


const processDataValues = (data: PredictionResponse[]): Record<string, any> => {
  const groupedData = groupBy(data);
  console.log(groupedData)

  // Create a mapping of orgUnits to their respective chart data
  const orgUnitsProcessedData: Record<string, any> = {};

  Object.keys(groupedData).forEach(orgUnit => {
    let groupedDatum = groupedData[orgUnit];
    let dataElement = createHighChartsData(groupedDatum, item => item.dataElement);
    orgUnitsProcessedData[orgUnit] = dataElement;
    });
  return orgUnitsProcessedData;
}


const PredictionResultsChart = () => {
  const [orgUnitsData, setOrgUnitsData] = useState<Record<string, HighChartsData>>({});
  const getData = async () => {
    const response = await DefaultService.getResultsGetResultsGet()
    const orgUnitsProcessedData = processDataValues(response.dataValues);
    setOrgUnitsData(orgUnitsProcessedData);
  }

  useEffect(() => {
    getData();
  }, []);
  return (
      <div>
        {Object.keys(orgUnitsData).map(orgUnit => (
            <div key={orgUnit} style={{marginBottom: '40px'}}>
              <h2>Predicted Disease Cases for {orgUnit}</h2>
              <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]} modelName={'ModelName'} />
            </div>
        ))}
      </div>
  );
}

export default PredictionResultsChart;
