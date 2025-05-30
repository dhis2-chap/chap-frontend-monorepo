import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EvaluationFormValues } from "./useFormController"
import { AnalyticsService, FeatureCollectionModel, ObservationBase, MakeBacktestWithDataRequest, ModelSpecRead, ApiError } from "@dhis2-chap/chap-lib"
import { useDataEngine } from "@dhis2/app-runtime"
import { PERIOD_TYPES } from "../Sections/PeriodSelector"
import { toDHIS2PeriodData } from "../../../features/timeperiod-selector/utils/timePeriodUtils"
import { useNavigate } from "react-router-dom"

const N_SPLITS = 10
const STRIDE = 1

const N_PERIODS = {
    [PERIOD_TYPES.MONTH]: 3,
    [PERIOD_TYPES.WEEK]: 12,
}

const calculatePeriods = (periodType: keyof typeof PERIOD_TYPES, fromDate: string, toDate: string): string[] => {
    const selectedPeriodType = PERIOD_TYPES[periodType]
    if (!selectedPeriodType) return []

    const dateRange = toDHIS2PeriodData(fromDate, toDate, selectedPeriodType.toLowerCase())
    return dateRange.map((period) => period.id)
}

type AnalyticsResponse = {
    response: {
        metaData: {
            dimensions: { ou: string[] }
        },
        rows: [string, string, string, string][]
    }
}

const ANALYTICS_QUERY = (dataElements: string[], periods: string[], orgUnits: string[]) => ({
    response: {
        resource: 'analytics',
        params: {
            paging: false,
            dimension: `dx:${dataElements.join(';')},ou:${orgUnits.join(';')},pe:${periods.join(';')}`,
        },
    },
})

type OrgUnitResponse = {
    geojson: {
        organisationUnits: {
            id: string,
            geometry: {
                type: string,
                coordinates: number[][]
            },
            parent: {
                id: string
            },
            level: number
        }[]
    }
}

const ORG_UNITS_QUERY = (orgUnitIds: string[]) => ({
    geojson: {
        resource: "organisationUnits",
        params: {
            filter: `id:in:[${orgUnitIds.join(',')}]`,
            fields: 'id,geometry,parent[id],level',
            paging: false,
        },
    },
})

type Props = {
    onSuccess?: () => void
    onError?: (error: ApiError) => void
}

export const useCreateNewBacktest = ({
    onSuccess,
    onError,
}: Props = {}) => {
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { 
        mutate: createNewBacktest,
        isLoading,
        error,
    } = useMutation({
        mutationFn: async (formData: EvaluationFormValues) => {
            const model = queryClient.getQueryData<ModelSpecRead[]>(['models'])
            ?.find(model => model.id === Number(formData.modelId))

            if (!model) {
                throw new Error('Model not found')
            }

            const periods = calculatePeriods(
                formData.periodType, 
                formData.fromDate, 
                formData.toDate
            )

            const dataElements = [
                ...formData.covariateMappings.map(mapping => mapping.dataItemId),
                formData.targetMapping.dataItemId
            ]
            
            // Fetch analytics data from DHIS2
            const analyticsResponse = await dataEngine.query(
                ANALYTICS_QUERY(
                    dataElements,
                    periods,
                    formData.orgUnits.map(ou => ou.id)
                )
            ) as AnalyticsResponse
            
            
            const orgUnitIds: string[] = analyticsResponse.response.metaData.dimensions.ou;
            
            const orgUnitResponse = await dataEngine.query(
                ORG_UNITS_QUERY(orgUnitIds)
            ) as OrgUnitResponse

            // orgUnitResponse.geojson.organisationUnits.forEach((ou) => {
            //     if (!ou.geometry) {
            //         console.error(`Org unit ${ou.id} has no geometry`)
            //         throw new Error(`Org unit ${ou.id} has no geometry`)
            //     }
            // })
            
            const convertDhis2AnalyticsToChap = (data: [string, string, string, string][]): ObservationBase[] => {
                return data.map((row) => {
                    const dataItemId = row[0]
                    const dataLayer = formData.targetMapping.dataItemId === dataItemId ? formData.targetMapping : formData.covariateMappings.find(mapping => mapping.dataItemId === dataItemId)

                    if (!dataLayer) {
                        throw new Error(`Data layer not found for data item id: ${dataItemId}`)
                    }
                    
                    return {
                        featureName: dataLayer.covariateName,
                        orgUnit: row[1],
                        period: row[2],
                        value: parseFloat(row[3]),
                    }
                })
            }
            
            const observations = convertDhis2AnalyticsToChap(analyticsResponse.response.rows)
            
            const filteredGeoJson: FeatureCollectionModel = {
                type: 'FeatureCollection',
                features: orgUnitResponse.geojson.organisationUnits.map(ou => ({
                    id: ou.id,
                    type: 'Feature',
                    geometry: ou.geometry,
                    properties: {
                        id: ou.id,
                        parent: ou.parent.id,
                        parentGraph: ou.parent.id,
                        level: ou.level,
                    }
                })),
            }

            
            // Construct the backtest request
            const backtestRequest: MakeBacktestWithDataRequest = {
                name: formData.name,
                geojson: filteredGeoJson,
                providedData: observations,
                dataToBeFetched: [],
                modelId: model.name,
                nPeriods: N_PERIODS[formData.periodType],
                nSplits: N_SPLITS,
                stride: STRIDE,
            }
            
            // Create the backtest
            return AnalyticsService.createBacktestWithDataAnalyticsCreateBacktestWithDataPost(backtestRequest)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            onSuccess?.()
            navigate('/jobs');
        },
        onError: (error) => {
            onError?.(error as ApiError)
        }
    })

    return {
        createNewBacktest,
        isSubmitting: isLoading,
        error,
    }
}