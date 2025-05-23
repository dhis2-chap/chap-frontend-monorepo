import React, { useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { EvaluationForm, EvaluationFormValues } from './EvaluationForm'
import { Card } from '@dhis2-chap/chap-lib'
import { Button } from '@dhis2/ui'
import PageHeader from '../../features/common-features/PageHeader/PageHeader'
import { InspectDatasetModal } from '../../components/InspectDatasetModal'

export const NewEvaluationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmit = (data: EvaluationFormValues) => {
    console.log('Evaluation form submitted:', data)
  }

  return (
    <div>
      <PageHeader
        pageTitle={i18n.t('New evaluation')}
        pageDescription={i18n.t('Create a new evaluation to assess the performance of a model')}
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <Card>
            <EvaluationForm onSubmit={handleSubmit} />
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card>
            <Button
              onClick={() => setIsModalOpen(true)}
            >
              {i18n.t('Inspect dataset')}
            </Button>
          </Card>
        </div>
      </div>

      <InspectDatasetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
