import React, { useState, useMemo } from 'react'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Input,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    createColumnHelper,
} from '@tanstack/react-table'
import { ModelSpecRead } from '@dhis2-chap/chap-lib'
import { ModelCard } from '../ModelCard'
import styles from './ModelSelectionModal.module.css'

type Props = {
    models?: ModelSpecRead[]
    selectedModel?: ModelSpecRead
    onClose: () => void
    onConfirm: (model: ModelSpecRead) => void
}

export const ModelSelectionModal = ({
    models,
    selectedModel: initialSelectedModel,
    onClose,
    onConfirm,
}: Props) => {
    const [selectedModel, setSelectedModel] = useState<ModelSpecRead | undefined>(initialSelectedModel)

    const handleModalClose = () => {
        setSelectedModel(undefined)
        onClose()
    }

    const handleModalConfirm = () => {
        if (selectedModel) {
            onConfirm(selectedModel)
        }
        handleModalClose()
    }

    const onModelSelect = (model: ModelSpecRead) => {
        if (selectedModel?.id === model.id) {
            setSelectedModel(undefined)
        } else {
            setSelectedModel(model)
        }
    }

    const columnHelper = createColumnHelper<ModelSpecRead>()

    const columns = useMemo(
        () => [
            columnHelper.accessor('displayName', {
                id: 'displayName',
                enableColumnFilter: true,
                filterFn: 'includesString',
            }),
            columnHelper.accessor('supportedPeriodType', {
                id: 'supportedPeriodType',
                enableColumnFilter: true,
                filterFn: 'includesString',
            }),
        ],
        []
    )

    const table = useReactTable({
        data: models || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    const filteredRows = table.getRowModel().rows

    return (
        <Modal className={styles.modelModal} onClose={handleModalClose}>
            <ModalTitle>{i18n.t('Select Model')}</ModalTitle>
            <ModalContent>
                <div className={styles.content}>
                    <div className={styles.filterContainer}>
                        <h3>{i18n.t('Filter models')}</h3>
                        <Input
                            placeholder={i18n.t('Search by name')}
                            value={table.getColumn('displayName')?.getFilterValue() as string || ''}
                            onChange={({ value }) => table.setColumnFilters([{ id: 'displayName', value: value || '' }])}
                        />
                    </div>
                    <div className={styles.modelGrid}>
                        {filteredRows.length > 0 ? filteredRows.map((row) => (
                            <ModelCard
                                key={row.original.id}
                                model={row.original}
                                isSelected={selectedModel?.id === row.original.id}
                                onSelect={onModelSelect}
                            />
                        )) : (
                            <div className={styles.noResults}>
                                {i18n.t('No models found')}
                            </div>
                        )}
                    </div>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={handleModalClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button primary onClick={handleModalConfirm} disabled={!selectedModel}>
                        {i18n.t('Confirm Selection')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
} 