import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    Label,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    IconDimensionOrgUnit16,
    NoticeBox,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import cn from 'classnames'
import { Control, FieldErrors, useFormContext, useWatch, set, useForm } from 'react-hook-form'
import { EvaluationFormValues } from '../../hooks/useFormController'
import {
    getSelectionSummary,
    OrganisationUnit,
    OrganisationUnitSelector as OrgUnitSelector,
    SelectionChangeEvent,
} from '../../../OrganisationUnitSelector'
import { useDataViewRootOrgUnits } from '../../../../hooks/useDataViewRootOrgUnits'
import styles from './LocationSelector.module.css'

type Props = {
    control: Control<EvaluationFormValues>
    errors: FieldErrors<EvaluationFormValues>
    onUpdateOrgUnits: (orgUnits: OrganisationUnit[]) => void
}

export const LocationSelector = ({
    control,
    errors,
    onUpdateOrgUnits,
}: Props) => {
    const selectedOrgUnits = useWatch({ control, name: 'orgUnits' })
    const [isOrgUnitModalOpen, setIsOrgUnitModalOpen] = useState(false)
    const { orgUnits: orgUnitRoots, isLoading: isLoadingOrgUnits } = useDataViewRootOrgUnits()

    const onOrgUnitSelect = (e: SelectionChangeEvent) => {
        onUpdateOrgUnits(e.items)
    }

    const handleModalClose = () => {
        setIsOrgUnitModalOpen(false)
    }

    const handleModalConfirm = () => {
        setIsOrgUnitModalOpen(false)
    }

    return (
        <>
            <div className={cn(styles.formField, styles.orgUnitSelector)}>
                <Label>{i18n.t('Organisation Units')}</Label>
                <p className={styles.mutedText}>{getSelectionSummary(selectedOrgUnits)}</p>
                <Button
                    onClick={() => setIsOrgUnitModalOpen(true)}
                    disabled={isLoadingOrgUnits}
                    loading={isLoadingOrgUnits}
                    icon={<IconDimensionOrgUnit16 />}
                    dataTest="evaluation-org-unit-select-button"
                    small
                >
                    {i18n.t('Select organisation units')}
                </Button>
                {errors.orgUnits && <p className={styles.errorText}>{errors.orgUnits.message}</p>}
            </div>

            {isOrgUnitModalOpen && (
                <Modal onClose={handleModalClose} large>
                    <ModalTitle>{i18n.t('Select Organisation Units')}</ModalTitle>
                    <ModalContent>
                        <div className={styles.noticeBox}>
                            <NoticeBox title={i18n.t('Organisation unit levels')}>
                                {i18n.t('Some models require you to only select organisation units from the same level.')}
                            </NoticeBox>
                        </div>
                        <OrgUnitSelector
                            roots={orgUnitRoots?.map(unit => unit.id) || []}
                            selected={selectedOrgUnits}
                            onSelect={onOrgUnitSelect}
                            hideGroupSelect={true}
                            hideLevelSelect={false}
                            hideUserOrgUnits={true}
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