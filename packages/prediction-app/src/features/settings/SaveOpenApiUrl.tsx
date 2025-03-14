import React, { useEffect } from 'react'
import useUpdateDataStore from '../../hooks/useUpdateDataStore'

interface SaveOpenApiUrlProps {
    baseURL: string
    existingUrl: string
    setIsOpen: (e: boolean) => void
}

const SaveOpenApiUrl = ({
    baseURL,
    existingUrl,
    setIsOpen,
}: SaveOpenApiUrlProps) => {
    const slicedBaseUrl = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

    const {
        called,
        error,
        loading: dataStoreLoading,
        mutate,
    } = useUpdateDataStore(
        { url: slicedBaseUrl },
        'backend-url',
        existingUrl == null ? 'create' : 'update'
    )

    const triggerMutate = async () => {
        await mutate()
        window.location.reload()
    }

    useEffect(() => {
        triggerMutate()
    }, [])

    return <p>Saving..</p>
}

export default SaveOpenApiUrl
