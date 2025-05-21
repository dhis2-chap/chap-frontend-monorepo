import React from 'react';
import {
  CircularLoader,
  NoticeBox,
} from '@dhis2/ui';
import { Card } from '@dhis2-chap/chap-lib';
import i18n from '@dhis2/d2-i18n';
import styles from './ActiveJobsPage.module.css';
import { PageHeader } from '../features/common-features/PageHeader/PageHeader';

export const ActiveJobsPage: React.FC = () => {
  return (
    <>
      <PageHeader
        pageTitle={i18n.t('Active jobs')}
        pageDescription={i18n.t('View and manage currently running jobs and their status.')}
      />
      <Card className={styles.container}>
        <div className={styles.emptyContainer}>
          {/* Empty page content will be added in future tasks */}
          <p>{i18n.t('No active jobs content yet.')}</p>
        </div>
      </Card>
    </>
  );
};
