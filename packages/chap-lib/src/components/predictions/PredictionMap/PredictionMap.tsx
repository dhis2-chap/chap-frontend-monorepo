


import React from 'react'
import { FullPredictionResponseExtended } from '../../../interfaces/Prediction'
import { GeoJson } from '../../../interfaces/GeoJson'
import Highcharts from 'highcharts'

interface PredictionMapProps {
  data : FullPredictionResponseExtended
  geoJson : GeoJson
}

const PredictionMap = ({data, geoJson} : PredictionMapProps) => {


  return (
    <div>
      
    </div>
  )
}

export default PredictionMap