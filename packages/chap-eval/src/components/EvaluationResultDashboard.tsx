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

const EvaluationResultsDashboard: React.FC<EvaluationResultsChartProps> = ({
    splitPeriods,
}) => {
    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('OnPeriodChange: ', e.target.value)
    }

    return (
        <div>
            <SplitPeriodSelector
                splitPeriods={splitPeriods}
                onChange={handlePeriodChange}
            />
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
        setOrgUnitsData(
            data.filter((o) => o.splitPoint === e.target.value)[0]
        )
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
