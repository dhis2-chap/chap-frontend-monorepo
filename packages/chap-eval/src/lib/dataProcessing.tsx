import {
    EvaluationForSplitPoint,
    HighChartsData,
    EvaluationEntryExtend,
    createHighChartsData,
    joinRealAndPredictedData,
} from '@dhis2-chap/chap-lib'
import { DataElement, EvaluationEntry } from '@dhis2-chap/chap-lib'

export function translateToDHIS2(data: any): DataElement {
    return { ou: data.region_id, pe: data.period_id, value: data.value }
}

function groupByTwoKeys<T>(
    array: T[],
    keyFunc1: (item: T) => string,
    keyFunc2: (item: T) => string
): { [key1: string]: { [key2: string]: T[] } } {
    return array.reduce((result, currentItem) => {
        const key1 = keyFunc1(currentItem)
        const key2 = keyFunc2(currentItem)

        // Initialize the first-level grouping if it doesn't exist
        if (!result[key1]) {
            result[key1] = {}
        }

        // Initialize the second-level grouping if it doesn't exist
        if (!result[key1][key2]) {
            result[key1][key2] = []
        }

        // Push the current item into the correct group
        result[key1][key2].push(currentItem)

        return result
    }, {} as { [key1: string]: { [key2: string]: T[] } })
}

export const addModelName = (
    data: EvaluationEntry[],
    modelName: string
): EvaluationEntryExtend[] => {
    return data.map((item) => {
        return { ...item, modelName }
    })
}

export const processDataValues = (
    data: EvaluationEntry[],
    realValues: DataElement[]
): EvaluationForSplitPoint[] => {
    const quantiles = Array.from(
        new Set(data.map((item) => item.quantile))
    ).sort()
    const lowQuantile = quantiles[0]
    const midLowQuantile = quantiles[1]
    const midHighQuantile = quantiles[quantiles.length - 2]
    const highQuantile = quantiles[quantiles.length - 1]
    console.log(quantiles)
    const quantileFunc = (item: EvaluationEntry) => {
        if (item.quantile === lowQuantile) {
            return 'quantile_low'
        } else if (item.quantile === highQuantile) {
            return 'quantile_high'
        } else if (item.quantile === 0.5) {
            return 'median'
        } else if (item.quantile === midLowQuantile) {
            return 'quantile_mid_low'
        } else if (item.quantile === midHighQuantile) {
            return 'quantile_mid_high'
        } else {
            return 'unknown'
        }
    }
    //const groupedData = groupBy(data, item => item.orgUnit.concat(item.splitPeriod));
    const doubleGroupedData = groupByTwoKeys(
        data,
        (item) => item.splitPeriod,
        (item) => item.orgUnit
    )
    // Create a mapping of orgUnits to their respective chart data
    const orgUnitsProcessedData: Record<
        string,
        Record<string, HighChartsData>
    > = {}
    Object.keys(doubleGroupedData).forEach((splitPeriod) => {
        const splitProcessedData: Record<string, HighChartsData> = {}
        Object.keys(doubleGroupedData[splitPeriod]).forEach((orgUnit) => {
            const groupedDatum = doubleGroupedData[splitPeriod][orgUnit]
            const dataElement = createHighChartsData(groupedDatum, quantileFunc)
            splitProcessedData[orgUnit] = joinRealAndPredictedData(
                dataElement,
                realValues.filter((item) => item.ou === orgUnit)
            )
        })
        orgUnitsProcessedData[splitPeriod] = splitProcessedData
    })

    return orgUnitsProcessedData as any
}
