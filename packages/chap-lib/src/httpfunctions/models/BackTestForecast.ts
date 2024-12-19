/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BackTestForecast = {
    id?: (number | null);
    backtest_id: number;
    period_id: string;
    region_id: string;
    last_train_period_id: string;
    last_seen_period_id: string;
    values?: Array<number>;
};

