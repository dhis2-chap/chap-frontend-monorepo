import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError() as { statusText?: string; message?: string }
    console.error(error)

    return (
        <div id="error-page">
            <h1>{i18n.t('Oops!')}</h1>
            <p>{i18n.t('Sorry, an unexpected error has occurred.')}</p>
            <p>
                <i>{error?.statusText || error?.message}</i>
            </p>
        </div>
    )
}

export default ErrorPage
