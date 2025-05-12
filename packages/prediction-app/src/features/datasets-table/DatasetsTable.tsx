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
import ActionMenu from './components/ActionMenu/ActionMenu';
import styles from './DatasetsTable.module.css';

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
      <div className={styles.loadingContainer}>
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
    <div className={styles.tableContainer}>
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
                <div className={styles.noDataCell}>No datasets found</div>
              </TableCell>
              <TableCell>
                <div className={styles.noDataCell}></div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatasetsTable;
