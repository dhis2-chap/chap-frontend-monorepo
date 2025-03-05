import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useAnalyticRequest from '../../../../new-view-hooks/useAnalyticRequest';
import useGeoJson from '../../../../new-view-hooks/useGeoJson';
import { ModelFeatureDataElementMap } from '../../../../interfaces/ModelFeatureDataElement';
import styles from './DownloadAnalyticsData.module.css';
import { ErrorResponse } from '../../interfaces/ErrorResponse';
import { IOrgUnitLevel, OrgUnit } from '../../../orgunit-selector/interfaces/orgUnit';
import { Period } from '../../../timeperiod-selector/interfaces/Period';
import { DatasetLayer } from '../../../new-dataset/interfaces/DataSetLayer';
import { DatasetCreate, ObservationBase } from '@dhis2-chap/chap-lib';

interface DownloadAnalyticsDataProps {
  selectedPeriodItems: Period[];
  orgUnitLevel: IOrgUnitLevel | undefined;
  selectedOrgUnits: OrgUnit[];
  model_id : string | undefined;
  analyticsDataLayers: DatasetLayer[];
  setStartDownload: Dispatch<SetStateAction<{ action: "download" | "predict" | "new-dataset"; startDownload: boolean; }>>,
  setErrorMessages(errorMessages: ErrorResponse[]): void;
  startDownload: { action: "download" | "predict" | "new-dataset"; startDownload: boolean; }
  setGeoJSon: (geoJson: any) => void;
  setObservations: Dispatch<SetStateAction<ObservationBase[] | undefined>>;
}

const DownloadAnalyticsData = ({ selectedPeriodItems, setGeoJSon, setObservations, setStartDownload, orgUnitLevel, selectedOrgUnits, analyticsDataLayers, setErrorMessages }: DownloadAnalyticsDataProps) => {

  if (orgUnitLevel == undefined) return <></>


  //Concat selected orgUnits (either national, a district, chiefdom or facility) with the id of selected levels (districts, chiefdoms, facilities)
  const mergedOrgUnits = 'LEVEL-' + orgUnitLevel.id + ';' + selectedOrgUnits.map((ou: OrgUnit) => ou.id).join(';');

  const flatternDhis2Periods = (periods: Period[]) => {
    return periods.map((period) => period.id);
  };

  const { data: analyticData, error: analyticError, loading: analyticLoading } = useAnalyticRequest(analyticsDataLayers, flatternDhis2Periods(selectedPeriodItems), mergedOrgUnits);
  const { data: geoJson, error: geoJsonError, loading: geoJsonLoading } = useGeoJson(orgUnitLevel.level, selectedOrgUnits);

  /*const createRequest = () => {
    return {
      //model_id : model_id,
      features : analyticData,
      orgUnitsGeoJson : geoJson,
    }
  }*/

  const convertDhis2AnlyticsToChap = (data: [[string, string, string, string]] | []): ObservationBase[] => {
    return data.map((row) => {
      return {
        elementId: row[0],
        orgUnit: row[1],
        period: row[2],
        value: parseFloat(row[3]),
      } as ObservationBase;
    })
  }


  useEffect(() => {
    //if one of the data is still loading, return
    if (analyticLoading || geoJsonLoading) return;
    //All data is fetched
    if (analyticData && geoJson) {
      setErrorMessages([]);
      setGeoJSon(geoJson);
      setObservations(convertDhis2AnlyticsToChap(analyticData));
    }

    //if an error occured
    if (analyticError || geoJsonError) {
      const errorMessages: ErrorResponse[] = [];

      analyticError && errorMessages.push({ description: JSON.stringify(analyticError), title: 'Analytics request failed' });
      geoJsonError && errorMessages.push({ description: JSON.stringify(geoJsonError), title: 'OrgUnits request failed' });
      setErrorMessages(errorMessages);
      setStartDownload(prev => ({ ...prev, startDownload: false }));
    }
  }, [analyticLoading, geoJsonLoading]);

  return <p className={styles.text}>Downloading data..</p>;
};

export default DownloadAnalyticsData;
