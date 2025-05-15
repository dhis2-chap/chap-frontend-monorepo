import React from 'react';
import {
    CircularLoader,
    NoticeBox,
    Card,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import styles from './EvaluationsWIPPage.module.css';
import { useBacktests } from '../hooks/useBacktests';
import { BacktestsTable } from '../components/BacktestsTable';

export const EvaluationsWIPPage: React.FC = () => {
    const { backtests, error, isLoading } = useBacktests();

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <NoticeBox error title={i18n.t('Error loading evaluations')}>
                    {error.message || i18n.t('An unknown error occurred')}
                </NoticeBox>
            </div>
        );
    }

    return (
        <Card className={styles.container}>
            <h2>{i18n.t('Evaluations (WIP)')}</h2>
            <BacktestsTable backtests={backtests || []} />
        </Card>
    );
};
