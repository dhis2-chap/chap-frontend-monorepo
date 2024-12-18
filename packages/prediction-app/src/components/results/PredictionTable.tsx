import i18n from "@dhis2/d2-i18n";
import styles from "./styles/PredictionTable.module.css";
import React from "react";
import { FullPredictionResponse, PredictionResponse } from "@dhis2-chap/chap-lib";

const getValue = (values : any, ou : any, key : any) => {
  const item = values.find((v : any) => v.orgUnit === ou && v.dataElement === key);
  return item ? Math.round(item.value) : null;
};

const getUniqePeriods = (values : Array<PredictionResponse>) : string[] => {
  return [...new Set(values.map((v : PredictionResponse) => v.period))];
};

const getUniqeOrgUnits = (values : Array<PredictionResponse>) : string[] => {
  return [...new Set(values.map((v : PredictionResponse) => v.orgUnit))];
}

const getUniqeQuantiles = (values : Array<PredictionResponse>) : string[] => {
  return [...new Set(values.map((v : PredictionResponse) => v.dataElement))];
}

interface PredictionTableProps {
  data : PredictionResponse[]
}

const PredictionTable = ({ data, predictionTargetName } : any) => {

  const orgUnits = [...new Set(data.map((v : any) => v.orgUnit))];

  return (
    <>
      {getUniqeOrgUnits(data).map((ou : string) => {
        return(
          <div key={ou}>
            <h3>{i18n.t(`Prediction for ${ou}`)}</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>
                        Quantiles
                      </th>
                      {getUniqePeriods(data).map((p : string) => {
                        return <th key={p}>{i18n.t(p)}</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {getUniqeQuantiles(data).map((q : string) => (
                      <tr key={q}>
                        <td>{q.replaceAll("_", " ")}</td>
                        {getUniqePeriods(data).map((p : string) => {
                          return <td key={p}>{data.filter((d : PredictionResponse) => d.dataElement === q && d.orgUnit === ou && d.period === p)[0].value}</td>
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

export default PredictionTable;
