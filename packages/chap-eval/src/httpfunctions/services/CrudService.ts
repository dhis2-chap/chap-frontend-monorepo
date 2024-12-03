/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackTestCreate } from '../models/BackTestCreate';
import type { BackTestFull } from '../models/BackTestFull';
import type { BackTestRead } from '../models/BackTestRead';
import type { DataSet } from '../models/DataSet';
import type { DataSetRead } from '../models/DataSetRead';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CrudService {
    /**
     * Get Backtest
     * @param backtestId
     * @returns BackTestFull Successful Response
     * @throws ApiError
     */
    public static getBacktestCrudBacktestBacktestIdGet(
        backtestId: number,
    ): CancelablePromise<BackTestFull> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/backtest/{backtest_id}',
            path: {
                'backtest_id': backtestId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Backtests
     * @returns BackTestRead Successful Response
     * @throws ApiError
     */
    public static getBacktestsCrudBacktestGet(): CancelablePromise<Array<BackTestRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/backtest',
        });
    }
    /**
     * Create Backtest
     * @param requestBody
     * @returns BackTestCreate Successful Response
     * @throws ApiError
     */
    public static createBacktestCrudBacktestPost(
        requestBody: BackTestCreate,
    ): CancelablePromise<BackTestCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/backtest',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Dataset
     * @param datasetId
     * @returns DataSet Successful Response
     * @throws ApiError
     */
    public static getDatasetCrudDatasetDatasetIdGet(
        datasetId: number,
    ): CancelablePromise<DataSet> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/dataset/{dataset_id}',
            path: {
                'dataset_id': datasetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Datasets
     * @returns DataSetRead Successful Response
     * @throws ApiError
     */
    public static getDatasetsCrudDatasetsGet(): CancelablePromise<Array<DataSetRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/datasets',
        });
    }
}
