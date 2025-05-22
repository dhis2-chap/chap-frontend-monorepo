import React, { useState } from 'react';
import {
    FlyoutMenu,
    MenuItem,
    IconDelete16,
    IconView16,
    IconMore16,
    IconCopy16,
    IconCheckmark16,
    IconArrowRight16,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { OverflowButton } from '@dhis2-chap/chap-lib';
import { ViewJobLogsModal } from './ViewJobLogsModal/ViewJobLogsModal';
import { DeleteJobModal } from './DeleteJobModal/DeleteJobModal';
import { JOB_STATUSES, JOB_TYPES } from '../../../hooks/useJobs';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { useAlert } from '@dhis2/app-runtime';
import { useNavigate } from 'react-router-dom';

type Props = {
    jobId: string;
    status: keyof typeof JOB_STATUSES;
    result: string | undefined | null;
    type: string;
}

export const JobActionsMenu = ({
    jobId,
    status,
    result,
    type,
}: Props) => {
    const navigate = useNavigate();
    const [flyoutMenuIsOpen, setFlyoutMenuIsOpen] = useState(false);
    const [viewLogsModalIsOpen, setViewLogsModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    const { show: showErrorAlert } = useAlert(
        i18n.t('Failed to copy job ID'),
        { success: false },
    );

    const { copy: copyToClipboard, isCopied } = useCopyToClipboard({
        onError: () => showErrorAlert(),
    });

    const handleViewLogs = () => {
        setFlyoutMenuIsOpen(false);
        setViewLogsModalIsOpen(true);
    };

    const handleNavigateToResult = () => {
        console.log('type', type);
        if (type === JOB_TYPES.CREATE_BACKTEST_WITH_DATA || type === JOB_TYPES.BACKTEST) {
            navigate(`/evaluationsWIP?id=${result}`);
        } else if (type === JOB_TYPES.MAKE_PREDICTION) {
            navigate(`/predict`);
        }
        setFlyoutMenuIsOpen(false);
    };

    return (
        <>
            <OverflowButton
                small
                open={flyoutMenuIsOpen}
                icon={<IconMore16 />}
                onClick={() => {
                    setFlyoutMenuIsOpen(prev => !prev);
                }}
                component={
                    <FlyoutMenu dense>
                        <MenuItem
                            label={i18n.t('Go to result')}
                            dataTest={'job-overflow-go-to-result'}
                            disabled={!result}
                            icon={<IconArrowRight16 />}
                            onClick={handleNavigateToResult}
                        />

                        <MenuItem
                            label={i18n.t('View Logs')}
                            dataTest={'job-overflow-view-logs'}
                            icon={<IconView16 />}
                            onClick={handleViewLogs}
                        />

                        <MenuItem
                            label={i18n.t('Copy Job ID')}
                            dataTest={'job-overflow-copy-job-id'}
                            icon={isCopied ? <IconCheckmark16 /> : <IconCopy16 />}
                            onClick={() => {
                                copyToClipboard(jobId);
                            }}
                        />

                        <MenuItem
                            label={i18n.t('Delete')}
                            dataTest={'job-overflow-delete'}
                            destructive
                            disabled={status === JOB_STATUSES.PENDING || status === JOB_STATUSES.STARTED}
                            icon={<IconDelete16 />}
                            onClick={() => {
                                setDeleteModalIsOpen(true);
                                setFlyoutMenuIsOpen(false);
                            }}
                        />
                    </FlyoutMenu>
                }
            />

            {viewLogsModalIsOpen && (
                <ViewJobLogsModal
                    jobId={jobId}
                    status={status}
                    onClose={() => setViewLogsModalIsOpen(false)}
                />
            )}

            {deleteModalIsOpen && (
                <DeleteJobModal
                    id={jobId}
                    onClose={() => setDeleteModalIsOpen(false)}
                />
            )}
        </>
    );
}; 