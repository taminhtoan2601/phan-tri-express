/**
 * Prices Configuration Page
 * Manages base pricing rates for routes and services
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import {
  Price,
  Route,
  ShippingService,
  Country,
  City
} from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  fakePrices,
  fakeRoutes,
  fakeShippingServices,
  fakeCountries,
  fakeCities
} from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for price form
 */
interface PriceFormData {
  id?: number;
  routeId: string;
  serviceId: string;
  baseRatePerKg: string;
}

/**
 * API functions for Prices
 */
const getPrices = async (): Promise<Price[]> => {
  return fakePrices.getAll();
};

const getRoutes = async (): Promise<Route[]> => {
  return fakeRoutes.getAll();
};

const getShippingServices = async (): Promise<ShippingService[]> => {
  return fakeShippingServices.getAll();
};

const getCountries = async (): Promise<Country[]> => {
  return fakeCountries.getAll();
};

const getCities = async (): Promise<City[]> => {
  return fakeCities.getAll();
};

const createPrice = async (data: Omit<Price, 'id'>): Promise<Price> => {
  return fakePrices.create({
    ...data,
    routeId: Number(data.routeId),
    serviceId: Number(data.serviceId),
    baseRatePerKg: Number(data.baseRatePerKg)
  });
};

const updatePrice = async (
  id: number,
  data: Partial<Price>
): Promise<Price> => {
  const updateData = { ...data };

  if (typeof data.routeId === 'string') {
    updateData.routeId = Number(data.routeId);
  }

  if (typeof data.serviceId === 'string') {
    updateData.serviceId = Number(data.serviceId);
  }

  if (typeof data.baseRatePerKg === 'string') {
    updateData.baseRatePerKg = Number(data.baseRatePerKg);
  }

  return fakePrices.update(id, updateData);
};

const deletePrice = async (id: number): Promise<void> => {
  return fakePrices.delete(id);
};

/**
 * Prices configuration page component
 */
export default function PricesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<PriceFormData>({
    routeId: '',
    serviceId: '',
    baseRatePerKg: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch prices data
  const { data: pricesData, isPending: isPendingPrices } = useQuery({
    queryKey: ['prices'],
    queryFn: getPrices
  });

  // Fetch routes data for selection
  const { data: routesData, isPending: isPendingRoutes } = useQuery({
    queryKey: ['routes'],
    queryFn: getRoutes
  });

  // Fetch services data for selection
  const { data: servicesData, isPending: isPendingServices } = useQuery({
    queryKey: ['shippingServices'],
    queryFn: getShippingServices
  });

  // Fetch countries data for route display
  const { data: countriesData, isPending: isPendingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries
  });

  // Fetch cities data for route display
  const { data: citiesData, isPending: isPendingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities
  });

  // Mutation for creating a new price
  const createMutation = useMutation({
    mutationFn: createPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast.success('Price created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to create price: ${error.message}`);
    }
  });

  // Mutation for updating a price
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Price> }) =>
      updatePrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast.success('Price updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to update price: ${error.message}`);
    }
  });

  // Mutation for deleting a price
  const deleteMutation = useMutation({
    mutationFn: deletePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast.success('Price deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete price: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      routeId: '',
      serviceId: '',
      baseRatePerKg: ''
    });
    setIsEditing(false);
  };

  /**
   * Handle adding a new price
   */
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      routeId: '',
      serviceId: '',
      baseRatePerKg: ''
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing price
   * @param price Price to edit
   */
  const handleEdit = (price: Price) => {
    setIsEditing(true);
    setFormData({
      id: price.id,
      routeId: price.routeId.toString(),
      serviceId: price.serviceId.toString(),
      baseRatePerKg: price.baseRatePerKg.toString()
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a price
   * @param price Price to delete
   */
  const handleDelete = (price: Price) => {
    if (window.confirm('Are you sure you want to delete this price?')) {
      deleteMutation.mutate(price.id);
    }
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.routeId) {
      toast.error('Route is required');
      return;
    }

    if (!formData.serviceId) {
      toast.error('Service is required');
      return;
    }

    if (
      !formData.baseRatePerKg ||
      isNaN(Number(formData.baseRatePerKg)) ||
      Number(formData.baseRatePerKg) <= 0
    ) {
      toast.error('Base rate must be a positive number');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          routeId: Number(formData.routeId),
          serviceId: Number(formData.serviceId),
          baseRatePerKg: Number(formData.baseRatePerKg)
        }
      });
    } else {
      createMutation.mutate({
        routeId: Number(formData.routeId),
        serviceId: Number(formData.serviceId),
        baseRatePerKg: Number(formData.baseRatePerKg)
      });
    }
  };

  /**
   * Handle input change in the form
   * @param e Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to get route description
  const getRouteDescription = (routeId: number) => {
    if (!routesData || !countriesData || !citiesData) return 'Unknown Route';

    const route = routesData.find((r: Route) => r.id === routeId);
    if (!route) return 'Unknown Route';

    const originCountry = countriesData.find(
      (c: Country) => c.id === route.originCountryId
    );
    const originCity = citiesData.find(
      (c: City) => c.id === route.originCityId
    );
    const destCountry = countriesData.find(
      (c: Country) => c.id === route.destinationCountryId
    );
    const destCity = citiesData.find(
      (c: City) => c.id === route.destinationCityId
    );

    return `${originCity?.name || 'Unknown'}, ${originCountry?.code2 || '??'} → ${destCity?.name || 'Unknown'}, ${destCountry?.code2 || '??'}`;
  };

  // Helper function to get service name
  const getServiceName = (serviceId: number) => {
    if (!servicesData) return 'Unknown Service';
    const service = servicesData.find(
      (s: ShippingService) => s.id === serviceId
    );
    return service ? service.name : 'Unknown Service';
  };

  // Define columns for the data table
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (price: Price) => <span>{price.id}</span>
    },
    {
      key: 'route',
      header: 'Route',
      render: (price: Price) => (
        <span>{getRouteDescription(price.routeId)}</span>
      )
    },
    {
      key: 'service',
      header: 'Service',
      render: (price: Price) => <span>{getServiceName(price.serviceId)}</span>
    },
    {
      key: 'baseRatePerKg',
      header: 'Base Rate/kg',
      render: (price: Price) => <span>${price.baseRatePerKg.toFixed(2)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (price: Price) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(price)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(price)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  const isPending =
    isPendingPrices ||
    isPendingRoutes ||
    isPendingServices ||
    isPendingCountries ||
    isPendingCities;

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Prices</h1>
        <p className='text-muted-foreground'>
          Manage base pricing rates for routes and service levels
        </p>
      </div>

      <DataTable
        columns={columns}
        data={pricesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Edit Price' : 'Add Price'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='routeId'>Route</Label>
            <Select
              value={formData.routeId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, routeId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a route' />
              </SelectTrigger>
              <SelectContent>
                {routesData && routesData.length > 0 ? (
                  routesData.map((route: Route) => (
                    <SelectItem key={route.id} value={route.id.toString()}>
                      {getRouteDescription(route.id)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no_route' disabled>
                    No routes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='serviceId'>Service</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, serviceId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a service' />
              </SelectTrigger>
              <SelectContent>
                {servicesData && servicesData.length > 0 ? (
                  servicesData.map((service: ShippingService) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} (×{service.multiplier.toFixed(2)})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no_service' disabled>
                    No services available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='baseRatePerKg'>Base Rate per kg ($)</Label>
            <Input
              id='baseRatePerKg'
              name='baseRatePerKg'
              type='number'
              value={formData.baseRatePerKg}
              onChange={handleInputChange}
              placeholder='Base rate per kg in USD'
              min='0.01'
              step='0.01'
            />
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={closeDrawer}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : 'Save'}
            </Button>
          </div>
        </form>
      </DataDrawer>
    </div>
  );
}
