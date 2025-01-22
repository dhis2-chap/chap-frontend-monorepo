import React, { useEffect, useState } from 'react'
import DownloadAnalyticsData from './components/DownloadData/DownloadAnalyticsData';
import { CrudService, DataList, DatasetCreate, DatasetMakeRequest, FeatureCollectionModel, FetchRequest, JobResponse, ModelSpec, ObservationBase } from '@dhis2-chap/chap-lib';
import { ModelFeatureDataElementMap } from '../../interfaces/ModelFeatureDataElement';
import { ErrorResponse } from './interfaces/ErrorResponse';
import saveAs from 'file-saver';
import { IconError24 } from '@dhis2/ui';
import styles from './SendChapData.module.css';
import SendOrDownloadButtons from './components/SendOrDownloadButtons/SendOrDownloadButtons';
import { IOrgUnitLevel, OrgUnit } from '../orgunit-selector/interfaces/orgUnit';
import { Period } from '../timeperiod-selector/interfaces/Period';
import { Datalayer, DatasetLayer } from '../new-dataset/interfaces/DataSetLayer';
import { time } from 'console';
import { data } from 'react-router-dom';

interface SendChapDataProps {
  onSendAction : "predict" | "new-dataset"
  selectedPeriodItems : Period[]
  selectedOrgUnits : OrgUnit[]
  orgUnitLevel : IOrgUnitLevel | undefined
  dataLayers : DatasetLayer[]
  datasetName : string | undefined
}

export const SendChapData = ({onSendAction, datasetName, selectedPeriodItems, selectedOrgUnits: selectedOrgUnits, orgUnitLevel, dataLayers} : SendChapDataProps) => {

    //Only applies when action is "predict"
    const [selectedModel, setSelectedModel] = useState<ModelSpec | undefined>(undefined)

    //States applies for both "predict" and "new-dataset"
    const [startDownload, setStartDownload] = useState<{action: "download" | "predict" | "new-dataset", startDownload: boolean}>({ action: "download", startDownload: false });
    
    //Keeping the analytics content (including geojson), before sending to CHAP
    const [analyticsResult, setAnalyticsResult] = useState<DatasetCreate | undefined>(undefined);
   
    const analyticsDataLayers : DatasetLayer[] = dataLayers.filter((dataLayer) => dataLayer.origin === 'dataElement');
    const chapDataLayers : DatasetLayer[] = dataLayers.filter((dataLayer) => dataLayer.origin === 'CHAP');
  
    //State for validation, request status etc..
    const [errorMessages, setErrorMessages] = useState<ErrorResponse[]>([]);
    const [errorChapMsg, setErrorChapMsg] = useState('');


    const formValid = () => {
      if (orgUnitLevel === undefined) return false;
      if (selectedOrgUnits.length == 0) return false;
      if (selectedPeriodItems.length == 0) return false;
      if (datasetName === "") return false;
      if (selectedPeriodItems.length == 0) return false;
      if (dataLayers.length == 0) return false;
      if (dataLayers.some((v : DatasetLayer) => v.feature === "" || v.dataSource === "" || v.origin === "")) return false;
      return true;
    }
    

    //This will render the DownloadAnalyticsData components, which will fetch the analytics content from DHIS2
    const onClickDownloadOrPostData = (action : "download" | "predict" | "new-dataset") => {
      setAnalyticsResult(undefined);
      setStartDownload({ action: action, startDownload: true });
    }

    //Triggered when anayltics content is fetched
    useEffect(() => {
      if (analyticsResult) {
        setStartDownload(prev => ({ ...prev, startDownload: false }));

        //if action is "download", do not do any validation
        if(startDownload.action === "download") {
          downloadData(); 
          return;
        } 
  
        //if action is "Predict" or "new-dataset", check if the analytics contains row
        if (isAnalyticsContentIsEmpty(analyticsResult)) return;
  
        if(startDownload.action === "predict") predict();
        if(startDownload.action === "new-dataset") newDataset();     
      }
    }, [analyticsResult]);

  
    //Check if the analytics content is empty, before sending it to CHAP
    const isAnalyticsContentIsEmpty = (analyticsResult : DatasetCreate[]) => {
      let emptyFeatures : ErrorResponse[] = []

      analyticsResult.forEach((f : DatasetCreate) => {
        //find the name of the feature
        if(f.observations.length == 0) {
          console.log(analyticsDataLayers)
          const layer = analyticsDataLayers.find((v : DatasetLayer) => v.dataSource === f.dhis2Id)
          const msg = 'Selected data source with feature name "' + layer?.feature + '" returned no data.'
          emptyFeatures.push({description: "Ensure you have exported the analytics tables in DHIS2.", title: msg})
      }})
      if(emptyFeatures.length > 0) {
        setErrorMessages([...errorMessages, ...emptyFeatures])
        return true
      }
      return false
    }
  
    const newDataset = async () => {
      let request : DatasetCreate = getCHAPandDHIS2DataLayersTogheter()

      await CrudService.createDatasetCrudDatasetsPost(request).then((response: JobResponse) => {
        console.log(response)
      })


    }

    //Merge det features from the analytics, with the one from CHAP, to create a PredictionRequest
    const makeDataSet = () : DatasetMakeRequest => {

      //create dataToBeFetched
      var dataToBeFetched = chapDataLayers.map((v : DatasetLayer) => {
        return {
          dataSourceName : v.dataSource,
        } as FetchRequest
      })

      //append datalayers
      const mergedFeatures = chapLayers.concat(analyticsResult?.observations as FetchRequest[])

      return {
        name : datasetName as string,
        dataToBeFetched : mergedFeatures,
        geojson : analyticsResult?.geojson as FeatureCollectionModel,
        providedData : analyticsResult?.observations as ObservationBase[],
      }
    }

  
    const predict = async () => {
      let request : DatasetCreate = getCHAPandDHIS2DataLayersTogheter()
      //request.model_id = selectedModel?.name
      request.name = selectedModel?.name as string
      //request.model_id = selectedModel?.name
      //request.n_periods = 3
      let datasetId : string = ""
  
      /*await CrudService.createDatasetCrudDatasetJsonPost(request)
        .then((response: JobResponse) => {
          setErrorChapMsg('');
          datasetId = response.id;
          
          //return navigate('/status');
        })
        .catch((error: any) => {
          setErrorChapMsg(error?.body?.detail);
        });*/
    };

  
    const downloadData = () => {
      const allData = getCHAPandDHIS2DataLayersTogheter()

      var fileToSave = new Blob([JSON.stringify(allData, null, 2)], {
        type: 'application/json'
      });
  
      const today = new Date();
      saveAs(fileToSave, "chap_request_data_"+ today.toJSON() + '.json');
    }

  return (
    <div>
      <SendOrDownloadButtons
        formValid={formValid()}
        onButtonSendAction={onSendAction}
        onClickDownloadOrPostData={onClickDownloadOrPostData}
        orgUnits={selectedOrgUnits}
        startDownload={startDownload}
      />
      
      {<p className={styles.errorChap}>{errorChapMsg}</p>}
        {startDownload.startDownload && formValid() && (
          <DownloadAnalyticsData
            model_id={selectedModel?.name}
            setAnalyticsResult={setAnalyticsResult}
            analyticsDataLayers={analyticsDataLayers}
            startDownload={startDownload}
            setStartDownload={setStartDownload}
            selectedPeriodItems={selectedPeriodItems}
            setErrorMessages={setErrorMessages}
            selectedOrgUnits={selectedOrgUnits}
            orgUnitLevel={orgUnitLevel}
          />
        )}

        {errorMessages.map((error: ErrorResponse, index) => (
          <div key={index} className={styles.errorBar}>
            <div className={styles.errorHeader}>
              <IconError24 />
              <span>{error.title}</span>
            </div>
            <span className={styles.detailedError}>
              {error.description}
            </span>
          </div>
        ))}        
    </div>
  )
}
