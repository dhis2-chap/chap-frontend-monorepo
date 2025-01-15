import React from 'react'
import EvaluationDatasetHeader from './components/EvaluationDatasetHeader/EvaluationDatasetHeader'

const EvaluationOverview = () => {
  return (
    <div>
      <h2>Evaluations</h2>
      <EvaluationDatasetHeader setNewDatsetDrawerOpen={function (isOpen: boolean): void {
        throw new Error('Function not implemented.')
      } } />


      <h3>Results</h3>
    </div>
  )
}

export default EvaluationOverview