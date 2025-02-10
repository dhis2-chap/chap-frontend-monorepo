import { EvaluationEntry } from '../httpfunctions'

export interface EvaluationEntryExtend extends EvaluationEntry {
    modelName?: string
}

export interface EvaluationForSplitPoint {
    evaluation: EvaluationPerOrgUnit[]
    splitPoint: string
}

export interface EvaluationPerOrgUnit {
    orgUnitName: string
    orgUnitId: string
    models: ModelData[]
}

export interface HighChartsData {
    periods: string[]
    ranges: number[][]
    averages: number[][]
    realValues?: number[]
    midranges?: number[][]
}

export interface ModelData {
    data: HighChartsData
    modelName: string
}
