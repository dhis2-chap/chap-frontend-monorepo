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
    name?: (string | null);
    timestamp?: (string | null);
    start_date?: (string | null);
    end_date?: (string | null);
    org_unit_ids?: Array<string>;
    metrics: Array<BackTestMetric>;
    forecasts: Array<BackTestForecast>;
};

