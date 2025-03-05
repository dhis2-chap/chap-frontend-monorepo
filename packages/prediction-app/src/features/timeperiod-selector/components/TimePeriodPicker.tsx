import { Time } from 'highcharts'
import React, { useEffect, useState } from 'react'
import { PeriodTypeSelector } from './PeriodTypeSelector'
import TimePeriodInputField from './TimePeriodInputField'
import styles from './TimePeriodPicker.module.css'
import { toDHIS2PeriodeData } from '../utils/timePeriodUtils'
import generateFixedPeriods from "@dhis2/multi-calendar-dates"
import { Period } from '../interfaces/Period'

interface TimePeriodeSelectorProps {
  setTimePeriods : (timePeriods: Period[]) => void
}

const TimePeriodeSelector = ({setTimePeriods} : TimePeriodeSelectorProps) => {

  const [timePeriodeType, setTimePeriodType] = useState<"week" | "month" | "">("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const onChangeTimePeriodType = (e : "week" | "month" | "") => {
    setStartTime("")
    setEndTime("")
    setTimePeriodType(e)
  }

  useEffect(() => {
    //updates the timePeriode used in the analytics request later
    setTimePeriods(toDHIS2PeriodeData(startTime, endTime, timePeriodeType))
  }, [startTime, endTime])
  

  return (
    <div>
      <h3>Dataset period</h3>
      <div className={styles.timePeriodeSelector}>
        
        <PeriodTypeSelector value={timePeriodeType} onChange={onChangeTimePeriodType}/>
        <div className={styles.timePeriodeSelectorInputFields}>
          <div className={styles.timePeriodeSelectorInputFieldsChild}>
            <TimePeriodInputField periodeType={timePeriodeType} label={'Dateset start:'} name={''} onChange={setStartTime} />
          </div>
          <div className={styles.timePeriodeSelectorInputFieldsChild}>
            <TimePeriodInputField periodeType={timePeriodeType} label={'Dateset end:'} name={''}  onChange={setEndTime} />
          </div>
            
            
        </div>
      </div>
    </div>
  )
}

export default TimePeriodeSelector