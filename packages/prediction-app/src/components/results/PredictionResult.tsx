import React, { useEffect, useState } from "react";
import i18n from "@dhis2/d2-i18n";
import StyledDropzone from "./StyledDropzone";
import PredictionTable from "./PredictionTable";
import styles from "./styles/ResultsPage.module.css";
import PredictionChart from "./PredictionChart";
import useOrgUnits from "../../hooks/useOrgUnits";
import {Button, TabBar, IconArrowRight24, Tab } from "@dhis2/ui";
import PostResult from "./PostResult";
import SelectDataValues from "./SelectDataValues";
import SetupInstruction from './SetupInstruction';
import useDataElements from "../../hooks/useDataElements";
import useDataElement from "../../hooks/useDataElement";
import { useLocation } from "react-router-dom";
import { DefaultService } from "../../httpfunctions";
import { SelectImportMode } from "./SelectImportMode";

const PredictionResult = () => {
  

  const location = useLocation();
  const [prediction, setPrediction] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<"chart" | "table">("chart");
  const [httpGetResultError, setHttpGetResultError] = useState<any>(undefined);

  //This states hold the dataElement prediction would be imported to
  const [qLowDataElement, setqLowDataElementId] = useState<{displayName : string, id : string} | null>(null);
  const [qMedianDataElement, setqMedianDataElementId] = useState<{displayName : string, id : string}  | null>(null)
  const [qHighDataElement, setqHighDataElementId] = useState<{displayName : string, id : string} | null>(null);

  //Every dataElement that have a code that start with CHAP_LOW would be fetched, same for CHAP_MEDIAN and CHAP_HIGH
  const { dataElements : dataElementsLow } = useDataElements("CHAP_LOW")
  const { dataElements : dataElementsMedian } = useDataElements("CHAP_MEDIAN")
  const { dataElements : dataElementsHigh } = useDataElements("CHAP_HIGH")

  //PredicationTargetId comes from the uploaded file, this is used to fetch the name of the disease
  const [predictionTargetId, setPredictionTarget] = useState<string | null>(null);
  const { displayName : predictionTargetName } = useDataElement(predictionTargetId);

  //Used to display the name of the orgUnit in the table/chart
  const {orgUnits, loading : orgUnitLoading} = useOrgUnits();
  
  //States related to posting the prediction
  const [postStatus, setPostStatus] = useState<"loading" | "finish" | "error" | "initial">("initial");
  const [postHttpError, setPostHttpError] = useState("");

  //If the user do not have any data elements that start with CHAP_LOW, CHAP_MEDIAN or CHAP_HIGH, show a warning
  const noCHAPDataElementExists = () => {
    if(dataElementsLow?.length === 0 || dataElementsMedian?.length === 0 || dataElementsHigh?.length === 0) {
      return true;
    }
    return false;
  }

    const fetchData = async () => {
        //const response = (await fetch("/override_respons.json")).json();
        await DefaultService.getResultsGetResultsGet().then(response => {
          onFileUpload(response)
        })
        .catch(err => {
          setHttpGetResultError(err.toString())
        })
    };

    //if id is passed in
    useEffect(() => {
      //if(location?.state?.data && orgUnits){
  

        fetchData();
  
    }, [location?.state?.data, orgUnits])
  
    
  
    const onFileUpload = (data : any) => {
      
      setPredictionTarget(data.diseaseId);
      setPostHttpError("");
      setPostStatus("initial");
      setPrediction(fillWithOrgUnit(data))
    }
  


  

  useEffect(() => {
    if(dataElementsLow && dataElementsMedian && dataElementsHigh && predictionTargetName) {
      const low = dataElementsLow.find((de : any) => de.code === `CHAP_LOW_${predictionTargetName.toLocaleUpperCase().replaceAll(" ", "_")}`);
      if (low) setqLowDataElementId(low);
      const median = dataElementsMedian.find((de : any) => de.code === `CHAP_MEDIAN_${predictionTargetName.toLocaleUpperCase().replaceAll(" ", "_")}`);
      if (median) setqMedianDataElementId(median);
      const high = dataElementsHigh.find((de : any) => de.code === `CHAP_HIGH_${predictionTargetName.toLocaleUpperCase().replaceAll(" ", "_")}`);
      if (high) setqHighDataElementId(high);
    }
  }, [dataElementsLow, dataElementsMedian, dataElementsHigh, predictionTargetName])
  

  //If user has selcted to import prediction into a data element that not contain the predictionName, give a warning to the user.
  const warnAboutUnequalDiseaseAndDataElement = () => {
    //do not warn when nothing is selected
    if(!qLowDataElement && !qMedianDataElement && !qHighDataElement) {
      return false;
    }
    //show warning if any of the selected data elements do not match the disease
    if (qLowDataElement && !qLowDataElement?.displayName.includes(predictionTargetName)) return true;
    if (qMedianDataElement && !qMedianDataElement?.displayName.includes(predictionTargetName)) return true;
    if (qHighDataElement && !qHighDataElement?.displayName.includes(predictionTargetName)) return true;
    return false;
  }
    //This add displayName to the orgUnits
    const fillWithOrgUnit = (data: any) => {
      return ({dataValues : data.dataValues.map((d: any) => {  
        return {
          ...d,
          displayName : (orgUnits?.organisationUnits.find((ou: any) => ou.id === d.orgUnit) as any)?.displayName
          }
        })
      })
    };
    
    const validateForm = () => {
      if(qLowDataElement && qMedianDataElement && qHighDataElement) {
        return true;
      }
      return false;
    }
  
    //the periode the data account for
    const getPeriode = () => {
      if(!prediction) return "";
      if(prediction.dataValues.length === 0) return "";
      return prediction.dataValues[0].period;
    }

  return (
    <>
    {httpGetResultError && <p className={styles.redText}>{(httpGetResultError)}</p>}
    <StyledDropzone disabled={orgUnitLoading} onLoad={onFileUpload} />

    
      {
      //If predication is null, show only "Upload file"-area
      prediction &&
        <>
          <TabBar scrollable>
            <Tab selected={selectedTab === "chart"} onClick={() => setSelectedTab("chart")}>
              Chart
            </Tab>
          </TabBar>

          <div className={styles.prediction}>
            {
              {
                'chart': <PredictionChart predictionTargetName={predictionTargetName} data={prediction} periode={getPeriode()} />,
                'table': <PredictionTable predictionTargetName={predictionTargetName} data={prediction} periode={getPeriode()} />
              }[selectedTab]
            }
          </div>

          <h3>{i18n.t("Select which data element prediction should be imported to:")}</h3>
          <SetupInstruction warning={noCHAPDataElementExists()} predictionTarget={predictionTargetName} />

          <SelectDataValues label={i18n.t("Select data element for low quantile")} dataElements={dataElementsLow} onChange={setqLowDataElementId} value={qLowDataElement} />
          <SelectDataValues label={i18n.t("Select data element for medium quantile")} dataElements={dataElementsMedian} onChange={setqMedianDataElementId} value={qMedianDataElement} />
          <SelectDataValues label={i18n.t("Select data element for high quantile")} dataElements={dataElementsHigh} onChange={setqHighDataElementId} value={qHighDataElement} />

          {warnAboutUnequalDiseaseAndDataElement() && <p className={styles.warning}>Warning: It seems like selected data elements do not match the disease of prediction.</p>}

          <div className={styles.footer}>
            <Button onClick={() => setPostStatus("loading")} loading={postStatus === "loading"} disabled={postStatus === "finish" || postStatus === "loading" || !validateForm()} icon={<IconArrowRight24 />} primary>{i18n.t("Import prediction")}</Button>
          </div>

          {postStatus === "loading" &&
            <PostResult setPostHttpError={setPostHttpError} setPostStatus={setPostStatus} prediction={prediction} qLowDataElementId={qLowDataElement?.id as string} qMedianDataElementId={qMedianDataElement?.id as string} qHighDataElementId={qHighDataElement?.id as string} />
          }

          <div className={styles.post}>
            {postStatus === "finish" && <p className={styles.greenText}>{i18n.t("Prediction has been imported.")}</p>}
            <p className={styles.redText}>{i18n.t(postHttpError)}</p>
          </div>
        </>
      }
    </>
  )
}

export default PredictionResult