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
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableRowHead, 
  TableCellHead,
  CircularLoader,
  NoticeBox
} from '@dhis2/ui';

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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
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
      <Table>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRowHead key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCellHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCellHead>
              ))}
            </TableRowHead>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {datasets && datasets.length === 0 && (
            <TableRow>
              <TableCell>
                <div style={{ textAlign: 'center' }}>No datasets found</div>
              </TableCell>
              <TableCell>
                <div style={{ textAlign: 'center' }}></div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatasetsTable;
