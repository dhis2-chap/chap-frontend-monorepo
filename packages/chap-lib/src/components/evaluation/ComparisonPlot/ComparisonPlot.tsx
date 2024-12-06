import React from "react";
import styles from "./ComparisonPlot.module.css";
import { ResultPlot } from "../ResultPlot/ResultPlot";
import { EvaluationPerOrgUnit } from "../../../interfaces/Evaluation";

interface SideBySidePlotsProps {
    orgUnitsData: EvaluationPerOrgUnit;
}

export const ComparisonPlot: React.FC<SideBySidePlotsProps> = ({ orgUnitsData }) => {

    return (
        <>
            <div className={styles.comparionPair}>
                <div className={styles.title}>{orgUnitsData.orgUnitName}</div>
                <div className={styles.sideBySide}>
                    {orgUnitsData.models.map((modelData, index) => {
                        return (
                            <ResultPlot key={index} data={modelData.data} modelName={modelData.modelName} />
                        );
                    })}
                </div>
            </div>
        </>
    );
};
