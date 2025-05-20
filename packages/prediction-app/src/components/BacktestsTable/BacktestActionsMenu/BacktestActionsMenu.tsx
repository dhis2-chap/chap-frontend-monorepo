import React, { useState } from 'react';
import {
    FlyoutMenu,
    MenuItem,
    IconDelete16,
    IconEdit16,
    IconMore16,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { OverflowButton } from '@dhis2-chap/chap-lib';
import { useDeleteBacktest } from '../hooks/useDeleteBacktest';
import { EditBacktestModal } from './EditBacktestModal';

type Props = {
    id: number;
    name: string | null | undefined;
    onRename?: () => void;
    onDelete?: () => void;
}

export const BacktestActionsMenu = ({
    id,
    name,
}: Props) => {
    const [flyoutMenuIsOpen, setFlyoutMenuIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    const {
        deleteBacktest,
        isLoading: deleteIsLoading,
    } = useDeleteBacktest({
        onSuccess: () => {
            setDeleteModalIsOpen(false);
        },
    });

    return (
        <>
            <OverflowButton
                small
                open={flyoutMenuIsOpen}
                icon={<IconMore16 />}
                onClick={() => {
                    setFlyoutMenuIsOpen(prev => !prev);
                }}
                component={
                    <FlyoutMenu dense>
                        <MenuItem
                            label={i18n.t('Rename')}
                            dataTest={'backtest-overflow-rename'}
                            icon={<IconEdit16 />}
                            onClick={() => {
                                setEditModalIsOpen(true);
                                setFlyoutMenuIsOpen(false);
                            }}
                        />
                        <MenuItem
                            label={i18n.t('Delete')}
                            dataTest={'backtest-overflow-delete'}
                            destructive
                            icon={<IconDelete16 />}
                            onClick={() => {
                                setDeleteModalIsOpen(true);
                                setFlyoutMenuIsOpen(false);
                            }}
                        />
                    </FlyoutMenu>
                }
            />

            {editModalIsOpen && (
                <EditBacktestModal
                    id={id}
                    initialName={name ?? ''}
                    onClose={() => setEditModalIsOpen(false)}
                />
            )}

            {deleteModalIsOpen && (
                <Modal
                    onClose={() => setDeleteModalIsOpen(false)}
                >
                    <ModalTitle>
                        {i18n.t('Delete evaluation')}
                    </ModalTitle>
                    <ModalContent>
                        <p>
                            {i18n.t('Are you sure you want to delete this evaluation? This action cannot be undone.')}
                        </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                onClick={() => {
                                    setDeleteModalIsOpen(false);
                                }}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                primary
                                onClick={() => deleteBacktest(id)}
                                destructive
                                loading={deleteIsLoading}
                            >
                                {i18n.t('Delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
}; 