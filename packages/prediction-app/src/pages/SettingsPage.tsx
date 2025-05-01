import React, { useState } from 'react'
import SetOpenApiUrl from '../features/settings/SetOpenApiUrl'

const SettingsPage = () => {
    const [isSetOpenApiUrlModalOpen, setIsSetOpenApiUrlModalOpen] =
        useState(true)

    const existingUrl = ''
    const fetching = false
    const loading = false

    return (
        <div>
            {isSetOpenApiUrlModalOpen && (
                <SetOpenApiUrl
                    existingUrl={existingUrl}
                    fetching={fetching}
                    loading={loading}
                    setOpen={setIsSetOpenApiUrlModalOpen}
                />
            )}
        </div>
    )
}

export default SettingsPage
