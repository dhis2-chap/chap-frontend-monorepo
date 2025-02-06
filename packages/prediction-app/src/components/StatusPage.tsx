import React, { useState } from 'react'
import UploadForm from './status/UploadForm'
import Status from './status/status/Status'
import Result from './status/result/Result'
import styles from './styles/StatusPage.module.css'

const StatusPage = () => {
    const [isReady, setIsReady] = useState<boolean>(false)
    const [upload, setUpload] = useState<boolean>(false)

    return (
        <div className={styles.statusContainer}>
            <h2>CHAP Core - evaluation and prediction status</h2>
            <p>
                <i>
                    On this page, you could upload data to CHAP Core and
                    download the latest prediction result.
                </i>
            </p>

            <UploadForm
                upload={upload}
                setUpload={setUpload}
                isReady={isReady}
            />

            <Status upload={upload} setIsReady={setIsReady} />

            <Result isReady={isReady} />
        </div>
    )
}

export default StatusPage
