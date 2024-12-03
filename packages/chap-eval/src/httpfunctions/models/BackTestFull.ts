/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackTestForecast } from './BackTestForecast';
import type { BackTestMetric } from './BackTestMetric';
export type BackTestFull = {
    dataset_id: number;
    estimator_id: string;
    id: number;
    metrics: Array<BackTestMetric>;
    forecasts: Array<BackTestForecast>;
};

