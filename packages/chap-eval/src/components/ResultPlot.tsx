// @ts-ignore

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";
import {HighChartsData} from "../interfaces/HighChartsData";
import HighchartsMore from "highcharts/highcharts-more";

HighchartsMore(Highcharts); // Enables the 'arearange' series type
function syncChartZoom(event: any): void {
    Highcharts.charts.forEach((chart: any) => {
        if (chart) {
            chart.xAxis[0].setExtremes(event.min, event.max);
        }
    }); // @ts-ignore
}

export const ResultPlot = (props: { orgUnit: string, data: HighChartsData, modelName: string}) => {
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={{
                title: {
                    text: ""
                },
                subtitle: {
                    text: 'Model: ' + props.modelName || 'Unknown',
                    align: 'left'
                },
                chart: {
                    zoomType: 'x'
                },
                xAxis: {
                    categories: props.data.periods, // Use periods as categories
                    events: {
                        afterSetExtremes: syncChartZoom
                    },
                    title: {
                        text: 'Period'
                    },
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    min: 0
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueSuffix: ' cases'
                },
                series: [
                    {
                        name: 'Real Cases',
                        data: props.data.realValues,
                        zIndex: 4,
                        lineWidth: 2.5,
                        type: 'spline',
                        color: "#f68000", // Different color for real data
                        marker: {
                            enabled: false,
                            lineWidth: 2,
                            fillColor: Highcharts.getOptions().colors[2]
                        }
                    },
                    {
                        name: 'Predicted Cases',
                        type: "line",
                        color: "#004bbd",
                        data: props.data.averages,
                        zIndex: 3,
                        opacity: 1,
                        lineWidth: 2.5,
                        marker: {
                            enabled: false
                        }
                    }, {
                        name: 'Quantiles',
                        data: props.data.ranges,
                        type: 'arearange',
                        lineWidth: 0,
                        linkedTo: ':previous',
                        color: "#c4dcf2",
                        fillOpacity: 1,
                        zIndex: 0,
                        marker: {
                            enabled: false
                        },
                    }, {
                        name: 'QuantilesMid',
                        data: props.data.midranges,
                        type: 'arearange',
                        lineWidth: 1,
                        linkedTo: ':previous',
                        color: "#9bbdff",
                        fillOpacity: 1,
                        zIndex: 1,
                        marker: {
                            enabled: false
                        },
                    }]
            }}
        />
    );
}