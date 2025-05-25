import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    Label,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { Control, FieldErrors } from 'react-hook-form'
import { EvaluationFormValues } from '../../NewEvaluationForm'
import { OrganisationUnitSelector as OrgUnitSelector } from '../../../OrganisationUnitSelector'
import { useDataViewRootOrgUnits } from '../../../../hooks/useDataViewRootOrgUnits'
import styles from './OrganisationUnitSelector.module.css'

type Props = {
    control: Control<EvaluationFormValues>
    errors: FieldErrors<EvaluationFormValues>
    selectedOrgUnits: any[]
    onOrgUnitSelect: (selection: any) => void
}

export const OrganisationUnitSelector = ({
    control,
    errors,
    selectedOrgUnits,
    onOrgUnitSelect
}: Props) => {
    const [isOrgUnitModalOpen, setIsOrgUnitModalOpen] = useState(false)
    const { orgUnits, isLoading: isLoadingOrgUnits } = useDataViewRootOrgUnits()

    const handleModalClose = () => {
        setIsOrgUnitModalOpen(false)
    }

    const handleModalConfirm = () => {
        setIsOrgUnitModalOpen(false)
        // Selection is already handled by onOrgUnitSelect
    }

    return (
        <>
            <div className={styles.formField}>
                <Label>{i18n.t('Organisation Units')}</Label>
                <div className={styles.selectionInfo}>
                    <p>{i18n.t('Selected units: {{count}}', { count: selectedOrgUnits.length })}</p>
                    <Button
                        onClick={() => setIsOrgUnitModalOpen(true)}
                        disabled={isLoadingOrgUnits}
                        loading={isLoadingOrgUnits}
                        dataTest="evaluation-org-unit-select-button"
                    >
                        {isLoadingOrgUnits ? i18n.t('Loading organisation units...') : i18n.t('Select Organisation Units')}
                    </Button>
                </div>
            </div>

            {isOrgUnitModalOpen && (
                <Modal onClose={handleModalClose} large>
                    <ModalTitle>{i18n.t('Select Organisation Units')}</ModalTitle>
                    <ModalContent>
                        <OrgUnitSelector
                            roots={orgUnits?.map(unit => unit.id) || []}
                            selected={selectedOrgUnits}
                            onSelect={onOrgUnitSelect}
                            hideGroupSelect={true}
                            hideLevelSelect={false}
                            hideUserOrgUnits={false}
                        />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button onClick={handleModalClose}>
                                {i18n.t('Cancel')}
                            </Button>
                            <Button primary onClick={handleModalConfirm}>
                                {i18n.t('Confirm Selection')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
} 