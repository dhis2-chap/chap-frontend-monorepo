import React, { useEffect, useState } from 'react'
import ResultPanel from './ResultPanel/JobPredictionPanel'
import JobResultPanelHeader from './ResultPanel/JobResultPanelHeader'
import {
    AnalyticsService,
    CrudService,
    DefaultService,
    JobDescription,
    JobsService,
    PredictionInfo,
} from '@dhis2-chap/chap-lib'
import { JobPrediction } from './interfaces/JobPrediction'

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

    const puller = async (onPageLoad: boolean) => {
        //fetch prediction after get jobs, then fetch predictions
        //await new Promise((resolve) => setTimeout(resolve, delay))
        let fetched_jobs = await fetchJobs()
        console.log('start to fetch', fetched_jobs.length)
        setJobs(fetched_jobs)

        if (
            JSON.stringify(jobs) === JSON.stringify(fetched_jobs) &&
            !onPageLoad
        )
            return puller(false)

        console.log('continue', fetched_jobs.length)
        //await two second, and fetch jobs again
        //await new Promise((resolve) => setTimeout(resolve, 2_000))
        fetched_jobs = await fetchJobs()
        const fetched_predictions = await fetchPredictions()

        console.log(fetched_predictions)

        setJobs(fetched_jobs)
        setPredictions(fetched_predictions)

        puller(false)

        //return () => clearInterval(interval)
    }

    const fetchJobs = async (): Promise<JobDescription[]> => {
        const response = await JobsService.listJobsJobsGet().then()
        return response
    }

    const fetchPredictions = async (): Promise<PredictionInfo[]> => {
        const response = await CrudService.getPredictionsCrudPredictionsGet()
        return response
    }

    //when either jobs or predictions change, merge results
    useEffect(() => {
        setResult(getResults())
    }, [jobs, predictions])

    useEffect(() => {
        //will tirgger every 2 seconds and when drawer close
        puller(true)

        // Run fetchJobs at load
        //fetchJobs(0)
        //fetchPredictions()
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
            <JobResultPanelHeader />
            <ResultPanel jobPredictions={result} />
        </div>
    )
}

export default PredictionResults
