import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from './components/Root'
import PredictionPage from './components/prediction/PredictionPage'
import ResultsPage from './components/results/ResultsPage'
import SettingsPage from './components/settings/SettingsPage'
import CreateRoutePage from './components/CreateRoutePage'
import RouteSettingsPage from './components/RouteSettingsPage'
import ErrorPage from './components/ErrorPage'
import StatusPage from './components/StatusPage'
import React, { useState } from 'react'
import './App.css'
import PageWrapper from './components/PageWrapper'
import EvaluationPage from './pages/EvaluationPage'
import PredictionOverview from './features/predictions-overview/PredictionOverview'
import SetChapUrl from './features/route-api/SetChapUrl'
import CreateRoute from './features/settings/CreateRoute'
import TestRoute from './features/settings/Settings'
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
        path: 'old',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'predict',
                element: <PredictionPage />,
            },
            {
                path: 'results',
                element: <ResultsPage />,
            },
            {
                path: 'settings',
                element: <SettingsPage />,
            },
            {
                path: 'status',
                element: <StatusPage />,
            },
            {
                path: 'route-settings',
                element: <RouteSettingsPage />,
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
                path: '/import',
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
