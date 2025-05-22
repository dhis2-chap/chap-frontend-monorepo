import React from 'react'
import { EvaluationForm, EvaluationFormValues } from './EvaluationForm'

export const NewEvaluationPage = () => {
  const handleSubmit = (data: EvaluationFormValues) => {
    console.log('Evaluation form submitted:', data)
  }

  return (
    <div>
      <EvaluationForm onSubmit={handleSubmit} />
    </div>
  )
}
