import React from 'react';
import {
    Input,
    SingleSelect,
    MenuItem,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Table } from '@tanstack/react-table';
import { BackTestRead, ModelSpecRead } from '@dhis2-chap/chap-lib';
import styles from './BacktestsTableFilters.module.css';

type Props = {
    table: Table<BackTestRead & { status?: string }>;
    statuses: {
        COMPLETED: string;
        RUNNING: string;
        FAILED: string;
    };
    models: ModelSpecRead[];
}

export const BacktestsTableFilters = ({ table, models, statuses }: Props) => {
    return (
        <>
            <div className={styles.inputContainer}>
                <Input
                    dense
                    placeholder={i18n.t('Search')}
                    value={table.getColumn('name')?.getFilterValue() as string | undefined}
                    onChange={(e) => table.getColumn('name')?.setFilterValue(e.value)}
                />
            </div>

            <div className={styles.singleSelectContainer}>
                <SingleSelect
                    filterable
                    noMatchText={i18n.t('No models found')}
                    dense
                    clearable
                    clearText={i18n.t('Clear')}
                    selected={table.getColumn('modelId')?.getFilterValue() as string | undefined}
                    placeholder={i18n.t('Model')}
                    onChange={(e) => table.getColumn('modelId')?.setFilterValue(e.selected)}
                >
                    {models.map((model) => (
                        <MenuItem
                            key={model.id}
                            className={styles.singleSelectMenuItem}
                            label={model.displayName ?? model.name}
                            value={model.name.toString()}
                        />
                    ))}
                </SingleSelect>
            </div>

            <div className={styles.singleSelectContainer}>
                <SingleSelect
                    dense
                    clearable
                    clearText={i18n.t('Clear')}
                    selected={table.getColumn('status')?.getFilterValue() as string | undefined}
                    placeholder={i18n.t('Status')}
                    onChange={(e) => table.getColumn('status')?.setFilterValue(e.selected)}
                >
                    <MenuItem label={i18n.t('Running')} value={statuses.RUNNING} />
                    <MenuItem label={i18n.t('Completed')} value={statuses.COMPLETED} />
                    <MenuItem label={i18n.t('Failed')} value={statuses.FAILED} />
                </SingleSelect>
            </div>
        </>
    );
}; 