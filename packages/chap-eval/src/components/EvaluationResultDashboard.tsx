import React, { useEffect } from 'react'
import {
    EvaluationForSplitPoint,
    ComparisonPlotList,
} from '@dhis2-chap/chap-lib'
import { SplitPeriodSelector } from './SplitPeriodSelector'

interface EvaluationResultsChartProps {
    data: EvaluationForSplitPoint[]
    splitPeriods: string[]
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

const EvaluationResultsDashboard: React.FC<EvaluationResultsChartProps> = ({
    data,
    splitPeriods,
}) => {
    const [orgUnitsData, setOrgUnitsData] =
        React.useState<EvaluationForSplitPoint>(data[0])
    const [selectedSplitPeriod, setSelectedSplitPeriod] =
        React.useState<string>(splitPeriods[0])

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSplitPeriod(e.target.value)
        setOrgUnitsData(data.filter((o) => o.splitPoint === e.target.value)[0])
    }

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
    )
}

interface ComparisonResultsChartProps {
    data: EvaluationForSplitPoint[]
    splitPeriods: string[]
}

export const ComparisonDashboard: React.FC<ComparisonResultsChartProps> = ({
    data,
    splitPeriods,
}) => {
    console.log('Data: ', data)
    console.log('SplitPeriods: ', splitPeriods)
    console.log('Data[0]: ', data[0])
    const [orgUnitsData, setOrgUnitsData] =
        React.useState<EvaluationForSplitPoint>(data[0])
    console.log('OrgUnitsData1: ', orgUnitsData)

    useEffect(() => {
        setOrgUnitsData(data[0])
        console.log('UseEffect: ', data)
        console.log('UseEffect: ', orgUnitsData)
    }, [data])

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //setSelectedSplitPeriod(e.target.value);
        setOrgUnitsData(data.filter((o) => o.splitPoint === e.target.value)[0])
        console.log('OnPeriodChange: ', orgUnitsData)
    }

    console.log('OrgUnitsData2: ', orgUnitsData)
    return (
        <div>
            <SplitPeriodSelector
                splitPeriods={splitPeriods}
                onChange={handlePeriodChange}
            />
            <div>
                <ComparisonPlotList
                    useVirtuosoWindowScroll={true}
                    evaluationPerOrgUnits={orgUnitsData.evaluation}
                />
            </div>
        </div>
    )
}

export default EvaluationResultsDashboard
