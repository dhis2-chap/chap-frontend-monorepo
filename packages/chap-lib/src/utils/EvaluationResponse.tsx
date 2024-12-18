import { DataElement, EvaluationEntry } from "../httpfunctions";
import { EvaluationEntryExtend, EvaluationForSplitPoint, EvaluationPerOrgUnit, HighChartsData, ModelData } from "../interfaces/Evaluation";

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


export const evaluationResultToViewData = (data: EvaluationEntryExtend[], realValues: DataElement[], modelName? : string): EvaluationForSplitPoint[] => {

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

  return Array.from(new Set(data.map(item => item.splitPeriod))).map((splitPeriod : string) => {
    // each split periode
    return {
      splitPoint : splitPeriod,
      evaluation : Array.from(new Set(data.map(item => item.orgUnit))).map((orgUnit : string) => {

        return {
          orgUnitName : orgUnit,
          orgUnitId : orgUnit,
          models : modelNames.map(mn => {
            return {
                modelName : mn,
                data : joinRealAndPredictedData(createHighChartsData(data.filter(o => o.orgUnit === orgUnit && o.splitPeriod === splitPeriod && (o?.modelName || modelName) === mn ), quantileFunc), realValues.filter(item => item.ou === orgUnit))
            } as ModelData })
        } as EvaluationPerOrgUnit
      })
    } as EvaluationForSplitPoint

  })
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

export function getSplitPeriod(data: EvaluationEntry[]) : string[] {
  return Array.from(new Set(data.map(item => item.splitPeriod)));
}
