import React from 'react'
import { EvaluationPerOrgUnit } from '../../../interfaces/Evaluation'
import { ComparisonPlot } from '../ComparisonPlot/ComparisonPlot'
import { Virtuoso, VirtuosoProps } from 'react-virtuoso'

interface ComparisonPlotListProps {
    evaluationPerOrgUnits: EvaluationPerOrgUnit[]
    useVirtuoso?: boolean
    useVirtuosoWindowScroll?: boolean
    virtuosoProps?: VirtuosoProps<any, any>
}

export const ComparisonPlotList: React.FC<ComparisonPlotListProps> = ({
    evaluationPerOrgUnits,
    useVirtuoso = true,
    useVirtuosoWindowScroll = false,
    virtuosoProps,
}) => {
    function getItemContent() {
        const ItemContent = (index: number) => {
            const orgUnitsData: EvaluationPerOrgUnit =
                evaluationPerOrgUnits[index]

            if (!orgUnitsData) {
                return null
            }
            // used by Virtuoso to re-render items when data changes
            const plotKey = `${orgUnitsData.orgUnitId}-${orgUnitsData.models
                .map((m) => m.modelName)
                .sort()
                .join('-')}`
            return (
                <div
                    key={plotKey}
                >
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
                {...virtuosoProps}
                style={{ height: '100%' }}
                useWindowScroll={useVirtuosoWindowScroll}
                totalCount={evaluationPerOrgUnits.length}
                itemContent={getItemContent()}
            />
        </div>
    )
}
