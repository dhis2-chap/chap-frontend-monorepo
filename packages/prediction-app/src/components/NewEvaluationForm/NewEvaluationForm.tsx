import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    IconArrowRightMulti16,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './NewEvaluationForm.module.css'
import { useNavigate } from 'react-router-dom'
import { PeriodSelector } from './Sections/PeriodSelector'
import { NameInput } from './Sections/NameInput'
import { OrganisationUnitSelector } from './Sections/OrganisationUnitSelector'
import { InspectDatasetModal } from '../InspectDatasetModal'

const evaluationSchema = z.object({
    name: z.string().min(1, { message: i18n.t('Name is required') }),
    periodType: z.string().min(1, { message: i18n.t('Period type is required') }),
    fromDate: z.string().min(1, { message: i18n.t('Start date is required') }),
    toDate: z.string().min(1, { message: i18n.t('End date is required') }),
})

export type EvaluationFormValues = z.infer<typeof evaluationSchema>

type Props = {
    onSubmit: (data: EvaluationFormValues) => void
    isSubmitting?: boolean
}

export const EvaluationForm = ({
    onSubmit,
    isSubmitting = false,
}: Props) => {
    const navigate = useNavigate()
    const [selectedOrgUnits, setSelectedOrgUnits] = useState<any[]>([])
    const [isInspectDatasetModalOpen, setIsInspectDatasetModalOpen] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationSchema),
        defaultValues: {
            name: '',
            periodType: '',
            fromDate: '',
            toDate: '',
        },
    })

    const onCancel = () => {
        navigate('/evaluationsWIP')
    }

    const handleFormSubmit = (data: EvaluationFormValues) => {
        onSubmit(data)
    }

    const handleOrgUnitSelect = (selection: any) => {
        console.log('Org unit selection:', selection)
        setSelectedOrgUnits(selection.items || [])
    }

    return (
        <>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <NameInput control={control} errors={errors} />

                    <PeriodSelector
                        control={control}
                        errors={errors}
                    />

                    <OrganisationUnitSelector
                        control={control}
                        errors={errors}
                        selectedOrgUnits={selectedOrgUnits}
                        onOrgUnitSelect={handleOrgUnitSelect}
                    />

                    <Button onClick={() => setIsInspectDatasetModalOpen(true)}>
                        {i18n.t('Analyze dataset')}
                    </Button>

                    <div className={styles.buttons}>
                        <ButtonStrip>
                            <Button
                                type="button"
                                onClick={() => onCancel()}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                primary
                                icon={<IconArrowRightMulti16 />}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                {i18n.t('Start job')}
                            </Button>
                        </ButtonStrip>
                    </div>
                </form>
            </div>

            <InspectDatasetModal
                isOpen={isInspectDatasetModalOpen}
                onClose={() => setIsInspectDatasetModalOpen(false)}
                selectedOrgUnits={selectedOrgUnits}
            />
        </>
    )
}
