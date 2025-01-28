import React, { useState } from 'react'
import { SendForm } from './SendForm'
import { error } from 'console'
import { Button, FileInput, IconArrowRight24 } from '@dhis2/ui'
import styles from '../styles/UploadForm.module.css'

interface UploadFormProps {
    isReady: boolean
    setUpload: (e: boolean) => void
    upload: boolean
}

const UploadForm = ({ isReady, setUpload, upload }: UploadFormProps) => {
    const [request, setRequest] = useState<any>(undefined)
    const [file, setFile] = useState<any>(undefined)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleFileSelect = (event: any) => {
        setFile(event.files[0])
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string)
                setRequest(json)
            } catch (err) {
                setErrorMessage('Failed to parse JSON file')
            }
        }
        reader.readAsText(event.files[0])
    }

    const handleUpload = async () => {
        setUpload(true)
    }

    return (
        <div>
            <div className={styles.container}>
                <div>
                    <FileInput
                        buttonLabel="Upload JSON-file"
                        onChange={handleFileSelect}
                    />
                    <div className={styles.selectedFile}>
                        <i>{file?.name}</i>
                    </div>
                </div>
                <div>
                    <Button
                        icon={<IconArrowRight24 />}
                        disabled={request == undefined}
                        onClick={() => handleUpload()}
                    >
                        Send to CHAP
                    </Button>
                </div>
            </div>
            {upload && request && (
                <SendForm
                    request={request}
                    setErrorMessage={setErrorMessage}
                    setUpload={setUpload}
                />
            )}
            <p className={styles.error}>{errorMessage}</p>
        </div>
    )
}

export default UploadForm
