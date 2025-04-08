/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeatureCollectionModel } from './FeatureCollectionModel';
import type { ObservationBase } from './ObservationBase';
export type DatasetCreate = {
    name: string;
    geojson: FeatureCollectionModel;
    type?: (string | null);
    observations: Array<ObservationBase>;
};

