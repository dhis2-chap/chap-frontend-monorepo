import {
    createHashRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from 'react-router-dom'
import ErrorPage from './components/ErrorPage'
import React from 'react'
import './locales'
import './App.css'
import PageWrapper from './components/PageWrapper'
import EvaluationPage from './pages/EvaluationPage'
import PredictionOverview from './features/predictions-overview/PredictionOverview'
import { SetChapUrl } from './features/route-api/SetChapUrl'
import { SettingsPage } from './features/settings/Settings'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CssReset, CssVariables } from '@dhis2/ui'
import { Layout } from './components/layout/Layout'
import { RouteValidator } from './components/RouteValidator'
import InfoAboutReportingBugs from './features/common-features/InfoAboutReportingBugs/InfoAboutReportingBugs'
import WarnAboutIncompatibleVersion from './features/common-features/WarnAboutIncompatibleVersion/WarnAboutIncompatibleVersion'
import { EvaluationsWIPPage } from './pages/EvaluationWIPPAge'
import { ChapValidator } from './components/ChapValidator'
import { JobsPage } from './pages/JobsPage'
import { EvaluationComparePage } from './pages/EvaluationCompare'

export type RouteHandle = {
    fullWidth?: boolean
}

const router = createHashRouter([
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Navigate to="/evaluate" replace />,
            },
            {
                element: (
                    <RouteValidator>
                        <ChapValidator>
                            <InfoAboutReportingBugs />
                            <WarnAboutIncompatibleVersion />
                            <PageWrapper>
                                <Outlet />
                            </PageWrapper>
                        </ChapValidator>
                    </RouteValidator>
                ),
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: '/evaluate',
                        children: [
                            {
                                index: true,
                                element: <EvaluationPage />,
                            },
                            {
                                path: 'compare',
                                handle: {
                                    fullWidth: true,
                                } satisfies RouteHandle,
                                element: <EvaluationComparePage />,
                            },
                        ],
                    },
                    {
                        path: '/evaluationsWIP',
                        element: <EvaluationsWIPPage />,
                    },
                    {
                        path: '/jobs',
                        element: <JobsPage />,
                    },
                    {
                        path: '/predict',
                        element: <PredictionOverview />,
                    },
                ],
            },
            {
                path: '/settings',
                element: (
                    <PageWrapper>
                        <SettingsPage />
                    </PageWrapper>
                ),
            },
        ],
    },
])

const App = () => {
    return (
        <>
            <CssReset />
            <CssVariables theme spacers colors elevations />
            <SetChapUrl>
                <RouterProvider router={router} />
            </SetChapUrl>
            <ReactQueryDevtools position="bottom-right" />
        </>
    )
}

export default App
