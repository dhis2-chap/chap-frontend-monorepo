import { useDataQuery } from '@dhis2/app-runtime'
import { ModelFeatureDataElementMap } from '../interfaces/ModelFeatureDataElement'

const ANALYTICS_QUERY = ({
    dataElements = [],
    periodes = [],
    orgUnit = {},
} = {}) => {
    return {
        request: {
            resource: 'analytics',
            params: {
                paging: false,
                dimension: `dx:${dataElements.join(
                    ';'
                )},ou:${orgUnit},pe:${periodes.join(';')}`,
            },
        },
    }
}

const convertDhis2AnlyticsToChap = (
    data: [[string, string, string, string]],
    dataElementId: string
): any[] => {
    return data
        .filter((x) => x[0] === dataElementId)
        .map((row) => {
            return {
                ou: row[1],
                pe: row[2],
                value: parseFloat(row[3]),
            }
        })
}

const useAnalyticRequest = (
    modelSpesificSelectedDataElements: ModelFeatureDataElementMap,
    periodes: any,
    orgUnit: any
) => {
    const modelSpesificSelectedDataElementsArray = Array.from(
        modelSpesificSelectedDataElements
    )

    //filter out every DHIS2 dataElement ids
    const dataElements = modelSpesificSelectedDataElementsArray.map(
        ([key, value]) => value.selectedDataElementId
    ) as any

    const { loading, error, data } = useDataQuery(
        ANALYTICS_QUERY({ dataElements, periodes, orgUnit })
    )

    if (!loading && data && !error) {
        //divide the respons into the features (for instance population, diseases, etc)
        const featureRequest = modelSpesificSelectedDataElementsArray.map(
            ([key, value]) => {
                return {
                    featureId: key,
                    dhis2Id: value.selectedDataElementId,
                    data: convertDhis2AnlyticsToChap(
                        (data?.request as any).rows,
                        value.selectedDataElementId
                    ),
                }
            }
        )

        return {
            data: featureRequest,
            error,
            loading,
        }
    }

    return {
        data,
        error,
        loading,
    }
}

export default useAnalyticRequest
