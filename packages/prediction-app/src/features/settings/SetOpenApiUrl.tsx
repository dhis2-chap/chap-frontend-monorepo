import { InputField } from '@dhis2/ui'
import { Button } from '@dhis2/ui'
import { Modal } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { OpenAPI } from '@dhis2-chap/chap-lib'
import styles from './SetOpenApiUrl.module.css'
import { IconSave16 } from '@dhis2/ui'
import { IconSave24 } from '@dhis2/ui'
import useUpdateDataStore, { REQUEST } from '../../hooks/useUpdateDataStore'
import SaveOpenApiUrl from './SaveOpenApiUrl'
import { useConfig } from '@dhis2/app-runtime'
import { useNavigate } from 'react-router-dom'

interface SetOpenApiUrlProps {
    setOpen: (open: boolean) => void
    existingUrl: string
    loading: boolean
    fetching: boolean
}

const SetOpenApiUrl = ({
    setOpen,
    existingUrl,
    loading,
    fetching,
}: SetOpenApiUrlProps) => {
    const [baseURL, setBaseURL] = useState<string>('')

    const config = useConfig()
    const baseUrl = config.baseUrl + '/api/routes/chap/run'

    const [saveBaseUrl, setSaveBaseUrl] = useState(false)

    const onChangeUrl = (value: string) => {
        setBaseURL(value)
    }

    const onClickSave = () => {
        setSaveBaseUrl(true)
    }

    useEffect(() => {
        if (existingUrl && !loading && !fetching) {
            setBaseURL(existingUrl)
        }
    }, [loading, existingUrl, fetching])

    return (
        <>
            <Modal>
                <div className={styles.title}>
                    Edit url to CHAP-Core backend server
                </div>
                <p>
                    Use this setting when you do not have CHAP installed as a
                    backend server, but have a running instance of CHAP Core on
                    the local machine. If not set, Modeling App use the default
                    value: <i>{baseUrl}</i>
                </p>
                <InputField
                    disabled={fetching}
                    value={baseURL}
                    onChange={(e: any) => onChangeUrl(e.value)}
                    placeholder={fetching ? 'Loading..' : ''}
                />

                <div className={styles.footer}>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                    <Button icon={<IconSave24 />} onClick={onClickSave} primary>
                        Save
                    </Button>
                </div>

                {saveBaseUrl && (
                    <SaveOpenApiUrl
                        setIsOpen={setOpen}
                        baseURL={baseURL}
                        existingUrl={existingUrl}
                    />
                )}
            </Modal>
        </>
    )
}

export default SetOpenApiUrl
