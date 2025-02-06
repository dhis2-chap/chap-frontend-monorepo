import { Button, IconView24, IconDownload24 } from '@dhis2/ui'
import React, { useState } from 'react'
import { DefaultService } from '@dhis2-chap/chap-lib'
import { saveAs } from 'file-saver'
import styles from '../../styles/Result.module.css'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight24 } from '@dhis2/ui'

interface ResultProps {
    isReady: boolean
}

const Result = ({ isReady }: ResultProps) => {
    const [errorMessage, setErrorMessage] = useState<string>('')

    const downloadResult = async (download: boolean) => {
        return await DefaultService.getResultsGetResultsGet()
            .catch((error: any) => {})
            .then((response: any) => {
                const blob = new Blob([JSON.stringify(response, null, 2)], {
                    type: 'application/json',
                })

                if (download) {
                    const date = new Date().toJSON().slice(0, 10)
                    saveAs(blob, `chap-result-${date}.json`)
                }
                return response
            })
    }

    let navigate = useNavigate()

    const sendToPredictionPage = async () => {
        const content = (await downloadResult(false)) as any
        navigate(`/results`, { state: { data: content } })
    }

    const downloadLocaly = () => {
        downloadResult(true)
    }

    return (
        <>
            <div className={styles.buttonContainer}>
                <Button
                    className={styles.result}
                    onClick={downloadLocaly}
                    icon={<IconDownload24 />}
                >
                    Download latest result
                </Button>
                <Button
                    className={styles.result}
                    primary
                    onClick={sendToPredictionPage}
                    icon={<IconArrowRight24 />}
                >
                    Import result
                </Button>
            </div>
            <span>{errorMessage}</span>
        </>
    )
}

export default Result
