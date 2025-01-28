/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackTestCreate } from '../models/BackTestCreate';
import type { BackTestFull } from '../models/BackTestFull';
import type { BackTestRead } from '../models/BackTestRead';
import type { Body_create_dataset_csv_crud_datasets_csvFile_post } from '../models/Body_create_dataset_csv_crud_datasets_csvFile_post';
import type { chap_core__rest_api_src__v1__routers__crud__PredictionCreate } from '../models/chap_core__rest_api_src__v1__routers__crud__PredictionCreate';
import type { DataBaseResponse } from '../models/DataBaseResponse';
import type { DatasetCreate } from '../models/DatasetCreate';
import type { DataSetRead } from '../models/DataSetRead';
import type { DataSetWithObservations } from '../models/DataSetWithObservations';
import type { DebugEntry } from '../models/DebugEntry';
import type { FeatureSource } from '../models/FeatureSource';
import type { FeatureType } from '../models/FeatureType';
import type { JobResponse } from '../models/JobResponse';
import type { ModelSpecRead } from '../models/ModelSpecRead';
import type { PredictionRead } from '../models/PredictionRead';
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
            url: '/crud/backtest/{backtestId}',
            path: {
                'backtestId': backtestId,
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
    public static createPredictionCrudPredictionsPost(
        requestBody: chap_core__rest_api_src__v1__routers__crud__PredictionCreate,
    ): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/predictions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Prediction
     * @param predictionId
     * @returns PredictionRead Successful Response
     * @throws ApiError
     */
    public static getPredictionCrudPredictionsPredictionIdGet(
        predictionId: number,
    ): CancelablePromise<PredictionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/predictions/{predictionId}',
            path: {
                'predictionId': predictionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Dataset
     * @param datasetId
     * @returns DataSetWithObservations Successful Response
     * @throws ApiError
     */
    public static getDatasetCrudDatasetsDatasetIdGet(
        datasetId: number,
    ): CancelablePromise<DataSetWithObservations> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/datasets/{datasetId}',
            path: {
                'datasetId': datasetId,
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
    /**
     * Create Dataset
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createDatasetCrudDatasetsPost(
        requestBody: DatasetCreate,
    ): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/datasets',
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
    public static createDatasetCsvCrudDatasetsCsvFilePost(
        formData: Body_create_dataset_csv_crud_datasets_csvFile_post,
    ): CancelablePromise<DataBaseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/datasets/csvFile',
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
     * @returns DebugEntry Successful Response
     * @throws ApiError
     */
    public static getDebugEntryCrudDebugDebugIdGet(
        debugId: number,
    ): CancelablePromise<DebugEntry> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/debug/{debugId}',
            path: {
                'debugId': debugId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Feature Types
     * @returns FeatureType Successful Response
     * @throws ApiError
     */
    public static listFeatureTypesCrudFeatureTypesGet(): CancelablePromise<Array<FeatureType>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/feature-types',
        });
    }
    /**
     * List Feature Types
     * @returns FeatureSource Successful Response
     * @throws ApiError
     */
    public static listFeatureTypesCrudFeatureSourcesGet(): CancelablePromise<Array<FeatureSource>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/feature-sources',
        });
    }
    /**
     * List Models
     * @returns ModelSpecRead Successful Response
     * @throws ApiError
     */
    public static listModelsCrudModelsGet(): CancelablePromise<Array<ModelSpecRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/models',
        });
    }
}
