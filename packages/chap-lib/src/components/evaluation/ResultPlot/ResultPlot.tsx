import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React from 'react'
import { HighChartsData } from '../../../interfaces/Evaluation'
import { getPeriodNameFromId } from '../../../utils/Time'
import enableOfflineExporting from 'highcharts/modules/offline-exporting'


enableOfflineExporting(Highcharts)

function syncChartZoom(event: any): void {
    Highcharts.charts.forEach((chart: any) => {
        if (chart) {
            chart.xAxis[0].setExtremes(event.min, event.max)
        }
    })
}

interface ResultPlotProps {
    data: HighChartsData
    modelName: string
    nameLabel?: string
    syncZoom: boolean
}

const getSeries = (data: any) => {
    return [
        {
            name: 'Real Cases',
            data: data.realValues,
            zIndex: 4,
            lineWidth: 2.5,
            type: 'line',
            color: '#f68000', // Different color for real data
            marker: {
                enabled: false,
                lineWidth: 2,
                //fillColor: Highcharts.getOptions().colors[2]
            },
        },
        {
            name: 'Predicted Cases',
            type: 'line',
            color: '#004bbd',
            data: data.averages.slice(),
            zIndex: 3,
            opacity: 1,
            lineWidth: 2.5,
            marker: {
                enabled: false,
            },
        },
        {
            name: 'Quantiles Outer',
            data: data.ranges.slice(),
            type: 'arearange',
            lineWidth: 0,
            color: '#c4dcf2',
            fillOpacity: 1,
            zIndex: 0,
            marker: {
                enabled: false,
            },
        },
        {
            name: 'Quantiles Middle',
            data: data.midranges.slice(),
            type: 'arearange',
            lineWidth: 1,
            color: '#9bbdff',
            fillOpacity: 1,
            zIndex: 1,
            marker: {
                enabled: false,
            },
        },
    ]
}

type GetOptionParams = {
    data: any
    modelName: string
    syncZoom: boolean
    nameLabel?: string
}

const getOptions = ({
    data,
    modelName,
    syncZoom,
    nameLabel,
}: GetOptionParams) => {
    const subtitleText =
        nameLabel && modelName
            ? `${nameLabel}: ${modelName}`
            : modelName
            ? `Model: ${modelName}`
            : ''
    return {
        title: {
            text: '',
        },
        subtitle: {
            text: subtitleText,
            align: 'left',
        },
        chart: {
            zoomType: 'x',
        },
        xAxis: {
            categories: data.periods, // Use periods as categories
            labels: {
                enabled: true,
                formatter: function (
                    this: Highcharts.AxisLabelsFormatterContextObject
                ): string {
                    return getPeriodNameFromId(this.value.toString())
                },
                style: {
                    fontSize: '0.9rem',
                },
            },
            events: syncZoom && {
                afterSetExtremes: syncChartZoom,
            },
            title: {
                text: 'Period',
            },
        },
        yAxis: {
            title: {
                text: null,
            },
            min: 0,
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: ' cases',
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 0,
                },
            },
        },
        series: getSeries(data),
        exporting: {
            fallbackToExportServer: false,
        },
    }
}

export const ResultPlot = ({
    data,
    modelName,
    syncZoom,
    nameLabel,
}: ResultPlotProps) => {
    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={getOptions({ data, modelName, syncZoom, nameLabel })}
            />
        </>
    )
}
