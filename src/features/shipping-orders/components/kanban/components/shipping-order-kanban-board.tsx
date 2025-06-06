'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShippingOrderStore } from '../utils/store';
import { hasDraggableData } from '../utils';
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import { ShippingOrderCard } from './shipping-order-card';
import { ShippingOrder } from '@/types/shipping-order';
import { ShippingOrderStatus } from '@/types/enums';
import { fakeShippingOrders } from '@/constants/mock-shipping-orders';
import { shippingOrders } from '@/data';
import { useQuery } from '@tanstack/react-query';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { Input } from '@/components/ui/input'; // ⬅️ không phải diceui
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

const defaultCols: Column[] = [
  { id: ShippingOrderStatus.Draft, title: 'Đang Chờ' },
  { id: ShippingOrderStatus.PendingForApproval, title: 'Đang Xét Duyệt' },
  { id: ShippingOrderStatus.Approved, title: 'Đã Duyệt' },
  { id: ShippingOrderStatus.DocsVerified, title: 'Đã Xác Nhận Chứng Từ' },
  { id: ShippingOrderStatus.EntryInWarehouse, title: 'Nhập/xuất Kho' },
  { id: ShippingOrderStatus.ReadyToExport, title: 'Chuẩn bị Xuất' },
  { id: ShippingOrderStatus.InTransit, title: 'Đang Vận Chuyển' },
  { id: ShippingOrderStatus.Delivered, title: 'Đã Giao' },
  { id: ShippingOrderStatus.Cancelled, title: 'Đã Hủy' }
];

type OrderFilters = {
  search?: string;
  sort?: string[];
  page: number;
  perPage: number;
  statuses?: ShippingOrderStatus[]; // ← thêm
};

export const getShippingOrders = async (filters: OrderFilters) => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Simulate API fetch delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get all branches
  let ordersData = await fakeShippingOrders.getAll();
  if (!ordersData || ordersData.length === 0) {
    fakeShippingOrders.initialize();
    ordersData = await fakeShippingOrders.getAll();
  }

  // Apply filtering
  let filteredOrders = [...ordersData];

  // Apply filters if present
  if (filters) {
    /* ---- filter theo trạng thái ---- */
    if (filters.statuses?.length) {
      ordersData = ordersData.filter((o) =>
        filters.statuses!.includes(o.status)
      );
    }

    // Helper function to safely get branch property values
    const getShippingOrderProperty = (
      order: ShippingOrder,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return order.id;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredOrders.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getShippingOrderProperty(a, field);
        const bValue = getShippingOrderProperty(b, field);

        if (aValue < bValue) return -1 * multiplier;
        if (aValue > bValue) return 1 * multiplier;
        return 0;
      });
    }
  }

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.perPage || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return {
    orders: paginatedOrders,
    total: filteredOrders.length
  };
};

export function ShippingOrderKanbanBoard({
  statusCols
}: {
  statusCols: ShippingOrderStatus[];
}) {
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columns = useShippingOrderStore((state) => state.columns);
  const setColumns = useShippingOrderStore((s) => s.setCols);

  /* DS cột đúng thứ tự statusCols */
  /* DS cột đúng thứ tự statusCols */
  const kanbanCols = useMemo(() => {
    const map = new Map(defaultCols.map((c) => [c.id, c]));
    return statusCols
      .map((id) => map.get(id as unknown as ShippingOrderStatus))
      .filter(Boolean) as Column[];
  }, [statusCols]);

  /* Ghi vào Zustand khi prop đổi */
  useEffect(() => {
    setColumns(kanbanCols);
  }, [kanbanCols, setColumns]);
  const pickedUpShippingOrderColumn = useRef<ShippingOrderStatus>(
    ShippingOrderStatus.Draft
  );
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(10)
  );
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(''));
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

  // const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState({
    search,
    sort: sort ? [sort] : undefined,
    page,
    perPage,
    statuses: statusCols as unknown as ShippingOrderStatus[] // truyền xuống API
  });

  const setShippingOrders = useShippingOrderStore((s) => s.setShippingOrders);

  const { data, isPending } = useQuery({
    queryKey: ['shipping-orders', filters] as const,
    queryFn: () => getShippingOrders(filters),
    staleTime: 1000 * 30 // 30s
  });
  useEffect(() => {
    if (data) setShippingOrders(data.orders);
  }, [data]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const [activeTask, setActiveTask] = useState<ShippingOrder | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    useShippingOrderStore.persist.rehydrate();
  }, []);
  if (!isMounted) return;

  function getDraggingShippingOrderData(
    shippingOrderId: UniqueIdentifier,
    columnId: ShippingOrderStatus
  ) {
    const shippingOrdersInColumn = shippingOrders.filter(
      (o) => o.status === columnId
    );
    const taskPosition = shippingOrdersInColumn.findIndex(
      (task) => task.id.toString() === shippingOrderId
    );
    const column = columns.find((col) => col.id === columnId);
    return {
      shippingOrdersInColumn,
      taskPosition,
      column
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'ShippingOrder') {
        pickedUpShippingOrderColumn.current =
          active.data.current.shippingOrder.status;
        const { shippingOrdersInColumn, taskPosition, column } =
          getDraggingShippingOrderData(
            active.id,
            pickedUpShippingOrderColumn.current
          );
        return `Picked up shipping order ${active.data.current.shippingOrder.id} at position: ${
          taskPosition + 1
        } of ${shippingOrdersInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;
      if (
        active.data.current?.type === 'ShippingOrder' &&
        over.data.current?.type === 'ShippingOrder'
      ) {
        const { shippingOrdersInColumn, taskPosition, column } =
          getDraggingShippingOrderData(
            over.id,
            over.data.current.shippingOrder.status
          );
        if (
          over.data.current.shippingOrder.status !==
          pickedUpShippingOrderColumn.current
        ) {
          return `Shipping order ${
            active.data.current.shippingOrder.id
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${shippingOrdersInColumn.length}`;
        }
        return `Shipping order was moved over position ${taskPosition + 1} of ${
          shippingOrdersInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpShippingOrderColumn.current = ShippingOrderStatus.Draft;
        return;
      }
      if (
        active.data.current?.type === 'ShippingOrder' &&
        over.data.current?.type === 'ShippingOrder'
      ) {
        const { shippingOrdersInColumn, taskPosition, column } =
          getDraggingShippingOrderData(
            over.id,
            over.data.current.shippingOrder.status
          );
        if (
          over.data.current.shippingOrder.status !==
          pickedUpShippingOrderColumn.current
        ) {
          return `Shipping order was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${shippingOrdersInColumn.length}`;
        }
        return `Shipping order was dropped into position ${taskPosition + 1} of ${
          shippingOrdersInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpShippingOrderColumn.current = ShippingOrderStatus.Draft;
    },
    onDragCancel({ active }) {
      pickedUpShippingOrderColumn.current = ShippingOrderStatus.Draft;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
  };

  return (
    <DndContext
      accessibility={{
        announcements
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className='mb-4 flex flex-wrap items-center gap-2 border-b pb-3'>
        {/* SEARCH */}
        <Input
          placeholder='Tìm mã đơn, khách hàng...'
          className='w-60'
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === 'Enter')
              setSearch((e.target as HTMLInputElement).value || null);
          }}
        />

        {/* SORT (ví dụ theo id asc/desc) */}
        <Select
          value={sort || undefined} // undefined = chưa chọn
          onValueChange={(v) => setSort(v || null)} // clear = placeholder
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Mặc định' />
          </SelectTrigger>

          <SelectContent>
            {/* Bỏ item rỗng */}
            <SelectItem value='id.asc'>ID ↑</SelectItem>
            <SelectItem value='id.desc'>ID ↓</SelectItem>
          </SelectContent>
        </Select>

        {/* PAGE SIZE */}
        <Select
          value={`${perPage}`}
          onValueChange={(v) => setPerPage(Number(v))}
        >
          <SelectTrigger style={{ width: '120px' }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50].map((n) => (
              <SelectItem key={n} value={`${n}`}>
                {n}/trang
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* PAGINATION BUTTONS */}
        <div className='ml-auto flex items-center gap-1'>
          <button
            disabled={page === 1 || isPending}
            className='hover:bg-muted rounded px-3 py-1 disabled:opacity-40'
            onClick={() => setPage(page - 1)}
          >
            ‹
          </button>
          <span className='mx-1 text-sm'>
            Trang {page} /{' '}
            {Math.max(1, Math.ceil((data?.total ?? 0) / perPage))}
          </span>
          <button
            disabled={
              page >= Math.ceil((data?.total ?? 0) / perPage) || isPending
            }
            className='hover:bg-muted rounded px-3 py-1 disabled:opacity-40'
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>
        </div>
      </div>
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns?.map((col) => (
            <Fragment key={col.id}>
              <BoardColumn
                column={col}
                shippingOrders={shippingOrders.filter(
                  (o) => o.status === col.id
                )}
              />
            </Fragment>
          ))}
          {!columns.length && <NewSectionDialog />}
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                column={activeColumn}
                shippingOrders={shippingOrders.filter(
                  (o) => o.status === activeColumn.id
                )}
              />
            )}
            {activeTask && <ShippingOrderCard shippingOrder={activeTask} />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'ShippingOrder') {
      setActiveTask(data.shippingOrder);
      return;
    }

    if (data?.type === 'ShippingOrder') {
      setActiveTask(data.shippingOrder);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAShippingOrder = activeData?.type === 'ShippingOrder';
    if (!isActiveAShippingOrder) return;

    const activeShippingOrderIndex = shippingOrders.findIndex(
      (o) => o.id === activeId
    );

    const overShippingOrderIndex = shippingOrders.findIndex(
      (o) => o.id === overId
    );

    setShippingOrders(
      arrayMove(
        shippingOrders,
        activeShippingOrderIndex,
        overShippingOrderIndex
      )
    );
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'ShippingOrder';
    const isOverATask = overData?.type === 'ShippingOrder';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = shippingOrders.findIndex((t) => t.id === activeId);
      const overIndex = shippingOrders.findIndex((t) => t.id === overId);
      const activeTask = shippingOrders[activeIndex];
      const overTask = shippingOrders[overIndex];
      if (activeTask && overTask && activeTask.status !== overTask.status) {
        activeTask.status = overTask.status;
        setShippingOrders(
          arrayMove(shippingOrders, activeIndex, overIndex - 1)
        );
      }

      setShippingOrders(arrayMove(shippingOrders, activeIndex, overIndex));
    }

    const isOverAShippingOrder = overData?.type === 'ShippingOrder';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAShippingOrder) {
      const activeIndex = shippingOrders.findIndex((t) => t.id === activeId);
      const activeTask = shippingOrders[activeIndex];
      if (activeTask) {
        activeTask.status = overId as ShippingOrderStatus;
        setShippingOrders(arrayMove(shippingOrders, activeIndex, activeIndex));
      }
    }
  }
}
