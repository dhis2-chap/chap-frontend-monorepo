import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useAnalyticRequest from '../../../../hooks/useAnalyticRequest';
import useGeoJson from '../../../../hooks/useGeoJson';
import { ModelFeatureDataElementMap } from '../../../../interfaces/ModelFeatureDataElement';
import styles from './DownloadAnalyticsData.module.css';
import { ErrorResponse } from '../../interfaces/ErrorResponse';
import { IOrgUnitLevel, OrgUnit } from '../../../orgunit-selector/interfaces/orgUnit';
import { Period } from '../../../timeperiod-selector/interfaces/Period';
import { DatasetLayer } from '../../../new-dataset/interfaces/DataSetLayer';

interface DownloadAnalyticsDataProps {
  selectedPeriodItems: Period[];
  orgUnitLevel: IOrgUnitLevel | undefined;
  selectedOrgUnits: OrgUnit[];
  model_id : string | undefined;
  analyticsDataLayers : DatasetLayer[];
  
  setStartDownload : Dispatch<SetStateAction<{ action: "download" | "predict" | "new-dataset"; startDownload: boolean; }>>,
  setErrorMessages(errorMessages: ErrorResponse[]): void;
  startDownload: { action: "download" | "predict" | "new-dataset"; startDownload: boolean; }
  setAnalyticsResult: (result: any) => void;
}

const DownloadAnalyticsData = ({selectedPeriodItems, model_id, setStartDownload,orgUnitLevel,selectedOrgUnits,analyticsDataLayers,setErrorMessages,setAnalyticsResult}: DownloadAnalyticsDataProps) => {

  if(orgUnitLevel == undefined) return <></>


  //Concat selected orgUnits (either national, a district, chiefdom or facility) with the id of selected levels (districts, chiefdoms, facilities)
  const mergedOrgUnits ='LEVEL-' + orgUnitLevel.id +';' +selectedOrgUnits.map((ou: OrgUnit) => ou.id).join(';');

  const flatternDhis2Periods = (periods: Period[]) => {
    return periods.map((period) => period.id);
  };

  const { data: analyticData, error: analyticError, loading: analyticLoading } = useAnalyticRequest(analyticsDataLayers, flatternDhis2Periods(selectedPeriodItems), mergedOrgUnits);
  const { data: geoJson, error: geoJsonError, loading: geoJsonLoading } = useGeoJson(orgUnitLevel.level, selectedOrgUnits);

  const createRequest = () => {
    return {
      model_id : model_id,
      features : analyticData,
      orgUnitsGeoJson : geoJson,
    }
  }

  useEffect(() => {
    //if one of the data is still loading, return
    if (analyticLoading || geoJsonLoading) return;
    //All data is fetched
    if (analyticData && geoJson) {
      setErrorMessages([]);
      setAnalyticsResult(createRequest());
    }

    //if an error occured
    if (analyticError || geoJsonError) {
      const errorMessages: ErrorResponse[] = [];

      analyticError && errorMessages.push({ description: JSON.stringify(analyticError), title: 'Analytics request failed' });
      geoJsonError && errorMessages.push({ description: JSON.stringify(geoJsonError), title: 'OrgUnits request failed' });
      setErrorMessages(errorMessages);
      setStartDownload(prev => ({...prev, startDownload: false }));
    }
  }, [analyticLoading, geoJsonLoading]);

  return <p className={styles.text}>Downloading data..</p>;
};

export default DownloadAnalyticsData;
