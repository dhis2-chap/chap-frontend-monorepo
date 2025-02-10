import React, { useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import styles from './styles/ResultsPage.module.css'
import { SelectImportMode } from './SelectImportMode'
import PredictionResult from './PredictionResult'
import EvaluationResult from './EvaluationResult'

const ResultsPage = () => {
    const [importMode, setImportMode] = useState<
        undefined | 'predict' | 'evaluate'
    >(undefined)

    return (
        <div className={styles.container}>
            <h1>{i18n.t('CHAP Core results')}</h1>
            <div className={styles.importMode}>
                <SelectImportMode
                    importMode={importMode}
                    setImportMode={setImportMode}
                />
            </div>
            <div>
                {
                    {
                        undefined: <></>,
                        predict: <PredictionResult />,
                        evaluate: <EvaluationResult />,
                    }[String(importMode)]
                }
            </div>
        </div>
    )
}

export default ResultsPage
