/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataBaseResponse } from '../models/DataBaseResponse'
import type { EvaluationResponse } from '../models/EvaluationResponse'
import type { FullPredictionResponse } from '../models/FullPredictionResponse'
import type { JobDescription } from '../models/JobDescription'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class JobsService {
    /**
     * List Jobs
     * List all jobs currently in the queue
     * @returns JobDescription Successful Response
     * @throws ApiError
     */
    public static listJobsJobsGet(): CancelablePromise<Array<JobDescription>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs',
        })
    }
    /**
     * Get Job Status
     * @param jobId
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getJobStatusJobsJobIdGet(
        jobId: string
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}',
            path: {
                job_id: jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Get Prediction Result
     * @param jobId
     * @returns FullPredictionResponse Successful Response
     * @throws ApiError
     */
    public static getPredictionResultJobsJobIdPredictionResultGet(
        jobId: string
    ): CancelablePromise<FullPredictionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/prediction_result',
            path: {
                job_id: jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Get Evaluation Result
     * @param jobId
     * @returns EvaluationResponse Successful Response
     * @throws ApiError
     */
    public static getEvaluationResultJobsJobIdEvaluationResultGet(
        jobId: string
    ): CancelablePromise<EvaluationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/evaluation_result',
            path: {
                job_id: jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        })
    }
    /**
     * Get Database Result
     * @param jobId
     * @returns DataBaseResponse Successful Response
     * @throws ApiError
     */
    public static getDatabaseResultJobsJobIdDatabaseResultGet(
        jobId: string
    ): CancelablePromise<DataBaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/database_result',
            path: {
                job_id: jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        })
    }
}
