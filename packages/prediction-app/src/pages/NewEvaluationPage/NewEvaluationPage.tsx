import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { EvaluationForm, EvaluationFormValues } from '../../components/NewEvaluationForm/NewEvaluationForm'
import { Card } from '@dhis2-chap/chap-lib'
import { PageHeader } from '../../features/common-features/PageHeader/PageHeader'
import styles from './NewEvaluationPage.module.css'

export const NewEvaluationPage = () => {
  const handleSubmit = (data: EvaluationFormValues) => {
    console.log('Evaluation form submitted:', data)
  }

  return (
    <div>
      <PageHeader
        pageTitle={i18n.t('New evaluation')}
        pageDescription={i18n.t('Create a new evaluation to assess the performance of a model')}
      />
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <Card>
            <EvaluationForm onSubmit={handleSubmit} />
          </Card>
        </div>
      </div>
    </div>
  )
}
