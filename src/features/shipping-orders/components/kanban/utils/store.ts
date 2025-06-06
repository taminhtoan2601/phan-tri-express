import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';
import { ShippingOrder } from '@/types/shipping-order';

export type State = {
  shippingOrders: ShippingOrder[];
  columns: Column[];
  draggedTask: string | null;
};

export type Actions = {
  addCol: (title: string) => void;
  dragShippingOrder: (id: string | null) => void;
  removeShippingOrder: (title: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setShippingOrders: (updatedTask: ShippingOrder[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
};

export const useShippingOrderStore = create<State & Actions>()(
  persist(
    (set) => ({
      shippingOrders: [],
      columns: [],
      draggedTask: null,
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title: newName } : col
          )
        })),
      addCol: (title: string) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { title, id: state.columns.length ? title.toUpperCase() : uuid() }
          ]
        })),
      dragShippingOrder: (id: string | null) => set({ draggedTask: id }),
      removeShippingOrder: (id: string) =>
        set((state) => ({
          shippingOrders: state.shippingOrders.filter(
            (order) => order.id.toString() !== id
          )
        })),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id)
        })),
      setShippingOrders: (newTasks: ShippingOrder[]) =>
        set({ shippingOrders: newTasks }),
      setCols: (newCols: Column[]) => set({ columns: newCols })
    }),
    { name: 'shipping-order-store', skipHydration: true }
  )
);
