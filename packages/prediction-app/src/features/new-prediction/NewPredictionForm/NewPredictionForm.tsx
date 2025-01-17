
import React, { useEffect, useState } from 'react'
import styles from './NewPredictionForm.module.css'
import { DatasetLayer } from '../../new-dataset/interfaces/DataSetLayer';
import { IOrgUnitLevel, OrgUnit } from '../../orgunit-selector/interfaces/orgUnit';
import { Period } from '../../timeperiod-selector/interfaces/Period';
import { InputField } from '@dhis2/ui';
import SelectDataLine from '../../new-dataset/components/NewDatasetForm/SelectDataLine/SelectDataLine';
import OrgUnitSelector from '../../orgunit-selector/OrgUnitSelector';
import { SendChapData } from '../../send-chap-data/SendChapData';
import TimePeriodeSelector from '../../timeperiod-selector/components/TimePeriodPicker';


interface NewPredictionFormProps {

}

const NewPredictionForm = () => {

  const [dataLayers, setDataLayers] = useState<DatasetLayer[]>([
    {feature: "rainfall", origin: "", dataSource: ""},
    {feature: "max_temp", origin: "", dataSource: ""},
    {feature: "disease_cases", origin: "", dataSource: ""}
  ])
  const [selectedOrgUnits, setSelectedOrgUnits] = useState<OrgUnit[]>([]);
  const [selectedTimePeriodes, setSelectedTimePeriodes] = useState<Period[]>([]);
  const [orgUnitLevel, setOrgUnitLevel] = useState<IOrgUnitLevel | undefined>(undefined)
  const [datasetName, setDatasetName] = useState<string | undefined>("")
    
  return (
    <>
      <div className={styles.formWrapper}>
        <InputField autoComplete="" label='Name of prediction' value={datasetName} onChange={(e) => setDatasetName(e.value)} placeholder='Malaria incidenc, climate for.. '/>
        <SelectDataLine setDataLayers={setDataLayers} datasetLayers={dataLayers} predictMode={true}/>
        <TimePeriodeSelector setTimePeriods={setSelectedTimePeriodes} />
        <OrgUnitSelector orgUnits={selectedOrgUnits} setOrgUnits={setSelectedOrgUnits} orgUnitLevel={orgUnitLevel} setOrgUnitLevel={setOrgUnitLevel} />
        <SendChapData datasetName={datasetName} dataLayers={dataLayers} onSendAction='new-dataset' orgUnitLevel={orgUnitLevel} selectedPeriodItems={selectedTimePeriodes} selectedOrgUnits={selectedOrgUnits} />
      </div>
    </>
  )
}

export default NewPredictionForm