'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconDotsVertical,
  IconPackage,
  IconPackages,
  IconSend,
  IconUser
} from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { format } from 'date-fns';
import { ShippingOrder } from '@/types/shipping-order';
import { ShippingOrderStatus } from '@/types/enums';

/* -------------------------------- types ------------------------------- */
type ShippingOrderType = 'ShippingOrder';
export interface ShippingOrderDragData {
  type: ShippingOrderType;
  shippingOrder: ShippingOrder;
}
interface Props {
  shippingOrder: ShippingOrder;
  isOverlay?: boolean;
}

/* ---------------------------- status → action -------------------------- */
const statusAction: Partial<
  Record<ShippingOrderStatus, { id: string; label: string }>
> = {
  [ShippingOrderStatus.Draft]: {
    id: 'confirm',
    label: 'Xác nhận đơn'
  },
  [ShippingOrderStatus.PendingForApproval]: {
    id: 'approve',
    label: 'Duyệt đơn'
  },
  [ShippingOrderStatus.Approved]: {
    id: 'verify',
    label: 'Xác nhận chứng từ'
  },
  [ShippingOrderStatus.DocsVerified]: {
    id: 'inbound',
    label: 'Nhập kho'
  },
  [ShippingOrderStatus.EntryInWarehouse]: {
    id: 'ready',
    label: 'Sẵn sàng xuất kho'
  },
  [ShippingOrderStatus.ReadyToExport]: {
    id: 'export',
    label: 'Xuất kho'
  },
  [ShippingOrderStatus.InTransit]: {
    id: 'delivered',
    label: 'Đã giao'
  }
};
/* -------------------------------- card -------------------------------- */
export function ShippingOrderCard({ shippingOrder, isOverlay }: Props) {
  /* DnD */
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: shippingOrder.id,
    data: { type: 'ShippingOrder', shippingOrder } as ShippingOrderDragData
  });
  const style = { transition, transform: CSS.Translate.toString(transform) };
  const variants = cva('mb-3', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary'
      }
    }
  });

  /* dropdown items */
  const dynamic = statusAction[shippingOrder.status];

  const handleAction = (actionId: string) => {
    // TODO: call mutation / navigate …
    console.log('[ACTION]', actionId, 'on order', shippingOrder.id);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      {/* ── HEADER ── */}
      <CardHeader className='flex items-start gap-2 border-b'>
        {/* drag handle */}
        <Button
          variant='ghost'
          size='icon'
          {...attributes}
          {...listeners}
          className='mr-1 -ml-2 p-1'
        >
          <IconPackages size={16} />
          <span className='sr-only'>Drag</span>
        </Button>

        {/* code + date */}
        <div className='flex flex-1 flex-col'>
          <span className='text-sm font-medium'>
            {shippingOrder.orderCode ?? `SO-${shippingOrder.id}`}
          </span>
          <span className='text-muted-foreground text-xs'>
            {format(new Date(shippingOrder.createdAt), 'dd/MM/yyyy · HH:mm')}
          </span>
        </div>

        {/* dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-6 w-6 p-0'>
              <IconDotsVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => handleAction('view')}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('edit')}>
              Điều chỉnh
            </DropdownMenuItem>
            {dynamic && (
              <DropdownMenuItem onClick={() => handleAction(dynamic.id)}>
                {dynamic.label}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* ── BODY ── */}
      <CardContent className='space-y-3 text-sm'>
        {/* Route */}
        <div className='flex items-center gap-1'>
          <IconSend size={14} className='text-muted-foreground' />
          <span>
            {shippingOrder.carrier?.name}: {shippingOrder.senderInfo.city?.name}{' '}
            → {shippingOrder.receiverInfo.city?.name}
          </span>
        </div>

        {/* Parties */}
        <div className='flex flex-col gap-1 pl-[22px]'>
          <div className='flex items-center gap-1'>
            <IconUser size={12} />
            <span className='max-w-[220px] truncate'>
              {shippingOrder.senderInfo.name} ({shippingOrder.senderInfo.phone})
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <IconUser size={12} />
            <span className='max-w-[220px] truncate'>
              {shippingOrder.receiverInfo.name} (
              {shippingOrder.receiverInfo.phone})
            </span>
          </div>
        </div>

        <hr className='border-muted/30' />

        {/* Metrics */}
        <div className='flex flex-wrap gap-4 text-xs'>
          <span className='flex items-center gap-1'>
            <IconPackage size={12} />
            {shippingOrder.totalWeightKg?.toFixed(1) ?? 0} kg
          </span>
          <span className='flex items-center gap-1'>
            💰 {shippingOrder.totalAmount?.toLocaleString('vi-VN') ?? 0} ₫
          </span>
          <span className='flex items-center gap-1'>
            📦 {shippingOrder.goods.length} kiện
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
