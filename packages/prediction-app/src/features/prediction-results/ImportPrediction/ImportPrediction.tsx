import React, { useEffect } from 'react'
import { Modal } from '@dhis2/ui'
import PredictionResult from '../../../components/results/PredictionResult'
import { CrudService, PredictionInfo } from '@dhis2-chap/chap-lib'

interface ImportPredictionProps {
    setIsImportModalOpen: (value: boolean) => void
    isImportModalOpen: boolean
    predictionToImport: PredictionInfo | undefined
}

const ImportPrediction = ({
    isImportModalOpen,
    setIsImportModalOpen,
    predictionToImport,
}: ImportPredictionProps) => {
    //fetch all prediction values
    const fetchPredictionSamples = async (predictionId: number) => {
        await CrudService.getPredictionCrudPredictionsPredictionIdGet(
            predictionId
        ).then((response: any) => {
            console.log(response)
        })
    }

    useEffect(() => {
        if (predictionToImport) fetchPredictionSamples(predictionToImport?.id)
    }, [])

    return (
        <div>
            {isImportModalOpen && (
                <Modal
                    onClose={() => {
                        setIsImportModalOpen(false)
                    }}
                >
                    <div>
                        {/*show spinner while loading*/}

                        {/*when loaded show results and view to import*/}

                        {/*make a copy of this file in folder features/import-prediction*/}
                        <PredictionResult />
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ImportPrediction
