import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { FormProvider } from 'react-hook-form'
import { NewEvaluationFormComponent } from './NewEvaluationForm.component'
import { Card } from '@dhis2-chap/chap-lib'
import { useFormController } from './hooks/useFormController'
import styles from './NewEvaluationForm.module.css'
import { Button, ButtonStrip, DataTable, DataTableBody, DataTableCell, DataTableColumnHeader, DataTableHead, DataTableRow, IconArrowLeft16, IconArrowRightMulti16, NoticeBox, Table, TableHead } from '@dhis2/ui'
import { useNavigate } from 'react-router-dom'
import { useNavigationBlocker } from '../../hooks/useNavigationBlocker'
import { NavigationConfirmModal } from '../NavigationConfirmModal'

export const NewEvaluationForm = () => {
    const navigate = useNavigate()
    const {
        methods,
        onUpdateOrgUnits,
        handleSubmit,
        handleStartJob,
        isSubmitting,
        error,
        importSummary,
    } = useFormController()

    const {
        showConfirmModal,
        handleConfirmNavigation,
        handleCancelNavigation,
    } = useNavigationBlocker({
        shouldBlock: !isSubmitting && methods.formState.isDirty
    })

    const handleBackClick = () => {
        navigate('/evaluate')
    }

    return (
        <>
            <Button
                className={styles.backButton}
                small
                icon={<IconArrowLeft16 />}
                onClick={handleBackClick}
            >
                {i18n.t('Back to evaluations')}
            </Button>

            <FormProvider {...methods}>
                <div className={styles.container}>
                    <Card>
                        <NewEvaluationFormComponent
                            onSubmit={handleSubmit}
                            methods={methods}
                            onUpdateOrgUnits={onUpdateOrgUnits}
                        />

                        {!!error && !importSummary && (
                            <NoticeBox
                                error
                                title={i18n.t('Error starting evaluation job')}
                                className={styles.errorNotice}
                            >
                                {error.message}
                            </NoticeBox>
                        )}

                        {importSummary && (
                            <div>
                                <DataTable>
                                    <DataTableHead>
                                        <DataTableColumnHeader>
                                            {i18n.t('Feature')}
                                        </DataTableColumnHeader>
                                        <DataTableColumnHeader>
                                            {i18n.t('Org unit')}
                                        </DataTableColumnHeader>
                                        <DataTableColumnHeader>
                                            {i18n.t('Period')}
                                        </DataTableColumnHeader>
                                        <DataTableColumnHeader>
                                            {i18n.t('Reason')}
                                        </DataTableColumnHeader>
                                    </DataTableHead>
                                    <DataTableBody>
                                        {importSummary.rejected.map((rejected) => (
                                            <DataTableRow key={rejected.featureName}>
                                                <DataTableCell>
                                                    {rejected.featureName}
                                                </DataTableCell>
                                                <DataTableCell>
                                                    {rejected.orgUnit}
                                                </DataTableCell>
                                                <DataTableCell>
                                                    {rejected.period.join(', ')}
                                                </DataTableCell>
                                                <DataTableCell>
                                                    {rejected.reason}
                                                </DataTableCell>
                                            </DataTableRow>
                                        ))}
                                    </DataTableBody>
                                </DataTable>
                            </div>
                        )}

                        <div className={styles.buttons}>
                            <ButtonStrip end>
                                <Button
                                    primary
                                    loading={isSubmitting}
                                    onClick={handleStartJob}
                                    icon={<IconArrowRightMulti16 />}
                                >
                                    {i18n.t('Start job')}
                                </Button>
                            </ButtonStrip>
                        </div>
                    </Card>
                </div>
            </FormProvider>

            {showConfirmModal && (
                <NavigationConfirmModal
                    onConfirm={handleConfirmNavigation}
                    onCancel={handleCancelNavigation}
                />
            )}
        </>
    )
}