

import React from 'react'
import PredictionResult from '../../../components/results/PredictionResult'
import { Result } from '../PredictionResults'
import { Modal } from '@dhis2/ui'

interface ImportPredictionProps {
  setIsImportModalOpen: (value: boolean) => void
  isImportModalOpen : boolean
  predictionToImport: Result
}

const ImportPrediction = ({isImportModalOpen, setIsImportModalOpen} : ImportPredictionProps) => {
  return (
    <div>
      {isImportModalOpen &&
        <Modal onClose={() => {setIsImportModalOpen(false)}}>
          <div>
            <PredictionResult />
          </div>
        </Modal>
      }
      
    </div>
  )
}

export default ImportPrediction