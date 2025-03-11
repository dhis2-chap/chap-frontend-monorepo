

import React, { useEffect } from 'react'

import { Result } from '../PredictionResults'
import { Modal } from '@dhis2/ui'
import PredictionResult from '../../../components/results/PredictionResult'


interface ImportPredictionProps {
  setIsImportModalOpen: (value: boolean) => void
  isImportModalOpen : boolean
  predictionToImport: Result
}

const ImportPrediction = ({isImportModalOpen, setIsImportModalOpen, predictionToImport} : ImportPredictionProps) => {

  //fetch all prediction values
  const fetchPredictionSamples = async (predictionId: string) => {

  }

  useEffect(() => {
    fetchPredictionSamples(predictionToImport?.id)
  }, [])
  

  return (

    
    <div>
      {isImportModalOpen &&
        <Modal onClose={() => {setIsImportModalOpen(false)}}>
          <div>
            {/*show spinner while loading*/}

            {/*when loaded show results and view to import*/}

            {/*make a copy of this file in folder features/import-prediction*/}
            <PredictionResult />
          </div>
        </Modal>
      }
      
    </div>
  )
}

export default ImportPrediction