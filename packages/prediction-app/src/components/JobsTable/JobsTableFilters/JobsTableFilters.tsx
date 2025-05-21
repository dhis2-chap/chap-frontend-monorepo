import React from 'react';
import {
    Input,
    SingleSelect,
    MenuItem,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Table } from '@tanstack/react-table';
import { JobDescription } from '@dhis2-chap/chap-lib';
import styles from './JobsTableFilters.module.css';

type Props = {
    table: Table<JobDescription>;
    statuses: {
        SUCCESS: string;
        PENDING: string;
        FAILED: string;
    };
}

export const JobsTableFilters = ({ table, statuses }: Props) => {
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
                    dense
                    clearable
                    clearText={i18n.t('Clear')}
                    selected={table.getColumn('status')?.getFilterValue() as string | undefined}
                    placeholder={i18n.t('Status')}
                    onChange={(e) => table.getColumn('status')?.setFilterValue(e.selected)}
                >
                    <MenuItem label={i18n.t('Pending')} value={statuses.PENDING} />
                    <MenuItem label={i18n.t('Success')} value={statuses.SUCCESS} />
                    <MenuItem label={i18n.t('Failed')} value={statuses.FAILED} />
                </SingleSelect>
            </div>
        </>
    );
};
