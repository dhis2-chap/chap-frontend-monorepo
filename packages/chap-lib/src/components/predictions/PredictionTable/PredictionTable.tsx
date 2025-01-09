import i18n from "@dhis2/d2-i18n";
import styles from "./PredictionTable.module.css";
import React from "react";
import { FullPredictionResponseExtended, PredictionResponseExtended } from "../../../interfaces/Prediction";
import { PredictionResponse } from "../../../httpfunctions";
import { getUniqeOrgUnits, findOrgUnitName, getUniqePeriods, getUniqeQuantiles, numberDateToString } from "../../../utils/PredictionResponse";


interface PredictionTableProps {
  data : FullPredictionResponseExtended
}

export const PredictionTable = ({ data } : PredictionTableProps) => {

  const dataValues = data.dataValues;

  return (
    <>
      {getUniqeOrgUnits(dataValues).map((ou : string) => {
        return(
          <div key={ou}>
            <h3>{i18n.t(`Prediction for ${findOrgUnitName(ou, dataValues)}`)}</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>
                        Quantiles
                      </th>
                      {getUniqePeriods(dataValues).map((p : string) => {
                        return <th key={p}>{i18n.t(numberDateToString(p))}</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {getUniqeQuantiles(dataValues).map((q : string) => (
                      <tr key={q}>
                        <td>{q.replaceAll("_", " ")}</td>
                        {getUniqePeriods(dataValues).map((p : string) => {
                          return <td key={p}>{dataValues.filter((d : PredictionResponse) => d.dataElement === q && d.orgUnit === ou && d.period === p)[0].value}</td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>)
      })} 
    </>
  );
};