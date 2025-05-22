/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackTestCreate } from '../models/BackTestCreate';
import type { BackTestFull } from '../models/BackTestFull';
import type { BackTestRead } from '../models/BackTestRead';
import type { BackTestUpdate } from '../models/BackTestUpdate';
import type { Body_create_dataset_csv_crud_datasets_csvFile_post } from '../models/Body_create_dataset_csv_crud_datasets_csvFile_post';
import type { ConfiguredModelDB } from '../models/ConfiguredModelDB';
import type { ConfiguredModelDBCreate } from '../models/ConfiguredModelDBCreate';
import type { DataBaseResponse } from '../models/DataBaseResponse';
import type { DatasetCreate } from '../models/DatasetCreate';
import type { DataSetRead } from '../models/DataSetRead';
import type { DataSetWithObservations } from '../models/DataSetWithObservations';
import type { DebugEntry } from '../models/DebugEntry';
import type { FeatureSource } from '../models/FeatureSource';
import type { JobResponse } from '../models/JobResponse';
import type { ModelSpecRead } from '../models/ModelSpecRead';
import type { NewClass } from '../models/NewClass';
import type { PredictionCreate } from '../models/PredictionCreate';
import type { PredictionRead } from '../models/PredictionRead';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CrudService {
    /**
     * Get Backtests
     * Returns a list of backtests/evaluations with only the id and name
     * @returns BackTestRead Successful Response
     * @throws ApiError
     */
    public static getBacktestsCrudBacktestsGet(): CancelablePromise<Array<BackTestRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/backtests',
        });
    }
    /**
     * Create Backtest
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createBacktestCrudBacktestsPost(
        requestBody: BackTestCreate,
    ): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crud/backtests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Backtest
     * @param backtestId
     * @returns BackTestFull Successful Response
     * @throws ApiError
     */
    public static getBacktestCrudBacktestsBacktestIdGet(
        backtestId: number,
    ): CancelablePromise<BackTestFull> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/backtests/{backtestId}',
            path: {
                'backtestId': backtestId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Backtest
     * @param backtestId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteBacktestCrudBacktestsBacktestIdDelete(
        backtestId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/crud/backtests/{backtestId}',
            path: {
                'backtestId': backtestId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Backtest
     * @param backtestId
     * @param requestBody
     * @returns BackTestRead Successful Response
     * @throws ApiError
     */
    public static updateBacktestCrudBacktestsBacktestIdPatch(
        backtestId: number,
        requestBody: BackTestUpdate,
    ): CancelablePromise<BackTestRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/crud/backtests/{backtestId}',
            path: {
                'backtestId': backtestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Predictions
     * @returns NewClass Successful Response
     * @throws ApiError
     */
    public static getPredictionsCrudPredictionsGet(): CancelablePromise<Array<NewClass>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/predictions',
        });
    }
    /**
     * Create Prediction
     * @param requestBody
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createPredictionCrudPredictionsPost(
        requestBody: PredictionCreate,
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
     * Delete Prediction
     * @param predictionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deletePredictionCrudPredictionsPredictionIdDelete(
        predictionId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
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
     * Delete Dataset
     * @param datasetId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteDatasetCrudDatasetsDatasetIdDelete(
        datasetId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
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
    /**
     * List Models V2
     * List all configured models from the db (new db tables)
     * @returns ModelSpecRead Successful Response
     * @throws ApiError
     */
    public static listModelsV2CrudModelsV2Get(): CancelablePromise<Array<ModelSpecRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crud/models-v2',
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
     * Add Configured Model
     * Add a configured model to the database.
     * @param requestBody
     * @returns ConfiguredModelDB Successful Response
     * @throws ApiError
     */
    public static addConfiguredModelCrudconfiguredModelPost(
        requestBody: ConfiguredModelDBCreate,
    ): CancelablePromise<ConfiguredModelDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crudconfigured-model',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
