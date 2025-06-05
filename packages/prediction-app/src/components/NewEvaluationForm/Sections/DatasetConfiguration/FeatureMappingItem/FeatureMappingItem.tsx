import React from 'react'
import { FeatureType } from '@dhis2-chap/chap-lib'
import SearchSelectField from '../../../../../features/search-dataitem/SearchSelectField'
import styles from './FeatureMappingItem.module.css'

type Props = {
    feature: FeatureType
    onMapping: (featureName: string, dataItemId: string, dataItemDisplayName: string) => void
    existingMapping?: {
        id: string
        displayName: string
        dimensionItemType: string | null | undefined
    }
}

export const FeatureMappingItem = ({ feature, onMapping, existingMapping }: Props) => {
    const createFeature = (feature: FeatureType) => ({
        id: feature.name || feature.displayName,
        name: feature.displayName,
        displayName: feature.displayName,
        description: feature.description,
    })

    const shouldShowDescription = (feature: FeatureType) => {
        return feature.description
            && feature.description.toLowerCase() !== (feature.displayName ?? feature.name).toLowerCase()
    }

    return (
        <div className={styles.mappingItem}>
            <SearchSelectField
                feature={createFeature(feature)}
                onChangeSearchSelectField={(_, dataItemId, dataItemDisplayName, dimensionItemType) => {
                    onMapping(
                        feature.name || feature.displayName,
                        dataItemId,
                        dataItemDisplayName,
                        feature.dimensionItemType
                    )
                }}
                defaultValue={existingMapping}
            />
            {shouldShowDescription(feature) && (
                <p className={styles.featureDescription}>
                    {feature.description}
                </p>
            )}
        </div>
    )
} 