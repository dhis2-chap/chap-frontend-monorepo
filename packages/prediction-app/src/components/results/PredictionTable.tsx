import i18n from "@dhis2/d2-i18n";
import styles from "./styles/PredictionTable.module.css";
import React from "react";

const getValue = (values : any, ou : any, key : any) => {
  const item = values.find((v : any) => v.orgUnit === ou && v.dataElement === key);
  return item ? Math.round(item.value) : null;
};

const PredictionTable = ({ data, periode, predictionTargetName } : any) => {
  const values = data.dataValues;
  const orgUnits = [...new Set(values.map((v : any) => v.orgUnit))];

  return (
    <>
      <h3>{i18n.t(`Prediction for ${predictionTargetName} for period ${periode}`)}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{i18n.t("Org unit")}</th>
            <th>{i18n.t("Quantile low")}</th>
            <th>{i18n.t("Median")}</th>
            <th>{i18n.t("Quantile high")}</th>
          </tr>
        </thead>
        <tbody>
          {orgUnits.map((ou : any) => (
            <tr key={ou}>
              <th>{values.find((o : any) => o.orgUnit === ou).displayName}</th>    
              <td className={styles.quantile_low}>{getValue(values, ou, "quantile_low")}</td>
              <td>{getValue(values, ou, "median")}</td>
              <td className={styles.quantile_high}>{getValue(values, ou, "quantile_high")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PredictionTable;
