/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeatureCollectionModel_Output } from './FeatureCollectionModel_Output';
import type { ObservationBase } from './ObservationBase';
export type DataSetWithObservations = {
    name: string;
    geojson?: FeatureCollectionModel_Output;
    type?: (string | null);
    id: number;
    observations: Array<ObservationBase>;
};

