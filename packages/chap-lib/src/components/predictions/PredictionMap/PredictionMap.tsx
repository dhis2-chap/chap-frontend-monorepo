import React from 'react'
import { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import { FullPredictionResponseExtended } from '../../../interfaces/Prediction'
import { GeoJson } from '../../../interfaces/GeoJson'
import {
    getUniqeOrgUnits,
    findOrgUnitName,
    getUniqePeriods,
    getUniqeQuantiles,
    numberDateToString,
} from '../../../utils/PredictionResponse'
import MapItem from '../../maps/MapItem'
import Choropleth from '../../maps/Choropleth'
import Legend from '../../maps/Legend'
import Basemap from '../../maps/Basemap'
import { getEqualIntervals } from '../../maps/utils'
import useOrgUnits from '../../../hooks/useOrgUnits'
import styles from './PredictionMap.module.css'

interface PredictionMapProps {
    data: FullPredictionResponseExtended
    predictionTargetName: string
}

const colors = ['#FFFFD4', '#FED98E', '#FE9929', '#D95F0E', '#993404']

export const PredictionMap = ({
    data,
    predictionTargetName,
}: PredictionMapProps) => {
    // get all orgunits
    const orgUnitIds: any = getUniqeOrgUnits(data.dataValues)

    // load orgunit geoms
    const { orgUnits } = useOrgUnits(orgUnitIds)

    // get and classify periods
    const periods = getUniqePeriods(data.dataValues)
    const values = data.dataValues.map((d) => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const bins = getEqualIntervals(minValue, maxValue)

    return orgUnits ? (
        <div>
            <h3>Prediction Maps for {predictionTargetName}</h3>
            <div className={styles.predictionMapGroup}>
                {periods.map((period: string, index: number) => {
                    return (
                        <div className={styles.predictionMapCard} key={index}>
                            <h4>
                                &#x1F551; {i18n.t(numberDateToString(period))}
                            </h4>
                            <MapItem
                                key={period}
                                index={index}
                                count={periods.length}
                                syncId="prediction-map"
                            >
                                <Basemap />
                                <Choropleth
                                    period={period}
                                    prediction={data}
                                    geojson={orgUnits}
                                    bins={bins}
                                    colors={colors}
                                />
                            </MapItem>
                        </div>
                    )
                })}
            </div>
            <Legend
                title={'Median Prediction for ' + predictionTargetName}
                bins={bins}
                colors={colors}
            />
        </div>
    ) : null
}
