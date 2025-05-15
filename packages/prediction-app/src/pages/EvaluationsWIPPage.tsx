import React from 'react';
import {
    CircularLoader,
    NoticeBox,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableCellHead,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import styles from './EvaluationsWIPPage.module.css';
import { useBacktests } from '../hooks/useBacktests';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { BackTestRead } from '@dhis2-chap/chap-lib';

const columnHelper = createColumnHelper<BackTestRead>();

const columns = [
    columnHelper.accessor('id', {
        header: i18n.t('ID'),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: i18n.t('Name'),
        cell: (info) => info.getValue() || i18n.t('Unnamed'),
    }),
    columnHelper.accessor('created', {
        header: i18n.t('Created'),
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : i18n.t('Unknown'),
    }),
    columnHelper.accessor('modelId', {
        header: i18n.t('Model ID'),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('startDate', {
        header: i18n.t('Start Date'),
        cell: (info) => info.getValue() || i18n.t('Unknown'),
    }),
    columnHelper.accessor('endDate', {
        header: i18n.t('End Date'),
        cell: (info) => info.getValue() || i18n.t('Unknown'),
    }),
];

export const EvaluationsWIPPage: React.FC = () => {
    const { backtests, error, isLoading } = useBacktests();

    const table = useReactTable({
        data: backtests || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <NoticeBox error title={i18n.t('Error loading evaluations')}>
                    {error.message || i18n.t('An unknown error occurred')}
                </NoticeBox>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>{i18n.t('Evaluations (WIP)')}</h1>
            <Table>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableCellHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableCellHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {(!backtests || backtests.length === 0) && (
                        <TableRow>
                            <TableCell>
                                {i18n.t('No evaluations found')}
                            </TableCell>
                            {columns.slice(1).map((_, index) => (
                                <TableCell />
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
