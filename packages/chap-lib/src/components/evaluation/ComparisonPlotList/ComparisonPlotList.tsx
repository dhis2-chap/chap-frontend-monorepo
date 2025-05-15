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
        const ItemContent = (index: number) => {
            const orgUnitsData: EvaluationPerOrgUnit =
                evaluationPerOrgUnits[index]

            if (!orgUnitsData) {
                return null
            }

            return (
                <div key={orgUnitsData.orgUnitId}>
                    <ComparisonPlot orgUnitsData={orgUnitsData} />
                </div>
            )
        }
        ItemContent.displayName = 'ItemContent'
        return ItemContent
    }

    if (!useVirtuoso) {
        return (
            <>
                {evaluationPerOrgUnits.map((orgUnitsData) => {
                    if (!orgUnitsData) {
                        return null
                    }

                    return (
                        <ComparisonPlot
                            key={orgUnitsData.orgUnitId}
                            orgUnitsData={orgUnitsData}
                        />
                    )
                })}
            </>
        )
    }

    return (
        <div>
            <Virtuoso
                style={{ height: '60vh' }}
                useWindowScroll={useVirtuosoWindowScroll}
                totalCount={evaluationPerOrgUnits.length}
                itemContent={getItemContent()}
            />
        </div>
    )
}
