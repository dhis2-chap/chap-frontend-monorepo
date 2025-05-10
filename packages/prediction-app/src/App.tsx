import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import ErrorPage from './components/ErrorPage'
import React from 'react'
import './App.css'
import PageWrapper from './components/PageWrapper'
import EvaluationPage from './pages/EvaluationPage'
import PredictionOverview from './features/predictions-overview/PredictionOverview'
import { SetChapUrl } from './features/route-api/SetChapUrl'
import { SettingsPage } from './features/settings/Settings'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const router = createHashRouter([
    {
        path: '/',
        element: <Navigate to="/evaluate" replace />,
    },
    {
        path: '/evaluate',
        errorElement: <ErrorPage />,
        element: <PageWrapper component={<EvaluationPage />} />,
    },
    {
        path: '/predict',
        errorElement: <ErrorPage />,
        element: <PageWrapper component={<PredictionOverview />} />,
    },
    {
        path: '/settings',
        errorElement: <ErrorPage />,
        element: <SettingsPage />,
    },
])

const App = () => {
    return (
        <>
            <SetChapUrl>
                <RouterProvider router={router} />
            </SetChapUrl>
            <ReactQueryDevtools />
        </>
    )
}

export default App
