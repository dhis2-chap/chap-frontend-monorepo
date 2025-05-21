import { useQuery } from "@tanstack/react-query";
import { JobDescription, JobsService, ApiError } from "@dhis2-chap/chap-lib";

export const useJobs = () => {
    const { data, error, isLoading } = useQuery<JobDescription[], ApiError>({
        queryKey: ['jobs'],
        queryFn: () => JobsService.listJobsJobsGet(),
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
