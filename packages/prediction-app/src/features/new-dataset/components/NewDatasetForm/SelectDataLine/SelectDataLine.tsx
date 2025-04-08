import {
    Button,
    IconAdd16,
    IconDelete16,
    IconDelete24,
    InputField,
    NoticeBox,
    SingleSelect,
    SingleSelectField,
    SingleSelectOption,
    SingleSelectProps,
} from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import styles from './SelectDataLine.module.css'
import { Datalayer, DatasetLayer } from '../../../interfaces/DataSetLayer'
import { AnalyticsService, DataSource, Feature } from '@dhis2-chap/chap-lib'
import { useDataQuery } from '@dhis2/app-runtime'
import SearchSelectField from '../../../../../components/prediction/SearchSelectField'

interface SelectDataLineProps {
    setDataLayers: (datasetLayer: DatasetLayer[]) => void
    datasetLayers: DatasetLayer[]
    predictMode?: boolean
}

///temporarily dummy data

const features: Feature[] = [
    {
        id: 'rainfall',
        name: 'Rainfall',
        description: 'The amount of rainfall in mm',
        optional: true,
    },
    {
        id: 'mean_temperature',
        name: 'Mean Temperature',
        description: 'The average temperature in degrees Celsius',
        optional: true,
    },
    {
        id: 'population',
        name: 'Population',
        description: 'The population of the area',
        optional: false,
    },

    { name: 'Disease cases', id: 'disease_cases', description: 'Feature 5' },
]

const SelectDataLine = ({
    datasetLayers,
    setDataLayers,
    predictMode,
}: SelectDataLineProps) => {
    const [chapSources, setChapSources] = useState<DataSource[]>([])

    const fetchChapSources = async () => {
        await AnalyticsService.getDataSourcesAnalyticsDataSourcesGet().then(
            (response) => {
                setChapSources(response)
            }
        )
    }

    useEffect(() => {
        fetchChapSources()
    }, [])

    const onChangeClickSelectField = (
        e: SingleSelectProps,
        type: 'feature' | 'origin' | 'dataSource',
        index: number
    ) => {
        let newDataSetLayer = [...datasetLayers]
        if (e.selected == undefined) return
        //when type is origin, simitainously wipe Data source
        if (type === 'origin') {
            newDataSetLayer[index]['dataSource'] = ''
        }
        if (type === 'feature') {
            newDataSetLayer[index]['dataSource'] = ''
        }

        ;(newDataSetLayer[index] as any)[type] = e.selected
        setDataLayers(newDataSetLayer)
    }

    const addLayer = () => {
        let newDataSetLayer = [...datasetLayers]
        newDataSetLayer.push({ feature: '', origin: '', dataSource: '' })
        setDataLayers(newDataSetLayer)
    }

    const removeLayer = (index: number) => {
        let newDataSetLayer = [...datasetLayers]
        newDataSetLayer.splice(index, 1)
        setDataLayers(newDataSetLayer)
    }

    const getNonSelectedFeatures = (index: number) => {
        let nonSelectedFeatures: Feature[] = []
        features.forEach((f) => {
            let isSelected = false
            datasetLayers.forEach((dl, i) => {
                if (dl.feature == f.id && i !== index) isSelected = true
            })
            if (!isSelected) nonSelectedFeatures.push(f)
        })
        return nonSelectedFeatures
    }

    //temp create e method, converting search field output to match format used in this file
    const onChangeSearchSelectField = (dataItemId: string, index: number) => {
        //find index
        const selected = { selected: dataItemId }
        onChangeClickSelectField(selected, 'dataSource', index)
    }

    return (
        <div>
            <h3>Data layers</h3>
            <NoticeBox title="Origin">
                The modeling app supports direct retrieval of the ERA5-Land data
                without the need of the DHIS2 Climate App. If you are using an
                ERA5-Land source, we recommend utilizing this direct retrieval
                method by selecting the "ERA5-Land" origin. For local data
                sources or the CHIRPS dataset, please select DHIS2 as the
                origin, and then choose the specific data element where the data
                has been imported.
            </NoticeBox>

            <div className={styles.selectDataLineWrapper}>
                {datasetLayers.map((dataLayer, index) => (
                    <div key={index}>
                        <div className={styles.dataLineWrapper}>
                            {predictMode ? (
                                <div className={styles.predictLabel}>
                                    {
                                        features.filter(
                                            (f) => f.id === dataLayer.feature
                                        )[0]?.name
                                    }
                                </div>
                            ) : (
                                <div className={styles.selectField}>
                                    <SingleSelectField
                                        label="Feature"
                                        onChange={(e) =>
                                            onChangeClickSelectField(
                                                e,
                                                'feature',
                                                index
                                            )
                                        }
                                        selected={dataLayer.feature}
                                    >
                                        {getNonSelectedFeatures(index).map(
                                            (f) => (
                                                <SingleSelectOption
                                                    key={f.id}
                                                    label={f.name}
                                                    value={f.id}
                                                />
                                            )
                                        )}
                                    </SingleSelectField>
                                </div>
                            )}
                            <div className={styles.selectField}>
                                <SingleSelectField
                                    disabled={dataLayer.feature === ''}
                                    label="Origin"
                                    onChange={(e) =>
                                        onChangeClickSelectField(
                                            e,
                                            'origin',
                                            index
                                        )
                                    }
                                    selected={dataLayer.origin}
                                >
                                    {chapSources.some((source) =>
                                        source.supportedFeatures.includes(
                                            dataLayer.feature
                                        )
                                    ) && (
                                        <SingleSelectOption
                                            label={'ERA5-Land'}
                                            value={'CHAP'}
                                        />
                                    )}
                                    <SingleSelectOption
                                        label={'DHIS2'}
                                        value={'dataItem'}
                                    />
                                </SingleSelectField>
                            </div>
                            <div className={styles.selectField}>
                                {(dataLayer.origin === 'CHAP' ||
                                    dataLayer.origin === '') && (
                                    <SingleSelectField
                                        disabled={dataLayer.origin === ''}
                                        label="Data name source"
                                        onChange={(e) =>
                                            onChangeClickSelectField(
                                                e,
                                                'dataSource',
                                                index
                                            )
                                        }
                                        selected={dataLayer.dataSource}
                                    >
                                        {chapSources.map(
                                            (de: DataSource) =>
                                                //if feature is the same type as the Feature selected
                                                de.supportedFeatures.includes(
                                                    dataLayer.feature
                                                ) && (
                                                    <SingleSelectOption
                                                        key={de.name}
                                                        label={`${de.dataset.toUpperCase()} - ${
                                                            de.displayName
                                                        }`}
                                                        value={de.dataset}
                                                    />
                                                )
                                        )}
                                    </SingleSelectField>
                                )}
                                {dataLayer.origin === 'dataItem' && (
                                    <SearchSelectField
                                        feature={{
                                            name: features.filter(
                                                (f) =>
                                                    f.id === dataLayer.feature
                                            )[0].name,
                                            id: dataLayer.feature,
                                            description: '',
                                        }}
                                        onChangeSearchSelectField={(
                                            e,
                                            dataItemId
                                        ) =>
                                            onChangeSearchSelectField(
                                                dataItemId,
                                                index
                                            )
                                        }
                                    />
                                )}
                            </div>
                            {!predictMode && (
                                <div>
                                    <Button
                                        onClick={() => removeLayer(index)}
                                        destructive
                                        large
                                        icon={<IconDelete24 />}
                                    ></Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {!predictMode && (
                    <div className={styles.buttonRight}>
                        <Button onClick={addLayer} icon={<IconAdd16 />}>
                            Add layer
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SelectDataLine
