/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataList } from './DataList';
import type { FeatureCollectionModel } from './FeatureCollectionModel';
export type DatasetCreate = {
    orgUnitsGeoJson: FeatureCollectionModel;
    features: Array<DataList>;
    name: string;
};

