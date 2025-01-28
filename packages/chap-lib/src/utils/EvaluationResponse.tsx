import { DataElement, EvaluationEntry } from "../httpfunctions";
import { EvaluationEntryExtend, EvaluationForSplitPoint, EvaluationPerOrgUnit, HighChartsData, ModelData } from "../interfaces/Evaluation";

function sortDhis2WeeklyAndMonthlyTime(a: string, b: string): number {
  
  const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('W')) {
      const [year, week] = dateStr.split('W').map(Number);
      const firstDayOfYear = new Date(year, 0, 1);
      const daysOffset = (week - 1) * 7;
      const data = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
      return data
    } 
    else {
      const year = Number(dateStr.slice(0, 4));
      const month = Number(dateStr.slice(4, 6)) - 1;
      return new Date(year, month);
    }
  };

  return parseDate(a).getTime() - parseDate(b).getTime();
}


export function joinRealAndPredictedData(predictedData: HighChartsData, realData: DataElement[]): HighChartsData {
  //number of periods in plot
  const nPeriods = 52*3;
  const predictionEnd = predictedData.periods[predictedData.periods.length - 1];
  const realPeriodsFiltered = realData.map(item => item.pe).filter(period => period <= predictionEnd).sort(sortDhis2WeeklyAndMonthlyTime).slice(-nPeriods);
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

  //loop trough each unique split period (each row / line of plots)
  return Array.from(new Set(data.map(item => item.splitPeriod))).map((splitPeriod : string) => {
    return {
      //splitPeriod = cound hold several plots with same splitPeriod
      splitPoint : splitPeriod,
      //loop through each unique orgUnit
      evaluation : Array.from(new Set(data.map(item => item.orgUnit))).map((orgUnit : string) => {
        return {
          orgUnitName : orgUnit,
          orgUnitId : orgUnit,
          models : modelNames.map(mn => {
            const highChartData = createHighChartsData(
              //pass in data for one orgUnit, for one splitPeriod, for one modelName
              data.filter(o => o.orgUnit === orgUnit && o.splitPeriod === splitPeriod && (o?.modelName || modelName) === mn), 
              quantileFunc
            )
            const joinedRealAndPredictedData : HighChartsData = joinRealAndPredictedData(highChartData, realValues.filter(item => item.ou === orgUnit))

            return {
                modelName : mn,
                data : joinedRealAndPredictedData
            } as ModelData })
        } as EvaluationPerOrgUnit
      })
    } as EvaluationForSplitPoint

  })
}


export function createHighChartsData(plotData: EvaluationEntryExtend[], quantileFunc: (item: any) => string): HighChartsData {

  //requires that all periods are included in the respone
  const periods = Array.from(new Set(plotData.map(item => item.period))).sort(sortDhis2WeeklyAndMonthlyTime);

  const ranges: number[][] = [];
  const averages: number[][] = [];
  const midranges: number[][] = [];
  periods.forEach(period => {
      const quantileLow = plotData.find(item => item.period === period && quantileFunc(item) === 'quantile_low')?.value || 0;
      const quantileHigh = plotData.find(item => item.period === period && quantileFunc(item) === 'quantile_high')?.value || 0;
      const median = plotData.find(item => item.period === period && quantileFunc(item) === 'median')?.value || 0;
      const quantileMidHigh = plotData.find(item => item.period === period && quantileFunc(item) === 'quantile_mid_high')?.value || 0;
      const quantileMidLow = plotData.find(item => item.period === period && quantileFunc(item) === 'quantile_mid_low')?.value || 0;
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
