/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackTestCreate } from '../models/BackTestCreate';
import type { BackTestFull } from '../models/BackTestFull';
import type { BackTestRead } from '../models/BackTestRead';
import type { Body_create_dataset_csv_crud_dataset_csv_file_post } from '../models/Body_create_dataset_csv_crud_dataset_csv_file_post';
import type { DataBaseResponse } from '../models/DataBaseResponse';
import type { DataSet } from '../models/DataSet';
import type { DatasetCreate } from '../models/DatasetCreate';
import type { DataSetRead } from '../models/DataSetRead';
import type { JobResponse } from '../models/JobResponse';
import type { PredictionCreate } from '../models/PredictionCreate';
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
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createBacktestCrudBacktestPost(
        requestBody: BackTestCreate,
    ): CancelablePromise<JobResponse> {
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
     * Create Prediction
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createPredictionCrudPredictionPost(
        requestBody: PredictionCreate,
    ): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/prediction',
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
     * Create Dataset
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createDatasetCrudDatasetJsonPost(
        requestBody: DatasetCreate,
    ): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/dataset/json',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Dataset Csv
     * @param formData
     * @returns DataBaseResponse Successful Response
     * @throws ApiError
     */
    public static createDatasetCsvCrudDatasetCsvFilePost(
        formData: Body_create_dataset_csv_crud_dataset_csv_file_post,
    ): CancelablePromise<DataBaseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/dataset/csv_file',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Debug Entry
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static debugEntryCrudDebugPost(): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/debug',
        });
    }
    /**
     * Get Debug Entry
     * @param debugId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDebugEntryCrudDebugDebugIdGet(
        debugId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/debug/{debug_id}',
            path: {
                'debug_id': debugId,
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
