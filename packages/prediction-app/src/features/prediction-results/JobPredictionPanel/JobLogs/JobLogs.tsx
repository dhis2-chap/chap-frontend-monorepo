import React, { useState, useEffect } from 'react'
import { JobsService } from '@dhis2-chap/chap-lib'
import styles from './JobLogs.module.css'

interface JobLogsProps {
    jobId : string | undefined
}

const JobLogs = ({ jobId }: JobLogsProps) => {
    const [logs, setLogs] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!jobId) return

        const fetchLogs = async () => {
            setLoading(true)
            setError(null)

            try {
                const logText = await JobsService.getLogsJobsJobIdLogsGet(jobId)
                setLogs(logText)
            } catch (err: any) {
                setError(err.body.detail)
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [jobId])

    if (!jobId) return <p>No job ID provided.</p>
    if (loading) return <p>Loading logs...</p>
    if (error) return <p className={styles.error}>Error: {error}</p>

    return (
        <div className={styles.jobLogs}>
            <h2>Job Logs</h2>
            <pre className={styles.logContent}>
                {logs || '<No logs reported for this job>'}
            </pre>
        </div>
    )
}

export default JobLogs