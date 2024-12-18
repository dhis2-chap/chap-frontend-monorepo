
import HighchartsReact from "highcharts-react-official";
import Highcharts, { animate } from "highcharts";
import React from "react";
import { HighChartsData } from "../../../interfaces/Evaluation";

//import HighchartsMore from "highcharts/highcharts-more";

//HighchartsMore(Highcharts); // Enables the 'arearange' series type
function syncChartZoom(event: any): void {
    Highcharts.charts.forEach((chart: any) => {
        if (chart) {
            chart.xAxis[0].setExtremes(event.min, event.max);
        }
    }); 
}

interface ResultPlotProps {
    data: HighChartsData;
    modelName: string;
}

export const ResultPlot = ({data, modelName} : ResultPlotProps) => {
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={{
                title: {
                    text: ""
                },
                subtitle: {
                    text: (modelName ? 'Model: ' + modelName : ''),
                    align: 'left',
                },
                chart: {
                    zoomType: 'x'
                },
                xAxis: {
                    categories: data.periods, // Use periods as categories
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
                plotOptions : {
                    series : {
                        animation : {
                            duration : 0
                        }
                    }
                },
                series: [
                    {
                        name: 'Real Cases',
                        data: data.realValues,
                        zIndex: 4,
                        lineWidth: 2.5,
                        type: 'spline',
                        color: "#f68000", // Different color for real data
                        marker: {
                            enabled: false,
                            lineWidth: 2,
                            //fillColor: Highcharts.getOptions().colors[2]
                        }
                    },
                    {
                        name: 'Predicted Cases',
                        type: "line",
                        color: "#004bbd",
                        data: data.averages,
                        zIndex: 3,
                        opacity: 1,
                        lineWidth: 2.5,
                        marker: {
                            enabled: false
                        }
                    }, {
                        name: 'Quantiles',
                        data: data.ranges,
                        type: 'arearange',
                        lineWidth: 0,
                        color: "#c4dcf2",
                        fillOpacity: 1,
                        zIndex: 0,
                        marker: {
                            enabled: false
                        },
                    }, {
                        name: 'QuantilesMid',
                        data: data.midranges,
                        type: 'arearange',
                        lineWidth: 1,
                        color: "#9bbdff",
                        fillOpacity: 1,
                        zIndex: 1,
                        marker: {
                            enabled: false
                        },
                    }]
            } as Highcharts.Options}
        />
    );
}