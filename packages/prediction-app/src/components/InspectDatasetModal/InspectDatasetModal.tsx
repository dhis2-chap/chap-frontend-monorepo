import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Modal, Button, ModalTitle, ModalContent, ButtonStrip, ModalActions } from '@dhis2/ui'
import { VisualizationPlugin } from '../VisualizationPlugin'
import { OrganisationUnit } from '../OrganisationUnitSelector'
import { toDHIS2PeriodData } from '../../features/timeperiod-selector/utils/timePeriodUtils'
import { PERIOD_TYPES } from '../NewEvaluationForm/Sections/PeriodSelector'
import { useConfig } from '@dhis2/app-runtime'

type Props = {
    onClose: () => void
    selectedOrgUnits: OrganisationUnit[]
    periodType: keyof typeof PERIOD_TYPES
    fromDate: string
    toDate: string
}

export const InspectDatasetModal = ({ onClose, selectedOrgUnits, periodType, fromDate, toDate }: Props) => {
    const { baseUrl } = useConfig();
    
    const calculatePeriods = () => {
        const selectedPeriodType = PERIOD_TYPES[periodType]
        if (!selectedPeriodType) return []

        const dateRange = toDHIS2PeriodData(fromDate, toDate, selectedPeriodType.toLowerCase())
        return dateRange.map((period) => ({
            id: period.id,
        }))
    }

    return (
        <Modal
            large
            onClose={onClose}
        >
            <ModalTitle>{i18n.t('Analyze dataset')}</ModalTitle>
            <ModalContent>
                <VisualizationPlugin
                    pluginSource={`${baseUrl}/dhis-web-data-visualizer/plugin.html`}
                    height={'500px'}
                    forDashboard={true}
                    displayProperty={'name'}
                    visualization={{
                        type: 'PIVOT_TABLE',
                        columns: [
                            {
                                dimension: "pe",
                                items: calculatePeriods()
                            },
                        ],
                        rows: [
                            {
                                dimension: "ou",
                                items: selectedOrgUnits.map((unit) => ({
                                    id: unit.id
                                }))
                            },
                            {
                                dimension: "dx",
                                items: [
                                    { id: "QpaUDYqd5tw" },
                                    { id: "YwIISeS7ruc" },
                                    { id: "eEXTDifdxhH" },
                                    { id: "Pi3zfVY962v" }
                                ]
                            }
                        ],
                        filters: [],
                    }} />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        onClick={onClose}
                        primary
                    >
                        {i18n.t('Close')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
} 