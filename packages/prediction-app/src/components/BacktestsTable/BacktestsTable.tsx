import React from 'react';
import {
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    Checkbox,
    Button,
    IconAdd16,
    DataTableFoot,
    Pagination,
    Chip,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { BackTestRead, ModelSpecRead } from '@dhis2-chap/chap-lib';
import { useNavigate } from 'react-router-dom';
import styles from './BacktestsTable.module.css';
import { BacktestActionsMenu } from './BacktestActionsMenu';
import { BacktestsTableFilters } from './BacktestsTableFilters';
import { BatchActions } from './BatchActions';

const statuses = {
    COMPLETED: 'completed',
    RUNNING: 'running',
    FAILED: 'failed',
}

const labelByStatus = {
    [statuses.COMPLETED]: i18n.t('Completed'),
    [statuses.RUNNING]: i18n.t('Running'),
    [statuses.FAILED]: i18n.t('Failed'),
}

const columnHelper = createColumnHelper<BackTestRead & { status?: string }>();

const columns = [
    columnHelper.accessor('id', {
        header: i18n.t('ID'),
        filterFn: 'equals',
    }),
    columnHelper.accessor('name', {
        header: i18n.t('Name'),
        filterFn: 'includesString',
    }),
    columnHelper.accessor('created', {
        header: i18n.t('Created'),
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : undefined,
    }),
    columnHelper.accessor('modelId', {
        header: i18n.t('Model'),
        filterFn: 'equals',
    }),
    columnHelper.accessor('status', {
        header: i18n.t('Status'),
        filterFn: 'equals',
        enableSorting: false,
        cell: (info) => info.getValue() ? (
            <Chip dense>
                {labelByStatus[info.getValue() as keyof typeof labelByStatus]}
            </Chip>
        ) : null,
    }),
    columnHelper.accessor('startDate', {
        header: i18n.t('Start Date'),
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : undefined,
    }),
    columnHelper.accessor('endDate', {
        header: i18n.t('End Date'),
        cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleString() : undefined,
    }),
    columnHelper.display({
        id: 'actions',
        header: i18n.t('Actions'),
        cell: (info) => (
            <BacktestActionsMenu
                id={info.row.original.id}
                name={info.row.original.name}
            />
        ),
    }),
];

const getSortDirection = (column: any) => {
    if (!column.getIsSorted()) return 'default';
    return column.getIsSorted() as 'asc' | 'desc';
};

type Props = {
    backtests: BackTestRead[];
    models: ModelSpecRead[];
}

export const BacktestsTable = ({ backtests, models }: Props) => {
    const navigate = useNavigate();
    const table = useReactTable({
        data: backtests || [],
        columns,
        initialState: {
            sorting: [{ id: 'created', desc: true }],
            columnVisibility: {
                startDate: false,
                endDate: false,
                status: false,
            },
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const hasVisibleRows = table.getRowModel().rows.length > 0;

    return (
        <div>
            {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) ? (
                <BatchActions table={table} />
            ) : (
                <div className={styles.buttonContainer}>
                    <div className={styles.leftSection}>
                        <BacktestsTableFilters
                            table={table}
                            statuses={statuses}
                            models={models}
                        />
                    </div>

                    <div className={styles.rightSection}>
                        <Button
                            primary
                            icon={<IconAdd16 />}
                            small
                            disabled
                            onClick={() => {
                                navigate('/evaluations/new');
                            }}
                        >
                            {i18n.t('New evaluation')}
                        </Button>
                    </div>
                </div>
            )}
            <DataTable>
                <DataTableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <DataTableRow key={headerGroup.id}>
                            <DataTableColumnHeader>
                                <Checkbox
                                    checked={table.getIsAllRowsSelected()}
                                    onChange={() => table.toggleAllRowsSelected()}
                                    disabled={!hasVisibleRows}
                                />
                            </DataTableColumnHeader>
                            {headerGroup.headers.map((header) => (
                                <DataTableColumnHeader
                                    key={header.id}
                                    fixed
                                    top
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
                    {hasVisibleRows ? table.getRowModel().rows
                        .map((row) => (
                            <DataTableRow selected={row.getIsSelected()} key={row.id}>
                                <DataTableCell>
                                    <Checkbox
                                        checked={row.getIsSelected()}
                                        onChange={() => row.toggleSelected()}
                                    />
                                </DataTableCell>
                                {row.getVisibleCells().map((cell) => (
                                    <DataTableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </DataTableCell>
                                ))}
                            </DataTableRow>
                        )) : (
                        <DataTableRow>
                            <DataTableCell colSpan={String(table.getAllColumns().length)} align='center'>
                                {i18n.t('No evaluations available')}
                            </DataTableCell>
                        </DataTableRow>
                    )}
                </DataTableBody>

                <DataTableFoot>
                    <DataTableRow>
                        <DataTableCell colSpan={String(table.getAllColumns().length)}>
                            <Pagination
                                page={table.getState().pagination.pageIndex + 1}
                                pageSize={table.getState().pagination.pageSize}
                                onPageSizeChange={(pageSize: number) => table.setPageSize(pageSize)}
                                isLastPage={!table.getCanNextPage()}
                                onPageChange={(page: number) => table.setPageIndex(page - 1)}
                            />
                        </DataTableCell>
                    </DataTableRow>
                </DataTableFoot>
            </DataTable>
        </div >
    );
};
