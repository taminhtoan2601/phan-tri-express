import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import type { RequestHandler } from 'msw';
import { delay } from '@/constants/mock-api';
import {
  fakeCountries,
  fakeBranches,
  fakeCommodityTypes,
  fakeShippingTypes,
  fakePaymentTypes,
  fakeRoutes,
  fakeCarriers,
  fakeInsurancePackages,
  fakePrices,
  fakeSurchargeTypes,
  initializeSystemConfigData
} from '@/constants/mock-system-config';

// Initialize all mock data
initializeSystemConfigData();

// Worker instance
let worker: ReturnType<typeof setupWorker> | null = null;

// Helper function to handle common response patterns
const createHandlers = <T extends { id: number }>(
  basePath: string,
  store: {
    getAll: () => Promise<T[]>;
    getById: (id: number) => Promise<T | undefined>;
    create: (data: Omit<T, 'id'>) => Promise<T>;
    update: (id: number, data: Partial<T>) => Promise<T>;
    delete: (id: number) => Promise<void>;
  }
): RequestHandler[] => {
  return [
    // GET all items
    http.get(`/api/${basePath}`, async () => {
      try {
        const data = await store.getAll();
        await delay(500);
        return HttpResponse.json(data);
      } catch (error) {
        await delay(500);
        return new HttpResponse(JSON.stringify({ message: 'Server error' }), {
          status: 500
        });
      }
    }),

    // GET item by ID
    http.get(`/api/${basePath}/:id`, async ({ params }) => {
      try {
        const id = parseInt(params.id as string);
        const item = await store.getById(id);

        await delay(500);
        if (!item) {
          return new HttpResponse(
            JSON.stringify({ message: 'Item not found' }),
            { status: 404 }
          );
        }

        return HttpResponse.json(item);
      } catch (error) {
        await delay(500);
        return new HttpResponse(JSON.stringify({ message: 'Server error' }), {
          status: 500
        });
      }
    }),

    // POST create new item
    http.post(`/api/${basePath}`, async ({ request }) => {
      try {
        const data = (await request.json()) as Omit<T, 'id'>;
        const newItem = await store.create(data);
        await delay(500);
        return HttpResponse.json(newItem, { status: 201 });
      } catch (error: any) {
        await delay(500);
        return HttpResponse.json(
          { message: error.message || 'Bad request' },
          { status: 400 }
        );
      }
    }),

    // PUT update item
    http.put(`/api/${basePath}/:id`, async ({ params, request }) => {
      try {
        const id = parseInt(params.id as string);
        const data = (await request.json()) as Partial<T>;
        const item = await store.getById(id);

        await delay(500);
        if (!item) {
          return HttpResponse.json(
            { message: 'Item not found' },
            { status: 404 }
          );
        }

        const updatedItem = await store.update(id, data);
        return HttpResponse.json(updatedItem);
      } catch (error: any) {
        await delay(500);
        if (error.message?.includes('not found')) {
          return HttpResponse.json({ message: error.message }, { status: 404 });
        }
        return HttpResponse.json(
          { message: error.message || 'Bad request' },
          { status: 400 }
        );
      }
    }),

    // DELETE item
    http.delete(`/api/${basePath}/:id`, async ({ params }) => {
      try {
        const id = parseInt(params.id as string);
        await store.delete(id);
        await delay(500);
        return new HttpResponse(null, { status: 204 });
      } catch (error: any) {
        await delay(500);
        if (error.message?.includes('not found')) {
          return HttpResponse.json({ message: error.message }, { status: 404 });
        }
        return HttpResponse.json(
          { message: error.message || 'Bad request' },
          { status: 400 }
        );
      }
    })
  ];
};

// Create all handlers
const handlers = [
  ...createHandlers('countries', fakeCountries),
  ...createHandlers('branches', fakeBranches),
  ...createHandlers('commodity-types', fakeCommodityTypes),
  ...createHandlers('shipping-types', fakeShippingTypes),
  ...createHandlers('payment-types', fakePaymentTypes),
  ...createHandlers('routes', fakeRoutes),
  ...createHandlers('carriers', fakeCarriers),
  ...createHandlers('insurance-packages', fakeInsurancePackages),
  ...createHandlers('prices', fakePrices),
  ...createHandlers('surcharge-types', fakeSurchargeTypes)
];

/**
 * Start the mock server
 */
export const startMockServer = () => {
  if (typeof window === 'undefined') return;

  if (!worker) {
    worker = setupWorker(...handlers);
  }

  worker.start({
    onUnhandledRequest:
      process.env.NODE_ENV === 'development' ? 'warn' : 'bypass'
  });
};

/**
 * Stop the mock server
 */
export const stopMockServer = () => {
  if (typeof window === 'undefined') return;

  if (worker) {
    worker.stop();
  }
};
