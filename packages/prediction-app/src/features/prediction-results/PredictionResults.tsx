import React, { useEffect, useRef, useState } from 'react'
import JobPredictionPanel from './JobPredictionPanel/JobPredictionPanel'
import PanelHeader from './JobPredictionPanel/JobPredictionPanelHeader'
import {
    AnalyticsService,
    ApiError,
    CrudService,
    DefaultService,
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
    triggerUpdateJobs: any
}

const PredictionResults = ({ triggerUpdateJobs }: PredictionResultsProps) => {
    const [jobs, setJobs] = useState<JobDescription[]>([])
    const [predictions, setPredictions] = useState<PredictionInfo[]>([])
    const [result, setResult] = useState<JobPrediction[]>([])

    const [fetchJobError, setFetchJobError] = useState<string | undefined>()
    const [fetchPredictionError, setFetchPredictionError] = useState<
        string | undefined
    >()

    const [onPageLoading, setOnPageLoading] = useState(true)

    const puller = async (
        onPageLoad: boolean,
        local_jobs: JobDescription[]
    ) => {
        const fetched_jobs = await fetchJobs()

        if (onPageLoad) {
            //if on load, fetch predictions and set jobs
            setPredictions(await fetchPredictions())
            setJobs(local_jobs)
            setOnPageLoading(false)
        }

        console.log(
            'comparing jobs',
            JSON.stringify(fetched_jobs.length),
            JSON.stringify(local_jobs.length)
        )
        if (
            //if content is the same as stored, not set the results, just proceed to next fetch jobs

            JSON.stringify(fetched_jobs) === JSON.stringify(local_jobs)
        ) {
            return puller(false, fetched_jobs)
        }

        //await two second, and fetch jobs again, since a prediction/job exisits for a short time in both jobs and get predictions
        await new Promise((resolve) => setTimeout(resolve, 2_000))
        //fetched_jobs = await fetchJobs()
        const fetched_predictions = await fetchPredictions()

        console.log(
            'is not equal, set jobs and predictions',
            fetched_jobs.length,
            jobs.length
        )

        setJobs(fetched_jobs)
        setPredictions(fetched_predictions)

        //start new pull, not on page load
        puller(false, fetched_jobs)
    }

    const fetchJobs = async (): Promise<JobDescription[]> => {
        let response: JobDescription[] = []
        for (let i = 0; i < 3; i++) {
            try {
                response = await JobsService.listJobsJobsGet()
                break
            } catch (error) {
                if (i === 2) {
                    setFetchJobError(
                        (error as ApiError)?.message ??
                            "Couldn't fetch predictions"
                    )
                    return []
                }
            }
        }
        setFetchJobError(undefined)
        return response
    }

    const fetchPredictions = async (): Promise<PredictionInfo[]> => {
        let response: PredictionInfo[] = []
        for (let i = 0; i < 3; i++) {
            try {
                response = await CrudService.getPredictionsCrudPredictionsGet()
                break
            } catch (error) {
                if (i === 2) {
                    setFetchPredictionError(
                        (error as ApiError)?.message ??
                            "Couldn't fetch predictions"
                    )
                    return []
                }
            }
        }
        setFetchPredictionError(undefined)
        return response
    }

    //when either jobs or predictions change, merge results
    useEffect(() => {
        setResult(getResults())
    }, [jobs, predictions])

    useEffect(() => {
        puller(true, [])
    }, [])

    const getResults = (): JobPrediction[] => {
        const results: JobPrediction[] = []

        predictions.forEach((completed) => {
            results.push({
                id: completed.id.toString(),
                name: completed.name,
                created: new Date(completed.created),
                type: 'prediction',
                status: 'Completed',

                //prediction specific
                datasetId: completed.datasetId,
                estimatorId: completed.estimatorId,
                nPeriods: completed.nPeriods,
            })
        })

        jobs.forEach((job) => {
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
            if (a.type === b.type) {
                return b.created.getTime() - a.created.getTime()
            }
            return a.type === 'job' ? -1 : 1
        })

        return results
    }

    return (
        <div>
            <FetchError error={fetchJobError} type="job" />
            <FetchError error={fetchPredictionError} type="prediction" />
            {onPageLoading && <LoadingJobPrediction />}
            {result.length > 0 && <PanelHeader />}
            {result.length == 0 && !onPageLoading && <NoJobPrediction />}
            <JobPredictionPanel jobPredictions={result} />
        </div>
    )
}

export default PredictionResults
