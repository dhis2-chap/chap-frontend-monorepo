import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EvaluationFormValues } from "./useFormController"
import { AnalyticsService, FeatureCollectionModel, ObservationBase, MakeBacktestWithDataRequest } from "@dhis2-chap/chap-lib"
import { useDataEngine } from "@dhis2/app-runtime"
import { PERIOD_TYPES } from "../Sections/PeriodSelector"
import { toDHIS2PeriodData } from "../../../features/timeperiod-selector/utils/timePeriodUtils"
import { useNavigate } from "react-router-dom"

const N_SPLITS = 10
const N_PERIODS = 3
const STRIDE = 1

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

export const useCreateNewBacktest = () => {
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate: createNewBacktest } = useMutation({
        mutationFn: async (formData: EvaluationFormValues) => {
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
            
            
            debugger;
            const orgUnitIds: string[] = analyticsResponse.response.metaData.dimensions.ou;
            
            const orgUnitResponse = await dataEngine.query(
                ORG_UNITS_QUERY(orgUnitIds)
            ) as OrgUnitResponse

                
            
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

            debugger;
            
            // Construct the backtest request
            const backtestRequest: MakeBacktestWithDataRequest = {
                name: formData.name,
                geojson: filteredGeoJson,
                providedData: observations,
                dataToBeFetched: [],
                modelId: formData.name,
                nPeriods: N_PERIODS,
                nSplits: N_SPLITS,
                stride: STRIDE,
            }
            
            // Create the backtest
            return AnalyticsService.createBacktestWithDataAnalyticsCreateBacktestWithDataPost(backtestRequest)
        },
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            navigate('/jobs');
        },
    })

    return {
        createNewBacktest,
    }
}