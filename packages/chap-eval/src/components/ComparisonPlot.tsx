import React from "react";
import { ResultPlot } from "./ResultPlot";
import { HighChartsData } from "../interfaces/HighChartsData";
import styles from "../styles/ComparisonPlot.module.css";
import { EvaluationPerOrgUnit } from "./EvaluationResultDashboard";


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
