import React, { useEffect, useState } from 'react'
import styles from './NewDatasetForm.module.css'

import { DatasetLayer } from '../../interfaces/DataSetLayer'
import {
    Button,
    IconArrowRight24,
    IconDownload24,
    IconError24,
    InputField,
} from '@dhis2/ui'
import TimePeriodPicker from '../../../timeperiod-selector/components/TimePeriodInputField'
import TimePeriodeSelector from '../../../timeperiod-selector/components/TimePeriodPicker'
import OrgUnitSelector from '../../../orgunit-selector/OrgUnitSelector'
import DownloadAnalyticsData from '../../../send-chap-data/components/DownloadData/DownloadAnalyticsData'
import { DataList, DatasetCreate, ModelSpec } from '@dhis2-chap/chap-lib'
import { ErrorResponse } from '../../../send-chap-data/interfaces/ErrorResponse'
import saveAs from 'file-saver'
import { SendChapData } from '../../../send-chap-data/SendChapData'
import {
    IOrgUnitLevel,
    OrgUnit,
} from '../../../orgunit-selector/interfaces/orgUnit'
import SelectDataLine from './SelectDataLine/SelectDataLine'
import { Period } from '../../../timeperiod-selector/interfaces/Period'
import { ModelFeatureDataElementMap } from '../../../../interfaces/ModelFeatureDataElement'

interface NewDatasetFormProps {
    onDrawerSubmit: () => void
}

const NewDatasetForm = ({ onDrawerSubmit }: NewDatasetFormProps) => {
    const [dataLayers, setDataLayers] = useState<DatasetLayer[]>([
        { feature: '', origin: '', dataSource: '' },
    ])
    const [selectedOrgUnits, setSelectedOrgUnits] = useState<OrgUnit[]>([])
    const [selectedTimePeriodes, setSelectedTimePeriodes] = useState<Period[]>(
        []
    )
    const [orgUnitLevel, setOrgUnitLevel] = useState<IOrgUnitLevel | undefined>(
        undefined
    )
    const [datasetName, setDatasetName] = useState<string | undefined>('')

    return (
        <>
            <div className={styles.formWrapper}>
                <InputField
                    autoComplete=""
                    label="Dataset name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.value)}
                    helpText="Name your dataset"
                    placeholder="Malaria incidenc, climate for.. "
                />
                <SelectDataLine
                    setDataLayers={setDataLayers}
                    datasetLayers={dataLayers}
                />
                <TimePeriodeSelector setTimePeriods={setSelectedTimePeriodes} />
                <OrgUnitSelector
                    orgUnits={selectedOrgUnits}
                    setOrgUnits={setSelectedOrgUnits}
                    orgUnitLevel={orgUnitLevel}
                    setOrgUnitLevel={setOrgUnitLevel}
                />
                <SendChapData
                    onDrawerSubmit={onDrawerSubmit}
                    name={datasetName}
                    dataLayers={dataLayers}
                    onSendAction="new-dataset"
                    orgUnitLevel={orgUnitLevel}
                    selectedPeriodItems={selectedTimePeriodes}
                    selectedOrgUnits={selectedOrgUnits}
                />
            </div>
        </>
    )
}

export default NewDatasetForm
