import React from "react";
import { EvaluationPerOrgUnit } from "../../../interfaces/Evaluation";
import { ComparisonPlot } from "../ComparisonPlot/ComparisonPlot";
import { Virtuoso } from "react-virtuoso";

interface ComparisonPlotListProps {
  evaluationPerOrgUnits : EvaluationPerOrgUnit[];
}

export const ComparisonPlotList: React.FC<ComparisonPlotListProps> = ({evaluationPerOrgUnits}) => {


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