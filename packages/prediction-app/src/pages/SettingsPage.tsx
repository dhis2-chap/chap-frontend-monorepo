import React, { useState } from 'react'
import RouteSettingsPage from '../components/RouteSettingsPage'
import SetChapUrl from '../features/route-api/SetChapUrl'
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
