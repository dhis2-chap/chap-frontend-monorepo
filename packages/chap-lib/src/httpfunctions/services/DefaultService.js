"use strict";
exports.__esModule = true;
exports.DefaultService = void 0;
var OpenAPI_1 = require("../core/OpenAPI");
var request_1 = require("../core/request");
var DefaultService = /** @class */ (function () {
    function DefaultService() {
    }
    /**
     * Favicon
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.faviconfaviconIcoGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: 'favicon.ico'
        });
    };
    /**
     * Predict
     * Start a prediction task using the given data as training data.
     * Results can be retrieved using the get-results endpoint.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.predictPredictPost = function (requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/predict',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: "Validation Error"
            }
        });
    };
    /**
     * Evaluate
     * Start a prediction task using the given data as training data.
     * Results can be retrieved using the get-results endpoint.
     * @param requestBody
     * @param nSplits
     * @param stride
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.evaluateEvaluatePost = function (requestBody, nSplits, stride) {
        if (stride === void 0) { stride = 1; }
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/evaluate',
            query: {
                'n_splits': nSplits,
                'stride': stride
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: "Validation Error"
            }
        });
    };
    /**
     * List Models
     * List all available models. These are not validated. Should set up test suite to validate them
     * @returns ModelSpec Successful Response
     * @throws ApiError
     */
    DefaultService.listModelsListModelsGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/list-models'
        });
    };
    /**
     * List Features
     * List all available features
     * @returns Feature Successful Response
     * @throws ApiError
     */
    DefaultService.listFeaturesListFeaturesGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/list-features'
        });
    };
    /**
     * Get Results
     * Retrieve results made by the model
     * @returns FullPredictionResponse Successful Response
     * @throws ApiError
     */
    DefaultService.getResultsGetResultsGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/get-results'
        });
    };
    /**
     * Get Evaluation Results
     * Retrieve evaluation results made by the model
     * @returns EvaluationResponse Successful Response
     * @throws ApiError
     */
    DefaultService.getEvaluationResultsGetEvaluationResultsGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/get-evaluation-results'
        });
    };
    /**
     * Get Exception
     * Retrieve exception information if the job failed
     * @returns string Successful Response
     * @throws ApiError
     */
    DefaultService.getExceptionGetExceptionGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/get-exception'
        });
    };
    /**
     * Cancel
     * Cancel the current training
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.cancelCancelPost = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/cancel'
        });
    };
    /**
     * Get Status
     * Retrieve the current status of the model
     * @returns State Successful Response
     * @throws ApiError
     */
    DefaultService.getStatusStatusGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/status'
        });
    };
    return DefaultService;
}());
exports.DefaultService = DefaultService;
