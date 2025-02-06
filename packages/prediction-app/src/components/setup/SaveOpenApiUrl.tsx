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
    const {
        called,
        error,
        loading: dataStoreLoading,
        mutate,
    } = useUpdateDataStore(
        { url: baseURL },
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
