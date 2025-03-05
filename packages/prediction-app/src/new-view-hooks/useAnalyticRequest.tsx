import { useDataQuery } from "@dhis2/app-runtime";
import { ModelFeatureDataElementMap } from "../interfaces/ModelFeatureDataElement";
import { Datalayer, DatasetLayer } from "../features/new-dataset/interfaces/DataSetLayer";
import { DatasetMakeRequest, ObservationBase } from "@dhis2-chap/chap-lib";

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

interface AnalyticsRespone {
  data : [[string, string, string, string]] | [],
  error : any,
  loading : boolean,
}

const useAnalyticRequest = (dataLayers: DatasetLayer[], periodes: any, orgUnit: any) : AnalyticsRespone => {
  
  //filter out every DHIS2 dataElement
  const dataElements = dataLayers.map((d : DatasetLayer) => (d.dataSource)) as any;

  //if all data will be fetched from CHAP
  if(dataElements.length === 0) {
    return {
      data : [],
      error : "",
      loading : false,
    } 
  }

  const { loading, error, data } = useDataQuery(ANALYTICS_QUERY({ dataElements, periodes, orgUnit }));

  console.log(data);

  if(!loading && data && !error){
    //divide the respons into the features (for instance population, diseases, etc)

    return {
      data : data?.request?.rows,
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
