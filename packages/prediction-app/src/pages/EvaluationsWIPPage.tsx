import React from 'react';
import {
    CircularLoader,
    NoticeBox,
    Button,
    IconAdd16,
} from '@dhis2/ui';
import { Card } from '@dhis2-chap/chap-lib';
import i18n from '@dhis2/d2-i18n';
import styles from './EvaluationsWIPPage.module.css';
import { useBacktests } from '../hooks/useBacktests';
import { BacktestsTable } from '../components/BacktestsTable';
import PageHeader from '../features/common-features/PageHeader/PageHeader';
import { useNavigate } from 'react-router-dom';

export const EvaluationsWIPPage: React.FC = () => {
    const { backtests, error, isLoading } = useBacktests();
    const navigate = useNavigate();

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
        <>
            <PageHeader
                pageTitle={i18n.t('Evaluations')}
                pageDescription={i18n.t('Evaluates the accuracy of a predictive model using historical data. Compares actual outcomes with predicted values to assess model performance.')}
            />
            <Card className={styles.container}>
                <div className={styles.buttonContainer}>
                    <div className={styles.leftSection}></div>
                    <div className={styles.rightSection}>
                        <Button
                            primary
                            icon={<IconAdd16 />}
                            small
                            onClick={() => {
                                navigate('/evaluations/new');
                            }}
                        >
                            {i18n.t('New evaluation')}
                        </Button>
                    </div>
                </div>
                <BacktestsTable backtests={backtests || []} />
            </Card>
        </>
    );
};
