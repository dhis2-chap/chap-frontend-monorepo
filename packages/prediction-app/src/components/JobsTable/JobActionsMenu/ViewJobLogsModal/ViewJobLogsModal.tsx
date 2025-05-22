import React, { useRef, useEffect, useMemo } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, Button, CircularLoader } from '@dhis2/ui';
import { useQuery } from '@tanstack/react-query';
import { ApiError, JobsService } from '@dhis2-chap/chap-lib';
import i18n from '@dhis2/d2-i18n';
import styles from './ViewJobLogsModal.module.css';
import { JOB_STATUSES } from '../../../../hooks/useJobs';

interface ViewJobLogsModalProps {
    jobId: string;
    status: keyof typeof JOB_STATUSES;
    onClose: () => void;
}

const PAGE_STATUS = {
    LOADING: 'loading',
    ERROR: 'error',
    SUCCESS: 'success',
}

export const ViewJobLogsModal = ({ jobId, status, onClose }: ViewJobLogsModalProps) => {
    const logRef = useRef<HTMLPreElement>(null);

    const {
        data: logs,
        error,
        isLoading,
    } = useQuery<string, ApiError | Error>({
        queryKey: ['jobLogs', jobId],
        queryFn: () => JobsService.getLogsJobsJobIdLogsGet(jobId),
        refetchInterval: () => {
            if (status === JOB_STATUSES.PENDING || status === JOB_STATUSES.STARTED) {
                return 5 * 60 * 1000;
            }
            return false;
        },
        enabled: !!jobId,
    });

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    const pageStatus = useMemo(() => {
        if (isLoading) {
            return PAGE_STATUS.LOADING;
        }
        if (error) {
            return PAGE_STATUS.ERROR;
        }
        return PAGE_STATUS.SUCCESS;
    }, [isLoading, error]);
    
    return (
        <Modal onClose={onClose} fluid={pageStatus === PAGE_STATUS.SUCCESS}>
            <ModalTitle>{i18n.t('Job Logs')} - {jobId}</ModalTitle>
            <ModalContent className={styles.modal}>
                {pageStatus === PAGE_STATUS.LOADING && (
                    <div className={styles.loading}>
                        <CircularLoader />
                    </div>
                )}

                {pageStatus === PAGE_STATUS.ERROR && (
                    <div className={styles.loading}>
                        <p className={styles.error}>
                            {i18n.t('An error occurred while loading the logs.')}
                        </p>

                        {error && (
                            <p className={styles.error}>
                                {error.message}
                            </p>
                        )}
                    </div>
                )}

                {pageStatus === PAGE_STATUS.SUCCESS && (
                    <pre className={styles.logContent} ref={logRef}>
                        {logs || i18n.t('No logs reported for this job')}
                    </pre>
                )}
            </ModalContent>
            <ModalActions>
                <Button
                    onClick={onClose}
                    secondary
                >
                    {i18n.t('Close')}
                </Button>
            </ModalActions>
        </Modal>
    );
}; 