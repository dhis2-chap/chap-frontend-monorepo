export interface JobPrediction {
    id: string
    status: string
    type: 'prediction' | 'job' | 'dataset' | 'evaluation'
    name: string
    created: Date

    datasetId?: number
    estimatorId?: string
    nPeriods?: number

    description?: string
    hostname?: string
}
