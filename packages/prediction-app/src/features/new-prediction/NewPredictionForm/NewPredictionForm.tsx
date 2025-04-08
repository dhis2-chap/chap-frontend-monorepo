import React, { useEffect, useState } from 'react'
import styles from './NewPredictionForm.module.css'
import { DatasetLayer } from '../../new-dataset/interfaces/DataSetLayer'
import {
    IOrgUnitLevel,
    OrgUnit,
} from '../../orgunit-selector/interfaces/orgUnit'
import { Period } from '../../timeperiod-selector/interfaces/Period'
import { Button, IconAdd24, IconCross24, InputField } from '@dhis2/ui'
import SelectDataLine from '../../new-dataset/components/NewDatasetForm/SelectDataLine/SelectDataLine'
import OrgUnitSelector from '../../orgunit-selector/OrgUnitSelector'
import { SendChapData } from '../../send-chap-data/SendChapData'
import TimePeriodeSelector from '../../timeperiod-selector/components/TimePeriodPicker'
import SelectModel from '../../select-model/SelectModel'
import { ModelSpec, ModelSpecRead } from '@dhis2-chap/chap-lib'

interface NewPredictionFormProps {
    onDrawerClose: () => void
    onDrawerSubmit: () => void
}

const NewPredictionForm = ({
    onDrawerClose,
    onDrawerSubmit,
}: NewPredictionFormProps) => {
    const [dataLayers, setDataLayers] = useState<DatasetLayer[]>([])

    const [selectedOrgUnits, setSelectedOrgUnits] = useState<OrgUnit[]>([])
    const [selectedTimePeriodes, setSelectedTimePeriodes] = useState<Period[]>(
        []
    )
    const [orgUnitLevel, setOrgUnitLevel] = useState<IOrgUnitLevel | undefined>(
        undefined
    )
    const [datasetName, setDatasetName] = useState<string | undefined>('')
    const [selecetedModel, setSelecetedModel] = useState<
        ModelSpecRead | undefined
    >(undefined)

    //logic for updating dataLayers when model is selected
    useEffect(() => {
        if (selecetedModel == undefined) return

        const newLayers = selecetedModel.covariates.map((co) => {
            return {
                feature: co.name,
                origin: '',
                dataSource: '',
            } as DatasetLayer
        })

        setDataLayers(newLayers)
    }, [selecetedModel])

    return (
        <>
            <div className={styles.newPredictionForm}>
                <div className={styles.newPredictionTitle}>
                    <h2>New prediction</h2>
                    <Button
                        icon={<IconCross24 />}
                        onClick={onDrawerClose}
                    ></Button>
                </div>
                <div className={styles.formWrapper}>
                    <InputField
                        autoComplete=""
                        label="Name of prediction"
                        value={datasetName}
                        onChange={(e) => setDatasetName(e.value)}
                        placeholder="Prediction for Northern province"
                    />
                    <SelectModel
                        selectedModel={selecetedModel}
                        setSelectedModel={setSelecetedModel}
                    />
                    <SelectDataLine
                        setDataLayers={setDataLayers}
                        datasetLayers={dataLayers}
                        predictMode={true}
                    />
                    <TimePeriodeSelector
                        setTimePeriods={setSelectedTimePeriodes}
                    />
                    <OrgUnitSelector
                        orgUnits={selectedOrgUnits}
                        setOrgUnits={setSelectedOrgUnits}
                        orgUnitLevel={orgUnitLevel}
                        setOrgUnitLevel={setOrgUnitLevel}
                    />
                    <SendChapData
                        onDrawerSubmit={onDrawerSubmit}
                        selectedModel={selecetedModel}
                        name={datasetName}
                        dataLayers={dataLayers}
                        onSendAction="predict"
                        orgUnitLevel={orgUnitLevel}
                        selectedPeriodItems={selectedTimePeriodes}
                        selectedOrgUnits={selectedOrgUnits}
                    />
                </div>
            </div>
        </>
    )
}

export default NewPredictionForm
