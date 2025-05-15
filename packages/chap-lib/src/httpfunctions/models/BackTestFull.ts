/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { BackTestForecast } from './BackTestForecast';
import type { BackTestMetric } from './BackTestMetric';
export type BackTestFull = {
    datasetId: number;
    modelId: string;
    name?: (string | null);
    created?: (string | null);
    id: number;
    startDate?: (string | null);
    endDate?: (string | null);
    orgUnitIds?: Array<string>;
    metrics: Array<BackTestMetric>;
    forecasts: Array<BackTestForecast>;
};

