import React, {useEffect} from 'react';
import { ResultPlot } from "./ResultPlot";
import { HighChartsData } from "../interfaces/HighChartsData";
import {SplitPeriodSelector} from "./SplitPeriodSelector";
import {ComparisonPlot} from "./ComparisonPlot";
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
export interface EvaluationForSplitPoint {
  evaluation : EvaluationPerOrgUnit[],
  splitPoint : string
}

export interface EvaluationPerOrgUnit {
  orgUnitName : string;
  orgUnitId : string;
  models : ModelData[];
}

export interface ModelData {
  data : HighChartsData,
  modelName : string
}

interface ComparisonPlotListProps {
  evaluationPerOrgUnits : EvaluationPerOrgUnit[];
}

const ComparisonPlotList: React.FC<ComparisonPlotListProps> = ({evaluationPerOrgUnits}) => {

    function getItemContent() {
        return (index: number) => {
            const orgUnitsData = evaluationPerOrgUnits[index];
            return (
                <div key={orgUnitsData.orgUnitId} style={{marginBottom: '40px'}}>
                    <ComparisonPlot orgUnitsData={orgUnitsData}/>
                </div>
            );
        };
    }

    return (
      <Virtuoso
        useWindowScroll
        totalCount={evaluationPerOrgUnits.length}
        itemContent={getItemContent()}
      />
  );
};


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
          <ComparisonPlotList evaluationPerOrgUnits={orgUnitsData.evaluation}/>
      </div>
    </div>
  );
};


export default EvaluationResultsDashboard;