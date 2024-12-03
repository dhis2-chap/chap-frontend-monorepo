/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataList } from '../models/DataList';
import type { EvaluationEntry } from '../models/EvaluationEntry';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Get Evaluation Entries
     * @param backtestId
     * @param quantiles
     * @returns EvaluationEntry Successful Response
     * @throws ApiError
     */
    public static getEvaluationEntriesAnalyticsEvaluationEntryGet(
        backtestId: number,
        quantiles: Array<number>,
    ): CancelablePromise<Array<EvaluationEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/evaluation_entry',
            query: {
                'backtest_id': backtestId,
                'quantiles': quantiles,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Actual Cases
     * @param backtestId
     * @returns DataList Successful Response
     * @throws ApiError
     */
    public static getActualCasesAnalyticsActualCasesBacktestIdGet(
        backtestId: number,
    ): CancelablePromise<DataList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/actual_cases/{backtest_id}',
            path: {
                'backtest_id': backtestId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
