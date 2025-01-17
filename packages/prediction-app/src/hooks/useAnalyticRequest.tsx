import { useDataQuery } from "@dhis2/app-runtime";
import { ModelFeatureDataElementMap } from "../interfaces/ModelFeatureDataElement";
import { Datalayer, DatasetLayer } from "../features/new-dataset/interfaces/DataSetLayer";

const ANALYTICS_QUERY = ({ dataElements = [], periodes = [], orgUnit = {} } = {}) => {
  return {
    request: {
      resource: "analytics",
      params: {
        paging: false,
        dimension: `dx:${dataElements.join(";")},ou:${orgUnit},pe:${periodes.join(";")}`
      },
    },
  };
};

const convertDhis2AnlyticsToChap = (data: [[string, string, string, string]], dataElementId : string) : any[]=> {
  return data.filter(x => x[0] === dataElementId).map((row) => {
    return {
      orgUnit: row[1],
      period: row[2],
      value: parseFloat(row[3])
    };
  })
}

const useAnalyticRequest = (dataLayers: DatasetLayer[], periodes: any, orgUnit: any) => {
  
  //filter out every DHIS2 dataElement
  const dataElements = dataLayers.map((d : DatasetLayer) => (d.dataSource)) as any;

  //if all data will be fetched from CHAP
  if(dataElements.length === 0) {
    return {
      data : [],
      error : false,
      loading : false,
    }
  }

  const { loading, error, data } = useDataQuery(ANALYTICS_QUERY({ dataElements, periodes, orgUnit }));



  if(!loading && data && !error){
    //divide the respons into the features (for instance population, diseases, etc)
    const featureRequest = dataLayers.map((v : DatasetLayer) => {
      return {
        featureId: v.feature,
        dhis2Id : v.dataSource,
        data : convertDhis2AnlyticsToChap((data?.request as any).rows, v.dataSource)
      }
    });

    return {
      data : featureRequest,
      error,
      loading,
    };
  }

  return {
    data,
    error,
    loading,
  };
};

export default useAnalyticRequest;
