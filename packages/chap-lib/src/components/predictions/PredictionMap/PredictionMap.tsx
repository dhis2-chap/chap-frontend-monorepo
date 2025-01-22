


import React from 'react'
import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import { FullPredictionResponseExtended } from '../../../interfaces/Prediction'
import { GeoJson } from '../../../interfaces/GeoJson'
import { getUniqeOrgUnits, findOrgUnitName, getUniqePeriods, getUniqeQuantiles, numberDateToString } from "../../../utils/PredictionResponse";
import MapItem from '../../maps/MapItem'
import Choropleth from '../../maps/Choropleth'
import Legend from '../../maps/Legend'
import Basemap from '../../maps/Basemap'
import OrgUnitGeoms from '../../maps/OrgUnitGeoms'
import {getEqualIntervals} from '../../maps/utils'

interface PredictionMapProps {
  data : FullPredictionResponseExtended
}

const colors = ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"];

export const PredictionMap = ({data} : PredictionMapProps) => {

  console.log('init PredictionMap')
  console.log(data)

  // get all orgunits
  const orgUnits : any = getUniqeOrgUnits(data.dataValues);
  console.log(orgUnits)

  // load orgunit geoms
  // TODO move to useEffect
  const [geoJson, setGeoJson] = useState({});
  OrgUnitGeoms({orgUnits:orgUnits, setResults:setGeoJson});

  // add pred values to geoms once loaded
  /*
  useEffect(() => {
    if (geoJson) {

    }
  });
  */

  // get and classify periods
  const periods = getUniqePeriods(data.dataValues);
  const values = data.dataValues.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const bins = getEqualIntervals(minValue, maxValue);

  return geoJson ? (
    <div>
      <h3>Prediction Maps</h3>
      <div style={{display:'flex'}}>
        {periods.map((period : string, index : number) => {
          return (
            <div>
              <h4>{i18n.t(numberDateToString(period))}</h4>
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
                  geojson={geoJson}
                  bins={bins}
                  colors={colors}
                />
              </MapItem>
            </div>
            )
          }
        )}
      </div>
      <Legend bins={bins} colors={colors}/>
    </div>
  ) : null
}

