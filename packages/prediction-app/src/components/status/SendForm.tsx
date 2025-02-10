import React, { useEffect } from 'react'
import { DefaultService, PredictionRequest } from '@dhis2-chap/chap-lib'
import styles from '../styles/SendForm.module.css'

interface SendFormProps {
    request: PredictionRequest
    setErrorMessage: (message: string) => void
    setUpload: (uploaded: boolean) => void
}

export const SendForm = ({
    request,
    setErrorMessage,
    setUpload,
}: SendFormProps) => {
    const sendFile = async () => {
        setErrorMessage('')
        await DefaultService.predictPredictPost(request)
            .catch((error: any) => {
                setErrorMessage(error?.body?.detail)
                setUpload(false)
            })
            .then(() => {
                setUpload(false)
            })
    }

    useEffect(() => {
        sendFile()
    }, [])

    return (
        <div className={styles.loading}>
            <>Loading..</>
        </div>
    )
}
