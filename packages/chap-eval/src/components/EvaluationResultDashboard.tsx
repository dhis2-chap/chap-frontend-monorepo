import React, {useEffect} from 'react';
import { ResultPlot } from "./ResultPlot";
import { HighChartsData } from "../interfaces/HighChartsData";
import {SplitPeriodSelector} from "./SplitPeriodSelector";
import {ComparisonPlot} from "./ComparisonPlot";
const Virtuoso = React.lazy(() => import('react-virtuoso').then((module) => ({ default: module.Virtuoso })));

interface EvaluationResultsChartProps {
  data: Record<string, Record<string, HighChartsData>>;
  splitPeriods: string[];
}
interface ResultPlotListProps {
  orgUnitsData: Record<string, HighChartsData>;
}

const ResultPlotList: React.FC<ResultPlotListProps> = ({ orgUnitsData}) => {
    function getItemContent() {
        return (index: number) => {
            const orgUnit = Object.keys(orgUnitsData)[index];
            return (
                <div key={orgUnit} style={{marginBottom: '40px'}}>
                    <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]} modelName={'ModelName'}/>
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

interface ComparisonPlotListProps {
  orgUnitsData: Record<string, HighChartsData>;
  orgUnitsData2: Record<string, HighChartsData>;
  modelName: string;
    modelName2: string;

}

const ComparisonPlotList: React.FC<ComparisonPlotListProps> = ({ orgUnitsData, orgUnitsData2, modelName, modelName2}) => {
    const modelNames = [modelName, modelName2];
    function getItemContent() {
        return (index: number) => {
            const orgUnit = Object.keys(orgUnitsData)[index];
            console.log(orgUnitsData2);
            if (!orgUnitsData2) {
                console.log('no data2');
                return (
                    <div key={orgUnit} style={{marginBottom: '40px'}}>
                        <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]} modelName={modelNames[index]}/>
                    </div>
                );
            }
            console.log('Data2 exists');
            return (
                <div key={orgUnit} style={{marginBottom: '40px'}}>
                    <ComparisonPlot data1={orgUnitsData[orgUnit]} data2={orgUnitsData2[orgUnit]} orgUnit1={orgUnit} modelNames={modelNames}/>
                </div>
            );
        };
    }

    return (
      <Virtuoso
        useWindowScroll
        totalCount={Object.keys(orgUnitsData).length}
        itemContent={getItemContent()}
      />
  );
};


const EvaluationResultsDashboard: React.FC<EvaluationResultsChartProps> = ({ data, splitPeriods }) => {
  const [orgUnitsData, setOrgUnitsData] = React.useState<Record<string, HighChartsData>>(data[splitPeriods[0]]);
  const [selectedSplitPeriod, setSelectedSplitPeriod] = React.useState<string>(splitPeriods[0]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSplitPeriod(e.target.value);
    setOrgUnitsData(data[e.target.value]);
  };

  return (
    <div>
      <SplitPeriodSelector
        splitPeriods={splitPeriods}
        onChange={handlePeriodChange}
      />
      <div>
        <ResultPlotList orgUnitsData={orgUnitsData} />
      </div>
    </div>
  );
};

interface ComparisonResultsChartProps {
  data: Record<string, Record<string, HighChartsData>>;
  data2: Record<string, Record<string, HighChartsData>>;
  splitPeriods: string[];
  name: string;
  name2: string;

}

export const ComparisonDashboard: React.FC<ComparisonResultsChartProps> = ({ data, data2, splitPeriods, name , name2 }) => {
    console.log('####', data2);
    console.log(name)
    let first_period = splitPeriods[0];
    console.log('####', data2, first_period);
    console.log('####1.5', data2[first_period]);
    const [orgUnitsData, setOrgUnitsData] = React.useState<Record<string, HighChartsData>>(data[first_period]);
    const [orgUnitsData2, setOrgUnitsData2] = React.useState<Record<string, HighChartsData>>(data2[first_period]);
    const [selectedSplitPeriod, setSelectedSplitPeriod] = React.useState<string>(first_period);
    console.log('####2', orgUnitsData);
    console.log('####3', orgUnitsData2);

    useEffect(() => {
        console.log('####4', data2[first_period]);
        setOrgUnitsData(data[first_period]);
        setOrgUnitsData2(data2[first_period]);
    },[]);
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSplitPeriod(e.target.value);
    console.log('####4########', data2[e.target.value]);
    setOrgUnitsData(data[e.target.value]);
    setOrgUnitsData2(data2[e.target.value]);
  };

  return (
    <div>
      <SplitPeriodSelector
        splitPeriods={splitPeriods}
        onChange={handlePeriodChange}
      />
      <div>
          <ComparisonPlotList orgUnitsData={orgUnitsData} orgUnitsData2={orgUnitsData2} modelName={name} modelName2={name2}/>
      </div>
    </div>
  );
};


export default EvaluationResultsDashboard;