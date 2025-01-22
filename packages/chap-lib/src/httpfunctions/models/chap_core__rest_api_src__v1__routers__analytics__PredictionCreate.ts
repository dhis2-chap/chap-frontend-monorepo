/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { chap_core__database__dataset_tables__FeatureCollectionModel_Input } from './chap_core__database__dataset_tables__FeatureCollectionModel_Input';
import type { ObservationBase } from './ObservationBase';
export type chap_core__rest_api_src__v1__routers__analytics__PredictionCreate = {
    name: string;
    geojson?: chap_core__database__dataset_tables__FeatureCollectionModel_Input;
    type?: (string | null);
    observations: Array<ObservationBase>;
    modelId: string;
};

