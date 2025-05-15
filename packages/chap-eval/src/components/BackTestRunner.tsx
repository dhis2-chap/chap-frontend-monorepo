import React, { useState, useCallback } from 'react'
import {
    useQuery,
    useMutation,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { evaluationResultToViewData } from '@dhis2-chap/chap-lib'
import {
    CrudService,
    DefaultService,
    AnalyticsService,
} from '@dhis2-chap/chap-lib'
import { addModelName } from '../lib/dataProcessing'
import { ComparisonDashboard } from '../components/EvaluationResultDashboard'
import { EvaluationForSplitPoint } from '@dhis2-chap/chap-lib'

// Initialize Query Client
const queryClient = new QueryClient()
const api = CrudService
const BacktestRunner: React.FC = () => {
    const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
    const [selectedModel, setSelectedModel] = useState<string | null>(null)

    // Fetch datasets
    const { data: datasets, isPending: datasetsLoading } = useQuery({
        queryKey: ['datasets'],
        queryFn: api.getDatasetsCrudDatasetsGet,
    })

    // Fetch models (replace with your model fetching logic)
    const { data: models, isPending: modelsLoading } = useQuery({
        queryKey: ['models'],
        queryFn: DefaultService.listModelsListModelsGet,
    })

    // Create backtest mutation
    const createBacktestMutation = useMutation({
        mutationFn: api.createBacktestCrudBacktestsPost,
        onSuccess: (data) => {
            alert(`Backtest started! Job ID: ${data.id}`)
        },
        onError: (error) => {
            console.error(error)
            alert(`Error starting backtest: ${error}`)
        },
    })

    // Handlers
    const handleRunBacktest = () => {
        if (!selectedDataset || !selectedModel) {
            alert('Please select both a dataset and a model!')
            return
        }
        createBacktestMutation.mutate({
            datasetId: +selectedDataset,
            modelId: selectedModel,
        })
    }

    if (datasetsLoading || modelsLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Run Backtest</h1>
            <div>
                <h2>Select Dataset</h2>
                <select
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    value={selectedDataset || ''}
                >
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
                <select
                    onChange={(e) => setSelectedModel(e.target.value)}
                    value={selectedModel || ''}
                >
                    <option value="" disabled>
                        Select a model
                    </option>
                    {models?.map((model) => (
                        <option key={model.name} value={model.name}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleRunBacktest}
                disabled={createBacktestMutation.isPending}
            >
                {createBacktestMutation.isPending
                    ? 'Running...'
                    : 'Run Backtest'}
            </button>
        </div>
    )
}

interface BacktestSelectorProps {
    setData: (data: EvaluationForSplitPoint[]) => void
}

const BacktestSelector = (props: BacktestSelectorProps) => {
    const fetchBacktests = useCallback(
        () => CrudService.getBacktestsCrudBacktestsGet(),
        []
    )
    const {
        data: backtests,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['backtests'],
        queryFn: fetchBacktests,
    })
    const [selectedBacktests, setSelectedBacktests] = useState<string[]>([])

    // Toggle backtest selection
    const toggleSelection = (id: string) => {
        setSelectedBacktests((prev) => {
            if (prev.includes(id)) {
                return prev.filter((backtestId) => backtestId !== id) // Remove if already selected
            } else if (prev.length < 2) {
                return [...prev, id] // Add if less than 2 selected
            }
            return prev // Prevent selecting more than 2
        })
    }

    const handleRun = async () => {
        if (selectedBacktests.length === 2) {
            console.log('Running with backtests:', selectedBacktests)

            try {
                const estimator_name =
                    backtests?.find(
                        (backtest) => backtest.id === +selectedBacktests[0]
                    )?.modelId || 'Model1'
                const estimator_name2 =
                    backtests?.find(
                        (backtest) => backtest.id === +selectedBacktests[1]
                    )?.modelId || 'Model2'
                const data = await getViewData(
                    +selectedBacktests[0],
                    +selectedBacktests[1],
                    estimator_name,
                    estimator_name2
                )
                props.setData(data)
            } catch (error) {
                console.error('Error running backtests:', error)
            }
        } else {
            console.warn('You must select exactly two backtests.')
        }
    }

    if (isPending) return <p>Loading backtests...</p>
    if (isError) {
        console.error('Error fetching backtests:', error)
        return <p>Error loading backtests.</p>
    }

    return (
        <div>
            <h2>Select Two Backtests</h2>
            <ul>
                {backtests?.map((backtest: any) => (
                    <li key={backtest.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedBacktests.includes(
                                    String(backtest.id)
                                )}
                                onChange={() =>
                                    toggleSelection(String(backtest.id))
                                }
                                disabled={
                                    selectedBacktests.length === 2 &&
                                    !selectedBacktests.includes(
                                        String(backtest.id)
                                    )
                                } // Disable other options if 2 are selected
                            />
                            {backtest.modelId}
                        </label>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleRun}
                disabled={selectedBacktests.length !== 2}
            >
                Show
            </button>
        </div>
    )
}
const getViewData = async (
    backtestId: number,
    backtestId2: number,
    estimator_name: string,
    estimator_name2: string
): Promise<EvaluationForSplitPoint[]> => {
    const quantiles = [0.05, 0.25, 0.5, 0.75, 0.95]
    try {
        // Fetch evaluation entries
        const data =
            await AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(
                backtestId,
                quantiles
            )
        const data2 =
            await AnalyticsService.getEvaluationEntriesAnalyticsEvaluationEntryGet(
                backtestId2,
                quantiles
            )

        let namedData = addModelName(data, estimator_name)
        const namedData2 = addModelName(data2, estimator_name2)
        namedData = namedData.concat(namedData2)

        // Fetch actual cases
        const response2 =
            await AnalyticsService.getActualCasesAnalyticsActualCasesBacktestIdGet(
                backtestId2
            )
        return evaluationResultToViewData(namedData, response2.data)
    } catch (error) {
        console.error('Error fetching HighCharts data:', error)
        throw error // Rethrow the error so the caller can handle it
    }
}

const BacktestViewer: React.FC = () => {
    const [data, setData] = useState<EvaluationForSplitPoint[]>()
    const res = data ? (
        <ComparisonDashboard
            data={data}
            splitPeriods={data.map((item) => item.splitPoint)}
        />
    ) : (
        <p>Loading...</p>
    )
    return (
        <div>
            <BacktestSelector setData={setData} />
            {res}
        </div>
    )
}

// Wrap the component in QueryClientProvider
const App: React.FC = () => (
    <QueryClientProvider client={queryClient}>
        <BacktestRunner />
        <BacktestViewer />
    </QueryClientProvider>
)

export default App
