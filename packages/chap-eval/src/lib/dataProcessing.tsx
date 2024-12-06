  

import { extend } from "highcharts";
import { EvaluationForSplitPoint, EvaluationPerOrgUnit, ModelData } from "../components/EvaluationResultDashboard";
import {HighChartsData} from "../interfaces/HighChartsData";
import {DataElement, EvaluationEntry, } from "@dhis2-chap/chap-lib";

export function joinRealAndPredictedData(predictedData: HighChartsData, realData: DataElement[]): HighChartsData {
    const nPeriods = 52*3;
    const predictionEnd = predictedData.periods[predictedData.periods.length - 1];
    const realPeriodsFiltered = realData.map(item => item.pe).filter(period => period <= predictionEnd).sort().slice(-nPeriods);
    const realDataFiltered = realPeriodsFiltered.map(period => realData.find(item => item.pe === period)?.value ?? null);
    const padLength = realDataFiltered.length - predictedData.averages.length;
    const lastReal = realDataFiltered[padLength-1];
    const paddedAverage = Array(padLength-1).fill(null).concat([[lastReal]]).concat(predictedData.averages);
    const paddedRanges = Array(padLength-1).fill(null).concat([[lastReal, lastReal]]).concat(predictedData.ranges);
    const paddedMidRanges = Array(padLength-1).fill(null).concat([[lastReal, lastReal]]).concat(predictedData.midranges);
    const allPeriods = realPeriodsFiltered.concat(predictedData.periods);
    return {periods: allPeriods, ranges: paddedRanges, averages: paddedAverage, realValues: realDataFiltered as any, midranges: paddedMidRanges};
}

export function translateToDHIS2(data: any):  DataElement {
    return {'ou': data.region_id, 'pe': data.period_id,
        'value': data.value}

}

export function createHighChartsData<T extends { period: string, value: number }>(groupedDatum: T[], quantileFunc: (item: T) => string): HighChartsData {
    const periods = Array.from(new Set(groupedDatum.map(item => item.period))).sort();
    const ranges: number[][] = [];
    const averages: number[][] = [];
    const midranges: number[][] = [];
    periods.forEach(period => {
        const quantileLow = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'quantile_low')?.value || 0;
        const quantileHigh = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'quantile_high')?.value || 0;
        const median = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'median')?.value || 0;
        const quantileMidHigh = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'quantile_mid_high')?.value || 0;
        const quantileMidLow = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'quantile_mid_low')?.value || 0;
        ranges.push([quantileLow, quantileHigh]);
        averages.push([median]);
        midranges.push([quantileMidLow, quantileMidHigh]);
    });

    let dataElement = {
        periods,
        ranges,
        averages,
        midranges
    };

    return dataElement;
}

function groupBy<T>(array: T[], keyFunction: (item: T) => string): Record<string, T[]> {
  const groupByStep = (result: Record<string, T[]>, currentItem: T): Record<string, T[]> => {
    const key: string = keyFunction(currentItem);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(currentItem);
    return result;
  }
  return array.reduce(groupByStep, {} as Record<string, T[]>);
}

function groupByTwoKeys<T>(
  array: T[],
  keyFunc1: (item: T) => string,
  keyFunc2: (item: T) => string
): { [key1: string]: { [key2: string]: T[] } } {
  return array.reduce((result, currentItem) => {
    const key1 = keyFunc1(currentItem);
    const key2 = keyFunc2(currentItem);

    // Initialize the first-level grouping if it doesn't exist
    if (!result[key1]) {
      result[key1] = {};
    }

    // Initialize the second-level grouping if it doesn't exist
    if (!result[key1][key2]) {
      result[key1][key2] = [];
    }

    // Push the current item into the correct group
    result[key1][key2].push(currentItem);

    return result;
  }, {} as { [key1: string]: { [key2: string]: T[] } });
}
interface ModelEvaluation {	
  modelName: string,
  evaluationEntries: EvaluationEntry[]
}

export const addModelName = (data: EvaluationEntry[], modelName: string): EvaluationEntryExtend[] => {
  return data.map(item => {
    return {...item, modelName}
  })
}

export interface EvaluationEntryExtend extends EvaluationEntry {
  modelName? : string
}


export const evaluationResultToViewData = (data: EvaluationEntryExtend[], realValues: DataElement[], modelName? : string): EvaluationForSplitPoint[] => {

  let evalution : EvaluationForSplitPoint[] = []

  const quantiles = Array.from(new Set(data.map(item => item.quantile))).sort();
  const lowQuantile = quantiles[0];
  const midLowQuantile = quantiles[1];
  const midHighQuantile = quantiles[quantiles.length - 2];
  const highQuantile = quantiles[quantiles.length - 1];
  console.log(quantiles)
  const quantileFunc = (item: EvaluationEntry) => {
    if (item.quantile === lowQuantile) {
      return 'quantile_low';
    } else if (item.quantile === highQuantile) {
      return 'quantile_high';
    } else if (item.quantile === 0.5) {
        return 'median';
    } else if (item.quantile === midLowQuantile) {
        return 'quantile_mid_low';
    } else if (item.quantile === midHighQuantile) {
        return 'quantile_mid_high';
    } else {
        return 'unknown';
    }
  }

  const modelNames = Array.from(new Set(data.map(item => (item.modelName || modelName))));
  console.log(modelNames)

  return Array.from(new Set(data.map(item => item.splitPeriod))).map((splitPeriod : string) => {
    // each split periode
    return {
      splitPoint : splitPeriod,
      evaluation : Array.from(new Set(data.map(item => item.orgUnit))).map((orgUnit : string) => {

        return {
          orgUnitName : orgUnit,
          orgUnitId : "2",
          models : modelNames.map(mn => {
            return {
                modelName : mn,
                data : joinRealAndPredictedData(createHighChartsData(data.filter(o => o.orgUnit === orgUnit && o.splitPeriod === splitPeriod && (o?.modelName || modelName) === mn ), quantileFunc), realValues.filter(item => item.ou === orgUnit))
            } as ModelData })
        } as EvaluationPerOrgUnit
      })
    } as EvaluationForSplitPoint

  })

  

  // alle unike splitpoint




}

export const processDataValues = (data: EvaluationEntry[], realValues: DataElement[]): EvaluationForSplitPoint[] => {
  const quantiles = Array.from(new Set(data.map(item => item.quantile))).sort();
  const lowQuantile = quantiles[0];
  const midLowQuantile = quantiles[1];
  const midHighQuantile = quantiles[quantiles.length - 2];
  const highQuantile = quantiles[quantiles.length - 1];
  console.log(quantiles)
  const quantileFunc = (item: EvaluationEntry) => {
    if (item.quantile === lowQuantile) {
      return 'quantile_low';
    } else if (item.quantile === highQuantile) {
      return 'quantile_high';
    } else if (item.quantile === 0.5) {
        return 'median';
    } else if (item.quantile === midLowQuantile) {
        return 'quantile_mid_low';
    } else if (item.quantile === midHighQuantile) {
        return 'quantile_mid_high';
    } else {
        return 'unknown';
    }
  }
  //const groupedData = groupBy(data, item => item.orgUnit.concat(item.splitPeriod));
  const doubleGroupedData = groupByTwoKeys(data, item => item.splitPeriod, item => item.orgUnit);
  // Create a mapping of orgUnits to their respective chart data
  const orgUnitsProcessedData: Record<string, Record<string, HighChartsData>> = {};
  Object.keys(doubleGroupedData).forEach(splitPeriod => {
    const splitProcessedData: Record<string, HighChartsData> = {};
    Object.keys(doubleGroupedData[splitPeriod]).forEach(orgUnit => {
      let groupedDatum = doubleGroupedData[splitPeriod][orgUnit];
      let dataElement = createHighChartsData(groupedDatum, quantileFunc);
      splitProcessedData[orgUnit] = joinRealAndPredictedData(dataElement, realValues.filter(item => item.ou === orgUnit));
    });
    orgUnitsProcessedData[splitPeriod] = splitProcessedData;
  });

  return orgUnitsProcessedData as any;

}