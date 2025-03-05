import { createHashRouter, RouterProvider } from 'react-router-dom'
import Root from './components/Root'
import PredictionPage from './components/prediction/PredictionPage'
import ResultsPage from './components/results/ResultsPage'
import SettingsPage from './components/settings/SettingsPage'
import CreateRoutePage from './components/CreateRoutePage'
import RouteSettingsPage from './components/RouteSettingsPage'
import ErrorPage from './components/ErrorPage'
import StatusPage from './components/StatusPage'
import React from 'react'
import './App.css'
import PageWrapper from './components/PageWrapper'
import EvaluationPage from './pages/EvaluationPage'
import PredictionOverview from './features/predictions-overview/PredictionOverview'

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
                path: "/",
                element: <PageWrapper component={<PredictionOverview/>}/>
            },
            {
                path: "/evaluations",
                element: <PageWrapper component={<EvaluationPage/>}/>
            },
            {
                path: "/settings",
                element: <PageWrapper component={<SettingsPage/>}/>
            }
        ],
    },
])

const App = () => {
    return <RouterProvider router={router}></RouterProvider>
}

export default App
