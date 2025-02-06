/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { chap_core__rest_api_src__v1__routers__analytics__PredictionCreate } from '../models/chap_core__rest_api_src__v1__routers__analytics__PredictionCreate'
import type { DataList } from '../models/DataList'
import type { DatasetMakeRequest } from '../models/DatasetMakeRequest'
import type { EvaluationEntry } from '../models/EvaluationEntry'
import type { JobResponse } from '../models/JobResponse'
import type { MultiBacktestCreate } from '../models/MultiBacktestCreate'
import type { PredictionEntry } from '../models/PredictionEntry'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class AnalyticsService {
    /**
     * Make Dataset
     * This endpoint creates a dataset from the provided data and the data to be fetched
     * and puts it in the database
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static makeDatasetAnalyticsMakeDatasetPost(
        requestBody: DatasetMakeRequest
    ): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/analytics/make-dataset',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Get Evaluation Entries
     * @param backtestId
     * @param quantiles
     * @returns EvaluationEntry Successful Response
     * @throws ApiError
     */
    public static getEvaluationEntriesAnalyticsEvaluationEntryGet(
        backtestId: number,
        quantiles: Array<number>
    ): CancelablePromise<Array<EvaluationEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/evaluation-entry',
            query: {
                backtestId: backtestId,
                quantiles: quantiles,
            },
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Create Backtest
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createBacktestAnalyticsCreateBacktestsPost(
        requestBody: MultiBacktestCreate
    ): CancelablePromise<Array<JobResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/analytics/create_backtests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Make Prediction
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static makePredictionAnalyticsPredictionPost(
        requestBody: chap_core__rest_api_src__v1__routers__analytics__PredictionCreate
    ): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/analytics/prediction',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Get Prediction Entries
     * @param predictionId
     * @returns PredictionEntry Successful Response
     * @throws ApiError
     */
    public static getPredictionEntriesAnalyticsPredictionEntryPredictionIdGet(
        predictionId: number
    ): CancelablePromise<Array<PredictionEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/prediction-entry/{predictionId}',
            path: {
                predictionId: predictionId,
            },
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Get Actual Cases
     * @param backtestId
     * @returns DataList Successful Response
     * @throws ApiError
     */
    public static getActualCasesAnalyticsActualCasesBacktestIdGet(
        backtestId: number
    ): CancelablePromise<DataList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/actual-cases/{backtestId}',
            path: {
                backtestId: backtestId,
            },
            errors: {
                422: `Validation Error`,
            },
        })
    }
}
