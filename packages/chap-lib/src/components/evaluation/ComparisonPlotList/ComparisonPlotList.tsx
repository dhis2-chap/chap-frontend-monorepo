import React from 'react'
import { EvaluationPerOrgUnit } from '../../../interfaces/Evaluation'
import { ComparisonPlot } from '../ComparisonPlot/ComparisonPlot'
import { Virtuoso } from 'react-virtuoso'

interface ComparisonPlotListProps {
    evaluationPerOrgUnits: EvaluationPerOrgUnit[]
    useVirtuoso?: boolean
    useVirtuosoWindowScroll?: boolean
}

export const ComparisonPlotList: React.FC<ComparisonPlotListProps> = ({
    evaluationPerOrgUnits,
    useVirtuoso = true,
    useVirtuosoWindowScroll = false,
}) => {
    function getItemContent() {
        return (index: number) => {
            const orgUnitsData: EvaluationPerOrgUnit =
                evaluationPerOrgUnits[index]
            return (
                orgUnitsData && (
                    <div key={orgUnitsData.orgUnitId}>
                        <ComparisonPlot orgUnitsData={orgUnitsData} />
                    </div>
                )
            )
        }
    }

    if (!useVirtuoso) {
        return (
            <>
                {evaluationPerOrgUnits.map((orgUnitsData, index) => {
                    return <ComparisonPlot orgUnitsData={orgUnitsData} />
                })}
            </>
        )
    }

    return (
        <div>
            <Virtuoso
                style={{ height: '520px' }}
                useWindowScroll={useVirtuosoWindowScroll}
                totalCount={evaluationPerOrgUnits.length}
                itemContent={getItemContent()}
            />
        </div>
    )
}
