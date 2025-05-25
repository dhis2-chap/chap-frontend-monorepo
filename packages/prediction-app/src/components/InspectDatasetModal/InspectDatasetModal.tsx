import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Modal, Button, ModalTitle, ModalContent, ButtonStrip, ModalActions } from '@dhis2/ui'
import { VisualizationPlugin } from '../VisualizationPlugin'

type Props = {
    isOpen: boolean
    onClose: () => void
    selectedOrgUnits: any[]
}

export const InspectDatasetModal = ({ isOpen, onClose, selectedOrgUnits }: Props) => {
    if (!isOpen) return null

    return (
        <Modal
            large
            onClose={onClose}
        >
            <ModalTitle>{i18n.t('Analyze dataset')}</ModalTitle>
            <ModalContent>
                <VisualizationPlugin
                    pluginSource='http://localhost:8080/dhis-web-data-visualizer/plugin.html'
                    height={'500px'}
                    forDashboard={true}
                    displayProperty={'name'}
                    visualization={{
                        type: 'PIVOT_TABLE',
                        columns: [
                            {
                                dimension: "pe",
                                items: [
                                    { id: "202201" },
                                    { id: "202202" },
                                    { id: "202203" },
                                    { id: "202204" },
                                    { id: "202205" },
                                    { id: "202206" },
                                    { id: "202207" },
                                    { id: "202208" },
                                    { id: "202209" },
                                    { id: "202210" },
                                    { id: "202211" },
                                    { id: "202212" },
                                    { id: "202301" },
                                    { id: "202302" },
                                    { id: "202303" },
                                    { id: "202304" },
                                    { id: "202305" },
                                    { id: "202306" },
                                    { id: "202307" },
                                    { id: "202308" },
                                    { id: "202309" },
                                    { id: "202310" },
                                    { id: "202311" },
                                    { id: "202312" },
                                    { id: "202401" },
                                    { id: "202402" },
                                    { id: "202403" },
                                    { id: "202404" },
                                    { id: "202405" },
                                    { id: "202406" },
                                    { id: "202407" },
                                    { id: "202408" },
                                    { id: "202409" },
                                    { id: "202410" },
                                    { id: "202411" },
                                    { id: "202412" }
                                ]
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
                    }}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t('Close')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
} 