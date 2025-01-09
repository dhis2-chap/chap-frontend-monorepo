


import React from 'react'
import { FullPredictionResponseExtended } from '../../../interfaces/Prediction'
import { GeoJson } from '../../../interfaces/GeoJson'
import { getUniqeOrgUnits, findOrgUnitName, getUniqePeriods, getUniqeQuantiles, numberDateToString } from "../../../utils/PredictionResponse";

import Highcharts from 'highcharts'
import { get } from 'http';

interface PredictionMapProps {
  data : FullPredictionResponseExtended
  geoJson? : GeoJson
}

export const PredictionMap = ({data, geoJson} : PredictionMapProps) => {

  console.log(data)

  return (
    <div>
      {getUniqePeriods(data.dataValues).map((ou : string) => (
        <>
        {/*Maps*/}
        </>
      
      ))}
    </div>
  )
}

