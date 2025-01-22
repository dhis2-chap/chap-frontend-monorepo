/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { chap_core__database__dataset_tables__FeatureCollectionModel_Input } from './chap_core__database__dataset_tables__FeatureCollectionModel_Input';
import type { FetchRequest } from './FetchRequest';
import type { ObservationBase } from './ObservationBase';
export type DatasetMakeRequest = {
    name: string;
    geojson?: chap_core__database__dataset_tables__FeatureCollectionModel_Input;
    type?: (string | null);
    providedData: Array<ObservationBase>;
    dataToBeFetched: Array<FetchRequest>;
};

