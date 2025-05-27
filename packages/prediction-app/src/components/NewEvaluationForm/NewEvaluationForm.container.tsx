import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { FormProvider } from 'react-hook-form'
import { NewEvaluationFormComponent } from './NewEvaluationForm.component'
import { Card } from '@dhis2-chap/chap-lib'
import { Summary } from './Sections/Summary/Summary'
import { useFormController } from './hooks/useFormController'
import styles from './NewEvaluationForm.module.css'
import { Button, IconArrowLeft16 } from '@dhis2/ui'
import { useNavigate } from 'react-router-dom'
import { useNavigationBlocker } from './hooks/useNavigationBlocker'
import { NavigationConfirmModal } from '../NavigationConfirmModal'

export const NewEvaluationForm = () => {
    const navigate = useNavigate()
    const {
        methods,
        onUpdateOrgUnits,
        handleSubmit,
        handleStartJob
    } = useFormController()

    const {
        showConfirmModal,
        handleConfirmNavigation,
        handleCancelNavigation,
    } = useNavigationBlocker({
        shouldBlock: methods.formState.isDirty
    })

    const handleBackClick = () => {
        navigate('/evaluationsWIP')
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
                    <div className={styles.leftColumn}>
                        <Card>
                            <NewEvaluationFormComponent
                                onSubmit={handleSubmit}
                                methods={methods}
                                onUpdateOrgUnits={onUpdateOrgUnits}
                            />
                        </Card>
                    </div>
                    <div className={styles.rightColumn}>
                        <Card>
                            <Summary
                                control={methods.control}
                                isValid={methods.formState.isValid}
                                onStartJob={handleStartJob}
                            />
                        </Card>
                    </div>
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