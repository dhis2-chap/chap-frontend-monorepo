import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { ModelSpecRead, FeatureType } from '@dhis2-chap/chap-lib'
import { useFormContext } from 'react-hook-form'
import { EvaluationFormValues, CovariateMapping } from '../../../hooks/useFormController'
import SearchSelectField from '../../../../../features/search-dataitem/SearchSelectField'
import styles from './DataMappingModal.module.css'

type Props = {
    model: ModelSpecRead
    onClose: () => void
    onConfirm: (targetMapping: CovariateMapping, covariateMappings: CovariateMapping[]) => void
}

type LocalMappingState = {
    targetMapping?: CovariateMapping
    covariateMappings: CovariateMapping[]
}

export const DataMappingModal = ({
    model,
    onClose,
    onConfirm,
}: Props) => {
    const methods = useFormContext<EvaluationFormValues>()

    const [localState, setLocalState] = useState<LocalMappingState>(() => ({
        targetMapping: methods.getValues('targetMapping'),
        covariateMappings: methods.getValues('covariateMappings') || [],
    }))

    const handleTargetMapping = (targetName: string, dataItemId: string) => {
        setLocalState(prev => ({
            ...prev,
            targetMapping: {
                covariateName: targetName,
                dataItemId,
            }
        }))
    }

    const handleCovariateMapping = (covariateName: string, dataItemId: string) => {
        setLocalState(prev => {
            const existingMappings = prev.covariateMappings || []
            const existingIndex = existingMappings.findIndex(
                (mapping) => mapping.covariateName === covariateName
            )

            let updatedMappings: CovariateMapping[]

            if (existingIndex >= 0) {
                updatedMappings = [...existingMappings]
                updatedMappings[existingIndex] = {
                    covariateName,
                    dataItemId,
                }
            } else {
                updatedMappings = [
                    ...existingMappings,
                    {
                        covariateName,
                        dataItemId,
                    },
                ]
            }

            return {
                ...prev,
                covariateMappings: updatedMappings
            }
        })
    }

    const createFeatureFromTarget = (target: FeatureType) => ({
        id: target.name || target.displayName,
        name: target.displayName,
        displayName: target.displayName,
        description: target.description,
    })

    const createFeatureFromCovariate = (covariate: FeatureType) => ({
        id: covariate.name || covariate.displayName,
        name: covariate.displayName,
        displayName: covariate.displayName,
        description: covariate.description,
    })

    const shouldShowDescription = (feature: FeatureType) => {
        return feature.description
            && feature.description.toLowerCase() !== (feature.displayName ?? feature.name).toLowerCase()
    }

    const isTargetMapped = () => {
        if (!model.target || !localState.targetMapping) return false

        return localState.targetMapping.covariateName === (model.target.name || model.target.displayName) &&
            localState.targetMapping.dataItemId
    }

    const isCovariateNameMapped = (covariateName: string) => {
        return localState.covariateMappings.some(mapping =>
            mapping.covariateName === covariateName && mapping.dataItemId
        )
    }

    const areAllCovariatesMapped = () => {
        if (!model.covariates || model.covariates.length === 0) return true

        return model.covariates.every(covariate => {
            const covariateName = covariate.name || covariate.displayName
            return isCovariateNameMapped(covariateName)
        })
    }

    const isFormValid = isTargetMapped() && areAllCovariatesMapped()

    const handleConfirm = () => {
        if (isFormValid && localState.targetMapping) {
            onConfirm(localState.targetMapping, localState.covariateMappings)
        }
    }

    return (
        <Modal className={styles.dataMappingModal} onClose={onClose}>
            <ModalTitle>{i18n.t('Map Data Items')}</ModalTitle>
            <ModalContent>
                <div className={styles.content}>
                    <p className={styles.modalDescription}>
                        {i18n.t('Map the model features to corresponding data items in DHIS2')}
                    </p>

                    {model.target && (
                        <div className={styles.targetSection}>
                            <h4 className={styles.sectionTitle}>{i18n.t('Target')}</h4>
                            <p className={styles.sectionDescription}>
                                {i18n.t('Map the model target to the corresponding data item in DHIS2')}
                            </p>

                            <div className={styles.mappingItem}>
                                <SearchSelectField
                                    feature={createFeatureFromTarget(model.target)}
                                    onChangeSearchSelectField={(feature, dataItemId) => {
                                        handleTargetMapping(
                                            model.target.name || model.target.displayName,
                                            dataItemId
                                        )
                                    }}
                                />
                                {shouldShowDescription(model.target) && (
                                    <p className={styles.featureDescription}>
                                        {model.target.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {model.covariates && model.covariates.length > 0 && (
                        <div className={styles.covariatesSection}>
                            <h4 className={styles.sectionTitle}>Covariates</h4>
                            <p className={styles.sectionDescription}>
                                {i18n.t('Map each model covariate to the corresponding data item in DHIS2')}
                            </p>

                            {model.covariates.map((covariate, index) => {
                                const feature = createFeatureFromCovariate(covariate)

                                return (
                                    <div key={covariate.name || index} className={styles.mappingItem}>
                                        <SearchSelectField
                                            feature={feature}
                                            onChangeSearchSelectField={(feature, dataItemId) =>
                                                handleCovariateMapping(
                                                    covariate.name || covariate.displayName,
                                                    dataItemId
                                                )
                                            }
                                        />
                                        
                                        {shouldShowDescription(covariate) && (
                                            <p className={styles.featureDescription}>
                                                {covariate.description}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button primary onClick={handleConfirm} disabled={!isFormValid}>
                        {i18n.t('Save Mappings')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
} 