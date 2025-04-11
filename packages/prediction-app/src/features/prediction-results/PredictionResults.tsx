import React, { useEffect, useRef, useState } from 'react'
import JobPredictionPanel from './JobPredictionPanel/JobPredictionPanel'
import PanelHeader from './JobPredictionPanel/JobPredictionPanelHeader'
import {
    AnalyticsService,
    ApiError,
    BackTestRead,
    CancelablePromise,
    CrudService,
    DataSetRead,
    DefaultService,
    FailedJobRead,
    JobDescription,
    JobsService,
    PredictionInfo,
} from '@dhis2-chap/chap-lib'
import { JobPrediction } from './interfaces/JobPrediction'
import FetchError from './FetchError/FetchError'
import LoadingJobPrediction from './LoadingJobPrediction/LoadingJobPrediction'
import { NoJobPrediction } from './NoJobPrediction/NoJobPrediction'
import usePolling from '../../hooks/usePolling'

interface Job {
    id: string
    name: string
    status: string
    created: Date
}

export interface PredictionResultsProps {
    type: 'predictions' | 'datasets' | 'evaluations'
}

const PredictionResults = ({ type }: PredictionResultsProps) => {
    const [jobs, setJobs] = useState<JobDescription[]>([])
    const [predictions, setPredictions] = useState<PredictionInfo[]>([])
    const [datasets, setDatasets] = useState<DataSetRead[]>([])
    const [evaluations, setEvaluations] = useState<BackTestRead[]>([])

    const [result, setResult] = useState<JobPrediction[]>([])

    const [fetchJobError, setFetchJobError] = useState<string | undefined>()
    const [fetchPredictionError, setFetchPredictionError] = useState<
        string | undefined
    >()

    const [onPageLoading, setOnPageLoading] = useState(true)

    const fetchPredictions = async (
        service: CancelablePromise<
            Array<PredictionInfo | BackTestRead | DataSetRead>
        >
    ) => {
        for (let i = 0; i < 5; i++) {
            try {
                const response = await service
                setFetchPredictionError(undefined)
                return response
            } catch (error) {
                if (i === 4) {
                    setFetchPredictionError(
                        (error as ApiError)?.message ?? `Couldn't fetch ${type}`
                    )
                    return []
                }
            }
        }
    }

    const setFetchEveluationPredictionDataset = () => {
        switch (type) {
            case 'predictions':
                return fetchPredictions(
                    CrudService.getPredictionsCrudPredictionsGet()
                ).then((e) => setPredictions(e as PredictionInfo[]))
            case 'datasets':
                return fetchPredictions(
                    CrudService.getDatasetsCrudDatasetsGet()
                ).then((e) => setDatasets(e as DataSetRead[]))
            case 'evaluations':
                return fetchPredictions(
                    CrudService.getBacktestsCrudBacktestsGet()
                ).then((e) => setEvaluations(e as BackTestRead[]))
            // rurn fetchEvaluations()
        }
    }

    const fetchJobs = async (): Promise<JobDescription[]> => {
        let jobs: JobDescription[] = []
        for (let i = 0; i < 6; i++) {
            try {
                jobs = await JobsService.listJobsJobsGet()
                break
            } catch (error) {
                if (i === 2) {
                    setFetchJobError(
                        (error as ApiError)?.message ?? "Couldn't fetch jobs"
                    )
                    return []
                }
            }
        }
        setFetchJobError(undefined)
        return jobs
    }

    const getResults = (): JobPrediction[] => {
        const results: JobPrediction[] = []

        datasets.forEach((dataset) => {
            results.push({
                id: 'Unknown',
                name: dataset.name,
                created: new Date(dataset.created ?? ''),
                type: 'dataset',
                status: 'SUCCESS',
                result: dataset.id.toString(),
            })
        })

        evaluations.forEach((evaluation) => {
            results.push({
                id: 'Unknown',
                name: evaluation.name ?? '',
                created: new Date(evaluation.created ?? ''),
                type: 'evaluation',
                status: 'SUCCESS',
                result: evaluation.id.toString(),
            })
        })

        predictions.forEach((prediction) => {
            results.push({
                id: 'Unknown',
                name: prediction.name,
                created: new Date(prediction.created),
                type: 'prediction',
                status: 'SUCCESS',
                result: prediction.id.toString(),

                //prediction specific
                datasetId: prediction.datasetId,
                estimatorId: prediction.modelId,
                nPeriods: prediction.nPeriods,
            })
        })

        const job_type_dict = {
            predictions: 'create_prediction',
            datasets: 'create_dataset',
            evaluations: 'create_backtest',
        }

        const job_type_make_singular = {
            predictions: 'prediction',
            datasets: 'dataset',
            evaluations: 'evaluation',
        }

        // jobs results are only meant to add more info on jobs that didnt succeed
        jobs.filter(
            (o) => o.status != 'SUCCESS' && o.type == job_type_dict[type]
        ).forEach((job) => {
            results.push({
                id: job.id,
                name: job.name,
                created: new Date(job.start_time),
                type: job_type_make_singular[type],
                status: job.status,
                //result: job?.result,
                //job specific
                //hostname: job.start_time,
                //description: job.description,
            })
        })
        //console.log('filtered jobs', jobs)

        results.sort((a, b) => {
            return b.created.getTime() - a.created.getTime()
        })

        return results
    }

    const puller = async () => {
        await setFetchEveluationPredictionDataset()
        const fetched_jobs = await fetchJobs()
        setJobs(fetched_jobs)
        setOnPageLoading(false)
    }

    // trigger initial data pull
    useEffect(() => {
        puller()
    }, [])

    // trigger job pulling every X seconds
    usePolling(puller, 5000)

    // listen for changes to jobs, datasets, evaluations, predictions, and update results in ui
    useEffect(() => {
        setResult(getResults())
    }, [jobs, predictions, evaluations, datasets])

    return (
        <div>
            <FetchError error={fetchJobError} type="job" />
            <FetchError error={fetchPredictionError} type={type} />
            {onPageLoading && <LoadingJobPrediction type={type} />}
            {result.length > 0 && <PanelHeader />}
            {result.length == 0 && !onPageLoading && (
                <NoJobPrediction type={type} />
            )}
            <JobPredictionPanel jobPredictions={result} />
        </div>
    )
}

export default PredictionResults
