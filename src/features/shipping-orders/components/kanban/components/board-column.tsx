import { SortableContext } from '@dnd-kit/sortable';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ShippingOrderCard } from './shipping-order-card';
import type { ShippingOrder } from '@/types/shipping-order';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

interface Props {
  column: Column;
  shippingOrders: ShippingOrder[];
}

const columnClass =
  'w-[350px] max-w-full shrink-0 flex flex-col bg-secondary h-[70vh] max-h-[75vh]';

export function BoardColumn({ column, shippingOrders }: Props) {
  const taskIds = shippingOrders.map((o) => o.id);

  return (
    <Card className={columnClass}>
      <CardHeader className='flex items-center border-b-2 p-4'>
        <CardTitle className='mr-auto'>
          {column.title} ({shippingOrders.length})
        </CardTitle>
      </CardHeader>

      <CardContent className='flex grow flex-col gap-4 overflow-x-hidden p-2'>
        <ScrollArea className='h-full'>
          <SortableContext items={taskIds}>
            {shippingOrders.map((o) => (
              <ShippingOrderCard key={o.id} shippingOrder={o} />
            ))}
          </SortableContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('px-2  pb-4 md:px-0 flex lg:justify-start', {
    variants: {
      dragging: {
        default: '',
        active: 'snap-none'
      }
    }
  });

  return (
    <ScrollArea className='h-[75vh] w-[80vw] rounded-md p-5 whitespace-nowrap'>
      <div
        className={variations({
          dragging: dndContext.active ? 'active' : 'default'
        })}
      >
        <div className='flex flex-row items-start justify-center gap-4'>
          {children}
        </div>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
