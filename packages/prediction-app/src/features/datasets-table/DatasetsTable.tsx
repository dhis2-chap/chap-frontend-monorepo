import React, { useMemo, useState, useRef } from 'react';
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
  NoticeBox,
  Button,
  IconMore16,
  IconDelete16,
  FlyoutMenu,
  MenuItem,
  Popper
} from '@dhis2/ui';
import styles from './DatasetsTable.module.css';

const DatasetsTable: React.FC = () => {
  const { data: datasets, isLoading, isError, error } = useDatasets();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const buttonRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu !== null) {
        const buttonRef = buttonRefs.current[activeMenu];
        const menuRef = menuRefs.current[activeMenu];
        
        if (
          menuRef && 
          !menuRef.contains(event.target as Node) && 
          buttonRef && 
          !buttonRef.contains(event.target as Node)
        ) {
          setActiveMenu(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);
  
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
        cell: (info) => {
          const rowIndex = info.row.index;
          return (
            <div className={styles.actionsCell}>
              <div 
                ref={(el) => (buttonRefs.current[rowIndex] = el)}
                className={styles.actionButton}
              >
                <Button
                  small
                  icon={<IconMore16 />}
                  onClick={() => setActiveMenu(activeMenu === rowIndex ? null : rowIndex)}
                />
              </div>
              
              {activeMenu === rowIndex && buttonRefs.current[rowIndex] && (
                <Popper reference={buttonRefs.current[rowIndex] as unknown as Element} placement="bottom-end">
                  <div ref={(el) => (menuRefs.current[rowIndex] = el)}>
                    <FlyoutMenu>
                      <MenuItem
                        label="Delete"
                        icon={<IconDelete16 />}
                        destructive
                        onClick={() => {
                          setActiveMenu(null);
                        }}
                      />
                    </FlyoutMenu>
                  </div>
                </Popper>
              )}
            </div>
          );
        },
      }),
    ],
    [activeMenu]
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
