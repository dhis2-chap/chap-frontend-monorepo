import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
//import PredictionPage from "./components/prediction/PredictionPage";
import PredictionPage from "./pages/PredictionsPage";
import ResultsPage from "./components/results/ResultsPage";

import CreateRoutePage from "./components/CreateRoutePage";
import RouteSettingsPage from "./components/RouteSettingsPage";
import ErrorPage from "./components/ErrorPage";
import StatusPage from "./components/StatusPage";
import React, { useState } from "react";
import "./App.css";
import EvaluationPage from "./pages/EvaluationPage";
import PageWrapper from "./components/PageWrapper";
import SettingsPage from "./pages/SettingsPage";
import { useResolvedPath } from "react-router-dom";
import { useConfig } from "@dhis2/app-runtime";
import useGetDataStore from "./hooks/useGetDataStore";
import { OpenAPI } from "@dhis2-chap/chap-lib";
import SetChapUrl from "./features/route-api/SetChapUrl";





const router = createHashRouter([
  {
    path: "route",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "create-route",
        element: <CreateRoutePage />,
      },
    ]
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <PageWrapper component={<PredictionPage/>}/>
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
]);

const App = () => {

    //const { pathname } = useResolvedPath({});

  const [isLoadingRouteConfig, setIsLoadingRouteConfig] = useState(true)
  

  return (
    <>
      <SetChapUrl setIsLoadingRouteConfig={setIsLoadingRouteConfig}/>
      { !isLoadingRouteConfig && <RouterProvider router={router}></RouterProvider>}
    </>
  )
};

export default App;
