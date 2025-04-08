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

    const setFetchEveluationPredictionDataset = () => {
        console.log('should fetch', type)
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

    const puller = async (
        onPageLoad: boolean,
        local_jobs: JobDescription[]
    ) => {
        const fetched_jobs = await fetchJobs()

        //if on load, fetch predictions and set jobs
        if (onPageLoad) {
            await setFetchEveluationPredictionDataset()
            setJobs(fetched_jobs)
            setOnPageLoading(false)
        }

        //if content is the same as stored, not set the results, just proceed to next fetch jobs
        if (JSON.stringify(fetched_jobs) === JSON.stringify(local_jobs)) {
            return puller(false, fetched_jobs)
        }

        //await two second, and fetch jobs again, since a prediction/job exisits for a short time in both jobs and get predictions
        await new Promise((resolve) => setTimeout(resolve, 4_000))
        //fetched_jobs = await fetchJobs()
        await setFetchEveluationPredictionDataset()

        setJobs(fetched_jobs)

        //start new pull, not on page load
        puller(false, fetched_jobs)
    }

    const fetchJobs = async (): Promise<JobDescription[]> => {
        const [jobs, failedJobs]: [JobDescription[], JobDescription[]] =
            await Promise.all([fetchActiveJobs(), fetchFailedJobs()])
        const allJobs: JobDescription[] = [...jobs, ...failedJobs]
        return allJobs
    }

    const fetchActiveJobs = async (): Promise<JobDescription[]> => {
        let response: JobDescription[] = []
        for (let i = 0; i < 6; i++) {
            try {
                response = await JobsService.listJobsJobsGet()
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
        return response
    }

    const fetchFailedJobs = async (): Promise<JobDescription[]> => {
        // Fetch failed jobs from api
        let response: FailedJobRead[] = []
        for (let i = 0; i < 6; i++) {
            try {
                response = await CrudService.getFailedJobsCrudFailedJobsGet()
                break
            } catch (error) {
                if (i === 2) {
                    setFetchJobError(
                        (error as ApiError)?.message ??
                            "Couldn't fetch failed jobs"
                    )
                    return []
                }
            }
        }

        // Convert FailedJobRead[] to JobDescription[]
        const jobs: JobDescription[] = response.map(
            (failedJob): JobDescription => ({
                id: failedJob.id.toString(),
                description: failedJob.message,
                status: 'Failed',
                start_time: failedJob.created,
                hostname: 'unknown',
                type: 'job',
            })
        )
        setFetchJobError(undefined)
        return jobs
    }

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

    //when either jobs or predictions change, merge results
    useEffect(() => {
        setResult(getResults())
    }, [jobs, predictions, evaluations, datasets])

    useEffect(() => {
        puller(true, [])
    }, [])

    const getResults = (): JobPrediction[] => {
        const results: JobPrediction[] = []

        datasets.forEach((dataset) => {
            results.push({
                id: dataset.id.toString(),
                name: dataset.name,
                created: new Date(dataset.created ?? ''),
                type: 'dataset',
                status: 'Completed',
            })
        })

        evaluations.forEach((evaluation) => {
            results.push({
                id: evaluation.id.toString(),
                name: evaluation.name ?? '',
                created: new Date(evaluation.timestamp ?? ''),
                type: 'evaluation',
                status: 'Completed',
            })
        })

        predictions.forEach((completed) => {
            results.push({
                id: completed.id.toString(),
                name: completed.name,
                created: new Date(completed.created),
                type: 'prediction',
                status: 'Completed',

                //prediction specific
                datasetId: completed.datasetId,
                estimatorId: completed.modelId,
                nPeriods: completed.nPeriods,
            })
        })

        const job_type_dict = {
            predictions: 'prediction',
            datasets: 'create_dataset',
            evaluations: 'backtest',
        }

        jobs.filter((o) => o.type == job_type_dict[type]).forEach((job) => {
            results.push({
                id: job.id,
                name: 'Job',
                created: new Date(job.start_time),
                type: 'job',
                status: job.status,
                //job specific
                hostname: job.start_time,
                description: job.description,
            })
        })

        results.sort((a, b) => {
            return b.created.getTime() - a.created.getTime()
        })

        return results
    }

    console.log('results for', type, result)

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
