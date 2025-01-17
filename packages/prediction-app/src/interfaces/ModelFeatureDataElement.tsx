export type ModelFeatureDataElementMap = Map<string, ModelFeatureDataElement>;

export interface ModelFeatureDataElement { 
  selectedDataElementId: string 
  selectedDataElementName: string
  source : "dataElement" | "CHAP"
};

