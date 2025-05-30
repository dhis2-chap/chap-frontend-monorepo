import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { FormProvider } from 'react-hook-form'
import { NewEvaluationFormComponent } from './NewEvaluationForm.component'
import { Card } from '@dhis2-chap/chap-lib'
import { useFormController } from './hooks/useFormController'
import styles from './NewEvaluationForm.module.css'
import { Button, ButtonStrip, IconArrowLeft16, IconArrowRightMulti16 } from '@dhis2/ui'
import { useNavigate } from 'react-router-dom'
import { useNavigationBlocker } from './hooks/useNavigationBlocker'
import { NavigationConfirmModal } from '../NavigationConfirmModal'

export const NewEvaluationForm = () => {
    const navigate = useNavigate()
    const {
        methods,
        onUpdateOrgUnits,
        handleSubmit,
        handleStartJob,
        isSubmitting,
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