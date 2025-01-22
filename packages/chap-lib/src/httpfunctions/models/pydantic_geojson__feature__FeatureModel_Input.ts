/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineStringModel } from './LineStringModel';
import type { MultiLineStringModel } from './MultiLineStringModel';
import type { MultiPointModel } from './MultiPointModel';
import type { MultiPolygonModel } from './MultiPolygonModel';
import type { PointModel } from './PointModel';
import type { PolygonModel } from './PolygonModel';
export type pydantic_geojson__feature__FeatureModel_Input = {
    type?: string;
    geometry: (PointModel | MultiPointModel | LineStringModel | MultiLineStringModel | PolygonModel | MultiPolygonModel);
};

