/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { chap_core__database__dataset_tables__FeatureCollectionModel_Input } from './chap_core__database__dataset_tables__FeatureCollectionModel_Input';
import type { ObservationBase } from './ObservationBase';
export type DatasetCreate = {
    name: string;
    geojson?: chap_core__database__dataset_tables__FeatureCollectionModel_Input;
    type?: (string | null);
    observations: Array<ObservationBase>;
};

