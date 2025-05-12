import React, { useMemo } from 'react';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';
import {
  DataSetRead
} from '@dhis2-chap/chap-lib';
import { useDatasets } from '../../hooks/useDatasets';
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableFoot,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  CircularLoader,
  NoticeBox
} from '@dhis2/ui';
import ActionMenu from './components/ActionMenu/ActionMenu';

const DatasetsTable: React.FC = () => {
  const { data: datasets, isLoading, isError, error } = useDatasets();

  const columnHelper = createColumnHelper<DataSetRead>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('created', {
        header: 'Created',
        cell: (info) => info.getValue() || 'N/A',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        size: 0,
        minSize: 0,
        maxSize: 0,
        enableResizing: false,
        cell: () => {
          return (
            <ActionMenu onDelete={() => {
              console.log('Delete clicked');
            }} />
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: datasets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div>
        <CircularLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <NoticeBox error title="Error loading datasets">
        {error instanceof Error ? error.message : 'Unknown error'}
      </NoticeBox>
    );
  }

  return (
    <div>
      <DataTable>
        <DataTableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <DataTableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <DataTableColumnHeader key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </DataTableColumnHeader>
              ))}
            </DataTableRow>
          ))}
        </DataTableHead>
        <DataTableBody>
          {table.getRowModel().rows.map(row => (
            <DataTableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <DataTableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </DataTableCell>
              ))}
            </DataTableRow>
          ))}
          {datasets && datasets.length === 0 && (
            <DataTableRow>
              <DataTableCell colSpan={table.getAllColumns().length.toString()}>
                <div>No datasets found</div>
              </DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
        <DataTableFoot>
          <DataTableRow>
            <DataTableCell colSpan={table.getAllColumns().length.toString()}>
              Table Footer
            </DataTableCell>
          </DataTableRow>
        </DataTableFoot>
      </DataTable>
    </div>
  );
};

export default DatasetsTable;
