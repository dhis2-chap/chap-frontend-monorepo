import React, { useState } from 'react';
import {
    FlyoutMenu,
    MenuItem,
    IconDelete16,
    IconEdit16,
    IconMore16,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { OverflowButton } from '@dhis2-chap/chap-lib';
import { EditBacktestModal } from './EditBacktestModal';
import { DeleteBacktestModal } from './DeleteBacktestModal/DeleteBacktestModal';

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
                <DeleteBacktestModal
                    id={id}
                    onClose={() => setDeleteModalIsOpen(false)}
                />
            )}
        </>
    );
}; 