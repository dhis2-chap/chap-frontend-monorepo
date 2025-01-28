import React, { Dispatch, SetStateAction } from 'react'
import { Feature } from '@dhis2-chap/chap-lib'
import {
    Help,
    SingleSelect,
    SingleSelectField,
    SingleSelectFieldProps,
    SingleSelectOption,
} from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import styles from './styles/ModelFeature.module.css'
import i18n from '@dhis2/d2-i18n'
import {
    ModelFeatureDataElement,
    ModelFeatureDataElementMap,
} from '../../interfaces/ModelFeatureDataElement'
import SwitchClimateSources from '../climateSource/SwitchClimateSources'
import SearchSelectField from './SearchSelectField'

interface ModelFeaturesProps {
    features: Feature[] | undefined
    setModelSpesificSelectedDataElements: (
        request: ModelFeatureDataElementMap
    ) => void
    modelSpesificSelectedDataElements: ModelFeatureDataElementMap
    setRenderOptionalField: Dispatch<SetStateAction<boolean | undefined>>
    renderOptionalField: boolean | undefined
}

const dataElementQuery = {
    results: {
        resource: 'dataElements',
        params: {
            paging: false,
            filter: 'domainType:eq:AGGREGATE',
            fields: 'id,code,displayName',
        },
    },
}

const ModelFeatures = ({
    features,
    modelSpesificSelectedDataElements,
    setModelSpesificSelectedDataElements,
    setRenderOptionalField,
    renderOptionalField,
}: ModelFeaturesProps) => {
    const { loading, error, data } = useDataQuery(dataElementQuery)
    const dataElements = (data?.results as any)?.dataElements

    if (!features) {
        return <></>
    }

    const onChangeOptionalField = (e: any) => {
        //wipe existing values for optional fields
        if (!e) {
            setModelSpesificSelectedDataElements(
                new Map(
                    [...modelSpesificSelectedDataElements].filter(
                        ([k, v]) => !v.optional
                    )
                )
            )
        }
        setRenderOptionalField(e)
    }

    const onChangeSearchSelectField = (feature: Feature, v: string) => {
        //find name of dataElement
        const dataElement = dataElements?.find(
            (d: any) => d.id === v
        )?.displayName

        const feature_with_selected_data_elements: ModelFeatureDataElement = {
            selectedDataElementId: v,
            selectedDataElementName: dataElement,
            optional: feature.optional ?? false,
        }
        setModelSpesificSelectedDataElements(
            new Map(
                modelSpesificSelectedDataElements.set(
                    feature.id,
                    feature_with_selected_data_elements
                )
            )
        )
    }

    return (
        <div>
            <h3>Target data</h3>
            {features
                .filter((m) => m.optional == false)
                .map((f: Feature) => (
                    <div key={f.id} className={styles.selectField}>
                        <SearchSelectField
                            feature={f}
                            onChangeSearchSelectField={
                                onChangeSearchSelectField
                            }
                        />
                    </div>
                ))}

            <h3>Climate data</h3>
            <SwitchClimateSources
                setRenderOptionalField={onChangeOptionalField}
                renderOptionalField={renderOptionalField}
            />

            {renderOptionalField && (
                <div className={styles.warnAboutClimateData}>
                    <b>NB!</b> Ensure you have available climate data for all
                    the DHIS2 periods in the selected training period.
                </div>
            )}

            {renderOptionalField &&
                features
                    .filter((m) => m.optional == true)
                    .map((f: Feature) => (
                        <div key={f.id} className={styles.selectField}>
                            <SearchSelectField
                                feature={f}
                                onChangeSearchSelectField={
                                    onChangeSearchSelectField
                                }
                            />
                        </div>
                    ))}
        </div>
    )
}

export default ModelFeatures
