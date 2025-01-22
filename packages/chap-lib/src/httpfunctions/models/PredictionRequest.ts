/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { chap_core__api_types__FeatureCollectionModel } from './chap_core__api_types__FeatureCollectionModel';
import type { DataList } from './DataList';
export type PredictionRequest = {
    orgUnitsGeoJson: chap_core__api_types__FeatureCollectionModel;
    features: Array<DataList>;
    estimator_id?: string;
    n_periods?: number;
    include_data?: boolean;
};

