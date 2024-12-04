import React, { useEffect, useState } from "react";
import i18n from "@dhis2/d2-i18n";
import StyledDropzone from "./StyledDropzone";
import PredictionTable from "./PredictionTable";
import styles from "./styles/ResultsPage.module.css";
import PredictionChart from "./PredictionChart";
import useOrgUnits from "../../hooks/useOrgUnits";
import { Button, TabBar, IconArrowRight24, Tab } from "@dhis2/ui";
import PostResult from "./PostResult";
import SelectDataValues from "./SelectDataValues";
import SetupInstruction from './SetupInstruction';
import useDataElements from "../../hooks/useDataElements";
import useDataElement from "../../hooks/useDataElement";
import { useLocation } from "react-router-dom";
import { DefaultService } from "@dhis2-chap/chap-lib";
import { SelectImportMode } from "./SelectImportMode";
import PredictionResult from "./PredictionResult";
import EvaluationResult from "./EvaluationResult";

const ResultsPage = () => {


  const [importMode, setImportMode] = useState<undefined | "predict" | "evaluate">(undefined)


  return (
    <div className={styles.container}>
      <h1>{i18n.t("CHAP Core results")}</h1>
      <SelectImportMode importMode={importMode} setImportMode={setImportMode} />
      <div>
        {
          {
            'undefined': <></>,
            'predict': <PredictionResult />,
            'evaluate': <EvaluationResult />
          }[String(importMode)]
        }
      </div>
    </div>
  );
};

export default ResultsPage;
