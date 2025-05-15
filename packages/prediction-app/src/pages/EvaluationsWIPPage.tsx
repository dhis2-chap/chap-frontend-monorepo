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
        header: 'ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue() || 'Unnamed',
    }),
    columnHelper.accessor('created', {
        header: 'Created',
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : 'Unknown',
    }),
    columnHelper.accessor('modelId', {
        header: 'Model ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('startDate', {
        header: 'Start Date',
        cell: (info) => info.getValue() || 'Unknown',
    }),
    columnHelper.accessor('endDate', {
        header: 'End Date',
        cell: (info) => info.getValue() || 'Unknown',
    }),
];

const EvaluationsWIPPage: React.FC = () => {
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
                <NoticeBox error title="Error loading evaluations">
                    {error.message || 'An unknown error occurred'}
                </NoticeBox>
            </div>
        );
    }

    if (!backtests || backtests.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <NoticeBox title="No evaluations">
                    No evaluations found in the system.
                </NoticeBox>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Evaluations (WIP)</h1>
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
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default EvaluationsWIPPage;
