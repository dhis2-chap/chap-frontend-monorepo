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
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    Card,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import styles from './EvaluationsWIPPage.module.css';
import { useBacktests } from '../hooks/useBacktests';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table';
import { BackTestRead } from '@dhis2-chap/chap-lib';

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

export const EvaluationsWIPPage: React.FC = () => {
    const { backtests, error, isLoading } = useBacktests();
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
        <Card className={styles.container}>
            <h2>{i18n.t('Evaluations (WIP)')}</h2>
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
        </Card>
    );
};
