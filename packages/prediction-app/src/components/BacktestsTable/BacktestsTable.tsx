import React from 'react';
import {
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table';
import { BackTestRead } from '@dhis2-chap/chap-lib';
import styles from './BacktestsTable.module.css';

const columnHelper = createColumnHelper<BackTestRead>();

const columns = [
    columnHelper.accessor('id', {
        header: i18n.t('ID'),
    }),
    columnHelper.accessor('name', {
        header: i18n.t('Name'),
    }),
    columnHelper.accessor('created', {
        header: i18n.t('Created'),
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : undefined,
    }),
    columnHelper.accessor('modelId', {
        header: i18n.t('Model ID'),
    }),
    columnHelper.accessor('startDate', {
        header: i18n.t('Start Date'),
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : undefined,
    }),
    columnHelper.accessor('endDate', {
        header: i18n.t('End Date'),
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : undefined,
    }),
];

const getSortDirection = (column: any) => {
    if (!column.getIsSorted()) return 'default';
    return column.getIsSorted() as 'asc' | 'desc';
};

interface BacktestsTableProps {
    backtests: BackTestRead[];
}

export const BacktestsTable: React.FC<BacktestsTableProps> = ({ backtests }) => {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'created', desc: true }
    ]);

    const table = useReactTable({
        data: backtests || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DataTable>
            <DataTableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <DataTableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <DataTableColumnHeader
                                key={header.id}
                                {...(header.column.getCanSort() ? {
                                    sortDirection: getSortDirection(header.column),
                                    sortIconTitle: i18n.t('Sort by {{column}}', { column: header.column.id }),
                                    onSortIconClick: () => header.column.toggleSorting()
                                } : {})}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </DataTableColumnHeader>
                        ))}
                    </DataTableRow>
                ))}
            </DataTableHead>
            <DataTableBody>
                {table.getRowModel().rows.map((row) => (
                    <DataTableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <DataTableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </DataTableCell>
                        ))}
                    </DataTableRow>
                ))}
                {(!backtests || backtests.length === 0) && (
                    <DataTableRow>
                        <DataTableCell colSpan={String(table.getAllColumns().length)} align='center'>
                            {i18n.t('No evaluations available')}
                        </DataTableCell>
                    </DataTableRow>
                )}
            </DataTableBody>
        </DataTable>
    );
};
