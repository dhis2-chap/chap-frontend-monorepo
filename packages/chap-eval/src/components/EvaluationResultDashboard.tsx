import React, {useEffect} from 'react';
import { ResultPlot } from "@dhis2-chap/chap-lib";
import { HighChartsData, EvaluationForSplitPoint, EvaluationPerOrgUnit, ComparisonPlotList } from "@dhis2-chap/chap-lib";
import {SplitPeriodSelector} from "./SplitPeriodSelector";
import {ComparisonPlot} from "@dhis2-chap/chap-lib/src/components/evaluation/ComparisonPlot/ComparisonPlot";
import { data } from 'react-router-dom';
const Virtuoso = React.lazy(() => import('react-virtuoso').then((module) => ({ default: module.Virtuoso })));

interface EvaluationResultsChartProps {
  data: EvaluationForSplitPoint[];
  splitPeriods: string[];
}
interface ResultPlotListProps {
  orgUnitsData: Record<string, HighChartsData>;
}
/*
const ResultPlotList: React.FC<ResultPlotListProps> = ({ orgUnitsData}) => {
    function getItemContent() {
        return (index: number) => {
            const orgUnit = Object.keys(orgUnitsData)[index];
            return (
                <div key={orgUnit} style={{marginBottom: '40px'}}>
                    <ResultPlot data={orgUnitsData[orgUnit]} modelName={'ModelName'}/>
                </div>
            );
        };
    }

    return (
    <Virtuoso
      style={{ height: '100vh' }}
      totalCount={Object.keys(orgUnitsData).length}
      itemContent={getItemContent()}
    />
  );
};
*/




const EvaluationResultsDashboard: React.FC<EvaluationResultsChartProps> = ({ data, splitPeriods }) => {
  const [orgUnitsData, setOrgUnitsData] = React.useState<EvaluationForSplitPoint>(data[0]);
  const [selectedSplitPeriod, setSelectedSplitPeriod] = React.useState<string>(splitPeriods[0]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSplitPeriod(e.target.value);
    setOrgUnitsData(data.filter(o => o.splitPoint === e.target.value)[0]);
  };

  return (
    <div>
      <SplitPeriodSelector
        splitPeriods={splitPeriods}
        onChange={handlePeriodChange}
      />
      <div>
        REMOVED FOR NOW
        {/*<ResultPlotList orgUnitsData={orgUnitsData} />*/}
      </div>
    </div>
  );
};

interface ComparisonResultsChartProps {
  data: EvaluationForSplitPoint[];
  splitPeriods: string[];
}



export const ComparisonDashboard: React.FC<ComparisonResultsChartProps> = ({ data, splitPeriods}) => {
    

    const [orgUnitsData, setOrgUnitsData] = React.useState<EvaluationForSplitPoint>(data[0]);

    //const [selectedSplitPeriod, setSelectedSplitPeriod] = React.useState<string>(data[0].splitPoint);

    useEffect(() => {
        setOrgUnitsData(data[0]);
    },[data]);
  
    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      //setSelectedSplitPeriod(e.target.value);
      setOrgUnitsData(data.filter(o => o.splitPoint === e.target.value)[0]);
  };

  return (
    <div>
      <SplitPeriodSelector
        splitPeriods={splitPeriods}
        onChange={handlePeriodChange}
      />
      <div>
          <ComparisonPlotList useVirtuosoWindowScroll={true} evaluationPerOrgUnits={orgUnitsData.evaluation}/>
      </div>
    </div>
  );
};


export default EvaluationResultsDashboard;