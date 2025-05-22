import { useQuery } from "@tanstack/react-query";
import { JobDescription, JobsService, ApiError } from "@dhis2-chap/chap-lib";

export const JOB_STATUSES = {
    SUCCESS: 'SUCCESS',
    PENDING: 'PENDING',
    STARTED: 'STARTED',
    FAILED: 'FAILURE',
}

export const useJobs = () => {
    const { data, error, isLoading } = useQuery<JobDescription[], ApiError>({
        queryKey: ['jobs', 'all'],
        queryFn: () => JobsService.listJobsJobsGet(),
        staleTime: 5 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        retry: 0,
    });

    const { data: activeJobs } = useQuery<JobDescription[], ApiError>({
        queryKey: ['jobs', 'active'],
        queryFn: () => JobsService.listJobsJobsGet({ status: [JOB_STATUSES.PENDING, JOB_STATUSES.STARTED] }),
        staleTime: 5 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        retry: 0,
    });

    return {
        jobs: data,
        error,
        isLoading,
    };
};
