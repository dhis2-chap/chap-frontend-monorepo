// @ts-nocheck
import React, { useState, useCallback } from "react";
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { api } from "./api"; // Adjust based on your openapi-typescript-codegen output path
import {CrudService, DefaultService, AnalyticsService} from "../httpfunctions";
import {processDataValues} from "../lib/dataProcessing";
import {ComparisonDashboard} from "../components/EvaluationResultDashboard";
// Initialize Query Client
const queryClient = new QueryClient();
const api = CrudService;
const BacktestRunner: React.FC = () => {
    const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    // Fetch datasets
    const { data: datasets, isLoading: datasetsLoading } = useQuery({queryKey: ["datasets"],
        queryFn: api.getDatasetsCrudDatasetsGet});

    // Fetch models (replace with your model fetching logic)
    const { data: models, isLoading: modelsLoading } = useQuery({queryKey: ["models"],queryFn: DefaultService.listModelsListModelsGet});

    //const { data: backtests, isLoading: backtestsLoading } = useQuery({queryKey: ["backtests"],
    //    queryFn: api.getBacktestsCrudBacktestsGet});

    // Create backtest mutation
    const createBacktestMutation = useMutation({
        mutationFn: api.createBacktestCrudBacktestPost,
        onSuccess: (data) => {
            alert(`Backtest started! Job ID: ${data.id}`);
        },
        onError: (error) => {
            console.error(error);
            alert(`Error starting backtest: ${error}`);
        },
    });

    // Handlers
    const handleRunBacktest = () => {
        if (!selectedDataset || !selectedModel) {
            alert("Please select both a dataset and a model!");
            return;
        }
        createBacktestMutation.mutate({
            dataset_id: selectedDataset,
            estimator_id: selectedModel,
        });
    };

    if (datasetsLoading || modelsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Run Backtest</h1>
            <div>
                <h2>Select Dataset</h2>
                <select onChange={(e) => setSelectedDataset(e.target.value)} value={selectedDataset || ""}>
                    <option value="" disabled>
                        Select a dataset
                    </option>
                    {datasets?.map((dataset) => (
                        <option key={dataset.id} value={dataset.id}>
                            {dataset.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <h2>Select Model</h2>
                <select onChange={(e) => setSelectedModel(e.target.value)} value={selectedModel || ""}>
                    <option value="" disabled>
                        Select a model
                    </option>
                    {models?.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleRunBacktest} disabled={createBacktestMutation.isLoading}>
                {createBacktestMutation.isLoading ? "Running..." : "Run Backtest"}
            </button>
        </div>
    );
};
interface BacktestSelectorProps {
    setData: (data: Record<string, Record<string, HighChartsData>>) => void;
    setData2: (data: Record<string, Record<string, HighChartsData>>) => void;
}
const BacktestSelector = (props: BacktestSelectorProps) => {
    const fetchBacktests = useCallback(() => CrudService.getBacktestsCrudBacktestGet(), [CrudService]);
    const { data: backtests, isLoading, isError, error } = useQuery({
        queryKey: ["backtests"],
        queryFn: fetchBacktests,
    });
    const [selectedBacktests, setSelectedBacktests] = useState<string[]>([]);

    // Toggle backtest selection
    const toggleSelection = (id: string) => {
        setSelectedBacktests((prev) => {
            if (prev.includes(id)) {
                return prev.filter((backtestId) => backtestId !== id); // Remove if already selected
            } else if (prev.length < 2) {
                return [...prev, id]; // Add if less than 2 selected
            }
            return prev; // Prevent selecting more than 2
        });
    };

    const handleRun = async () => {
            if (selectedBacktests.length === 2) {
        console.log("Running with backtests:", selectedBacktests);

        try {
            const highChartsData = await getHighChartsData(selectedBacktests[0]);
            console.log("HighChartsData for first backtest:", highChartsData);
            props.setData(highChartsData);

            const highChartsData1 = await getHighChartsData(selectedBacktests[1]);
            console.log("HighChartsData for second backtest:", highChartsData1);
            props.setData2(highChartsData1);

            console.log("Both datasets have been set.");
        } catch (error) {
            console.error("Error running backtests:", error);
        }
    } else {
        console.warn("You must select exactly two backtests.");
    }
    };
    // const handleRun = () => {
    //     if (selectedBacktests.length === 2) {
    //         console.log("Running with backtests:", selectedBacktests);
    //         let highChartsData = getHighChartsData(selectedBacktests[0]);
    //         console.log(highChartsData)
    //         props.setData(highChartsData);
    //         let highChartsData1 = getHighChartsData(selectedBacktests[1]);
    //         console.log(highChartsData1)
    //         props.setData2(highChartsData1);
    //     }
    // };

    if (isLoading) return <p>Loading backtests...</p>;
    if (isError) {
        console.error("Error fetching backtests:", error);
        return <p>Error loading backtests.</p>;
    }

    return (
        <div>
            <h2>Select Two Backtests</h2>
            <ul>
                {backtests.map((backtest) => (
                    <li key={backtest.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedBacktests.includes(backtest.id)}
                                onChange={() => toggleSelection(backtest.id)}
                                disabled={
                                    selectedBacktests.length === 2 &&
                                    !selectedBacktests.includes(backtest.id)
                                } // Disable other options if 2 are selected
                            />
                            {backtest.estimator_id}
                        </label>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleRun}
                disabled={selectedBacktests.length !== 2}
            >
                Run
            </button>
        </div>
    );
};

const getHighChartsData = async (backtestId: number): Promise<Record<string, Record<string, HighChartsData>>> => {
    console.log("Getting backtest data for:", backtestId);

    try {
        // Fetch evaluation entries
        const data = await AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(
            backtestId,
            [0.05, 0.25, 0.5, 0.75, 0.95]
        );

        // Fetch actual cases
        const response2 = await AnalyticsService.getActualCasesAnalyticsActualCasesBacktestIdGet(backtestId);
        const data2 = response2.data;

        // Process and return combined data
        return processDataValues(data, data2);
    } catch (error) {
        console.error("Error fetching HighCharts data:", error);
        throw error; // Rethrow the error so the caller can handle it
    }
};
// };
//
// const getHighChartsData = (backtestId: number): Record<string, Record<string, HighChartsData>> => {
//     console.log("Getting backtest data for:", backtestId)
//     //const response = AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(backtestId, [0.05, 0.25, 0.5, 0.75, 0.95]); // [0.05, 0.25, 0.5, 0.75, 0.95
//     let data = await AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(backtestId, [0.05, 0.25, 0.5, 0.75, 0.95]); // [0.05, 0.25, 0.5, 0.75, 0.95
//     let response2 = await AnalyticsService.getActualCasesAnalyticsActualCasesBacktestIdGet(backtestId)
//     let data2 = response2.data;
//     return processDataValues(data, data2);
//     // response.then((data) => {
//     //     response2.then((data2) => {
//     //         return processDataValues(data, data2.data);
//     //     });
//     // });
// }


const BacktestViewer: React.FC = () => {
    const [data, setData] = useState<Record<string, Record<string, HighChartsData>>>();
    const [data2, setData2] = useState<Record<string, Record<string, HighChartsData>>>();
    const res = (data && data2) ? <ComparisonDashboard data={data} data2={data2} splitPeriods={Object.keys(data)} name={'Model1'} name2={'Model2'}/> : <p>Loading...</p>;
    return (
            <div>
                <BacktestSelector setData={setData} setData2={setData2}/>
                {res}
            </div>
        );
};



// const BacktestsList: React.FC = () => {
//     const { data: backtests, isLoading, isError } = useQuery({
//         queryKey: ["backtests"],
//         queryFn: api.getBacktestsCrudBacktestGet, // Generated API client function
//         onError: (error) => {console.error("Error fetching backtests:", error)},
//     });
//
//     if (isLoading) return <p>Loading backtests...</p>;
//
//     return (
//         <div>
//             <h2>Existing Backtests</h2>
//             <ul>
//                 {backtests?.map((backtest) => (
//                     <li key={backtest.id}>
//                         <p>Estimator: {backtest.estimator_id}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
//};


// Wrap the component in QueryClientProvider
const App: React.FC = () => (
    <QueryClientProvider client={queryClient}>
        <BacktestRunner />
        <BacktestViewer />
    </QueryClientProvider>
);

export default App;
