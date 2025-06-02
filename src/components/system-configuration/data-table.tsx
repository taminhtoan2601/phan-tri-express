/**
 * System Configuration Data Table Component
 * Reusable data table for all system configuration entities
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusIcon, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

/**
 * Props for the DataTable component
 */
interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  onAdd: () => void;
  isLoading?: boolean;
}

/**
 * Generic DataTable component for displaying system configuration data
 */
export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onAdd,
  isLoading = false
}: DataTableProps<T>) {
  return (
    <div className='rounded-md border'>
      <div className='flex items-center justify-between border-b p-4'>
        <h3 className='text-lg font-medium'>Data List</h3>
        <Button onClick={onAdd} size='sm'>
          <PlusIcon className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((x) => x.key !== 'actions')
                .map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className='py-8 text-center'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className='py-8 text-center'
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns
                    .filter((x) => x.key !== 'actions')
                    .map((column) => (
                      <TableCell key={`${item.id}-${column.key}`}>
                        {column.render
                          ? column.render(item)
                          : (item as any)[column.key]?.toString()}
                      </TableCell>
                    ))}
                  <TableCell className='text-right'>
                    {(() => {
                      const actionColumn = columns.find(
                        (x) => x.key === 'actions'
                      );
                      return actionColumn && actionColumn.render
                        ? actionColumn.render(item)
                        : null;
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Props for the DataDrawer component
 */
interface DataDrawerProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Generic drawer component for editing system configuration data
 */
export function DataDrawer<T>({
  isOpen,
  onClose,
  title,
  children
}: DataDrawerProps<T>) {
  // Chỉ render drawer khi isOpen = true
  if (!isOpen) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <div className='mx-auto w-full max-w-md'>
          <DrawerHeader className='flex items-center justify-between'>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' onClick={onClose}>
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className='px-4 pb-4'>{children}</div>
          <DrawerFooter className='pt-2'></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
