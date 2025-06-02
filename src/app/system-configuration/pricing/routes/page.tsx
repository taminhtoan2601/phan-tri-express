/**
 * Routes Configuration Page
 * Manages the shipping routes used in the system
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoutes,
  getCountries,
  createRoute,
  updateRoute,
  deleteRoute
} from '@/lib/api/system-configuration-api';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { Route, Country, City, Zone } from '@/types/system-configuration';
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
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for route form
 */
interface RouteFormData {
  id?: number;
  originCountryId: number | string;
  originCityId: number | string;
  destinationCountryId: number | string;
  destinationCityId: number | string;
  zoneId: number | string;
}

// API functions are imported from system-configuration-api.ts

/**
 * Routes configuration page component
 */
export default function RoutesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [formData, setFormData] = useState<RouteFormData>({
    originCountryId: '',
    originCityId: '',
    destinationCountryId: '',
    destinationCityId: '',
    zoneId: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch routes data
  const { data: routes, isPending: isPendingRoutes } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: getRoutes
  });

  // Fetch countries for selection
  const { data: countries, isPending: isPendingCountries } = useQuery<
    Country[]
  >({
    queryKey: ['countries'],
    queryFn: getCountries
  });

  // Fetch cities for selection
  const { data: cities, isPending: isPendingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      // Tạm thời dùng dữ liệu mẫu
      const response = await fetch('/api/cities');
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      return response.json();
    }
  });

  // Fetch zones for selection
  const { data: zones, isPending: isPendingZones } = useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      // Tạm thời dùng dữ liệu mẫu
      const response = await fetch('/api/zones');
      if (!response.ok) {
        throw new Error('Failed to fetch zones');
      }
      return response.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route created successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create route: ${error.message}`);
    }
  });

  // Mutation for updating a route
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Route> }) =>
      updateRoute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route updated successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update route: ${error.message}`);
    }
  });

  // Mutation for deleting a route
  const deleteMutation = useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete route: ${error.message}`);
    }
  });

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.originCountryId ||
      !formData.originCityId ||
      !formData.destinationCountryId ||
      !formData.destinationCityId ||
      !formData.zoneId
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    const routeData = {
      originCountryId: Number(formData.originCountryId),
      originCityId: Number(formData.originCityId),
      destinationCountryId: Number(formData.destinationCountryId),
      destinationCityId: Number(formData.destinationCityId),
      zoneId: Number(formData.zoneId)
    };

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: routeData
      });
    } else {
      createMutation.mutate(routeData);
    }
  };

  /**
   * Opens the drawer for adding a new route
   */
  const handleAdd = () => {
    setFormData({
      originCountryId: '',
      originCityId: '',
      destinationCountryId: '',
      destinationCityId: '',
      zoneId: ''
    });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  /**
   * Opens the drawer for editing an existing route
   */
  const handleEdit = (route: Route) => {
    setFormData({
      id: route.id,
      originCountryId: route.originCountryId,
      originCityId: route.originCityId,
      destinationCountryId: route.destinationCountryId,
      destinationCityId: route.destinationCityId,
      zoneId: route.zoneId
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  /**
   * Handles route deletion
   */
  const handleDelete = (route: Route) => {
    if (window.confirm(`Are you sure you want to delete this route?`)) {
      deleteMutation.mutate(route.id);
    }
  };

  /**
   * Closes the drawer and resets form
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      originCountryId: '',
      originCityId: '',
      destinationCountryId: '',
      destinationCityId: '',
      zoneId: ''
    });
    setIsEditing(false);
  };

  // Helper functions to get country, city and zone names
  const getCountryName = (countryId: number) => {
    if (!countries || countries.length === 0) return 'Unknown';
    const country = countries.find((c: Country) => c.id === countryId);
    return country ? country.name : 'Unknown';
  };

  const getCityName = (cityId: number) => {
    if (!cities || cities.length === 0) return 'Unknown';
    const city = cities.find((c: City) => c.id === cityId);
    return city ? city.name : 'Unknown';
  };

  const getZoneName = (zoneId: number) => {
    if (!zones || zones.length === 0) return 'Unknown';
    const zone = zones.find((z: Zone) => z.id === zoneId);
    return zone ? zone.name : 'Unknown';
  };

  // Column configuration for the data table
  const columns = [
    { key: 'id', header: 'ID' },
    {
      key: 'originCountry',
      header: 'Origin Country',
      render: (route: Route) => getCountryName(route.originCountryId)
    },
    {
      key: 'originCity',
      header: 'Origin City',
      render: (route: Route) => getCityName(route.originCityId)
    },
    {
      key: 'destinationCountry',
      header: 'Destination Country',
      render: (route: Route) => getCountryName(route.destinationCountryId)
    },
    {
      key: 'destinationCity',
      header: 'Destination City',
      render: (route: Route) => getCityName(route.destinationCityId)
    },
    {
      key: 'zone',
      header: 'Zone',
      render: (route: Route) => getZoneName(route.zoneId)
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (route: Route) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(route)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(route)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  const isPending =
    isPendingRoutes || isPendingCountries || isPendingCities || isPendingZones;

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Routes</h1>
        <p className='text-muted-foreground'>
          Manage shipping routes between branches and countries
        </p>
      </div>

      <DataTable
        data={routes || []}
        columns={columns}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={isEditing ? 'Edit Route' : 'Add New Route'}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='originCountryId'>Origin Country</Label>
            <Select
              value={formData.originCountryId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, originCountryId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select origin country' />
              </SelectTrigger>
              <SelectContent>
                {countries && countries.length > 0 ? (
                  countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no_country' disabled>
                    No countries available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='originCityId'>Origin City</Label>
            <Select
              value={formData.originCityId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, originCityId: value })
              }
              disabled={!formData.originCountryId}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select origin city' />
              </SelectTrigger>
              <SelectContent>
                {cities && cities.length > 0 ? (
                  cities
                    .filter(
                      (city: City) =>
                        city.countryId.toString() ===
                        formData.originCountryId.toString()
                    )
                    .map((city: City) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value='no_city' disabled>
                    No cities available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='destinationCountryId'>Destination Country</Label>
            <Select
              value={formData.destinationCountryId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, destinationCountryId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select destination country' />
              </SelectTrigger>
              <SelectContent>
                {countries && countries.length > 0 ? (
                  countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no_country' disabled>
                    No countries available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='destinationCityId'>Destination City</Label>
            <Select
              value={formData.destinationCityId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, destinationCityId: value })
              }
              disabled={!formData.destinationCountryId}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select destination city' />
              </SelectTrigger>
              <SelectContent>
                {cities && cities.length > 0 ? (
                  cities
                    .filter(
                      (city: City) =>
                        city.countryId.toString() ===
                        formData.destinationCountryId.toString()
                    )
                    .map((city: City) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value='no_city' disabled>
                    No cities available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='zoneId'>Zone</Label>
            <Select
              value={formData.zoneId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, zoneId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select zone' />
              </SelectTrigger>
              <SelectContent>
                {zones && zones.length > 0 ? (
                  zones.map((zone: Zone) => (
                    <SelectItem key={zone.id} value={zone.id.toString()}>
                      {zone.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no_zone' disabled>
                    No zones available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            type='submit'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : isEditing
                ? 'Update'
                : 'Create'}
          </Button>
        </form>
      </DataDrawer>
    </div>
  );
}
