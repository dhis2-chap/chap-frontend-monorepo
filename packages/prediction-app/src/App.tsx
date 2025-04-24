import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import CreateRoutePage from './components/CreateRoutePage'
import ErrorPage from './components/ErrorPage'
import React, { useState } from 'react'
import './App.css'
import PageWrapper from './components/PageWrapper'
import EvaluationPage from './pages/EvaluationPage'
import PredictionOverview from './features/predictions-overview/PredictionOverview'
import SetChapUrl from './features/route-api/SetChapUrl'
import Settings from './features/settings/Settings'

const router = createHashRouter([
    {
        path: 'route',
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'create-route',
                element: <CreateRoutePage />,
            },
        ],
    },
    {
        path: '',
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Navigate to="/evaluate" replace />,
            },
            {
                path: '/evaluate',
                element: <PageWrapper component={<EvaluationPage />} />,
            },
            {
                path: '/predict',
                element: <PageWrapper component={<PredictionOverview />} />,
            },
            {
                path: '/settings',
                element: <PageWrapper component={<Settings />} />,
            },
        ],
    },
])

const App = () => {
    const [isLoadingRouteConfig, setIsLoadingRouteConfig] = useState(true)

    return (
        <>
            <SetChapUrl setIsLoadingRouteConfig={setIsLoadingRouteConfig} />

            {!isLoadingRouteConfig && (
                <RouterProvider router={router}></RouterProvider>
            )}
        </>
    )
}

export default App
