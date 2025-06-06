'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  useFieldArray,
  useForm,
  Controller,
  useWatch,
  FieldErrors
} from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, PlusCircle, Trash2 } from 'lucide-react';
import type {
  City,
  Branch,
  CommodityType,
  Route,
  ShippingType,
  PaymentType,
  // Customer, // Customer is imported from shipping-orders/types
  InsurancePackage,
  SurchargeType,
  Carrier,
  Price,
  ShippingService
} from '@/types/system-configuration';
import {
  getBranches,
  getCommodityTypes,
  getPaymentTypes,
  getShippingTypes,
  getRoutes,
  getCarriers,
  getInsurancePackages,
  getSurchargeTypes,
  getCities,
  getPrices,
  getShippingServices
} from '@/lib/api/mock-system-configuration-api';
import { getCustomers } from '@/lib/api/mock-customers-api';
import { useEffect, useState } from 'react';
import { ShippingOrderStatus } from '@/types/enums';
import { Customer } from '@/types/customer';
import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxSeparator,
  ComboboxTrigger
} from '@/components/ui/combobox';
import React from 'react';
import { useRouter } from 'next/navigation';

// Zod Schema for validation
const customerSchema = z
  .object({
    customerId: z.number().optional(),
    name: z.string().optional(),
    email: z.string().email('Email không hợp lệ khi được cung cấp').optional(),
    phone: z.string().optional(),
    countryId: z.coerce
      .number({ invalid_type_error: 'ID quốc gia không hợp lệ' })
      .optional(),
    cityId: z.coerce
      .number({ invalid_type_error: 'ID thành phố không hợp lệ' })
      .optional(),
    postal: z.string().optional(),
    address: z.string().optional(),
    note: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (!data.customerId) {
      // If it's a new customer (no customerId selected)
      if (!data.name || data.name.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['name'],
          message: 'Tên không được để trống'
        });
      }
      if (!data.phone || data.phone.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: 'Số điện thoại không được để trống'
        });
      }
      if (
        data.cityId === undefined ||
        data.cityId === null ||
        data.cityId <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cityId'],
          message: 'Vui lòng chọn thành phố'
        });
      }
      if (!data.address || data.address.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address'],
          message: 'Địa chỉ không được để trống'
        });
      }
    }
  });

const surchargeItemSchema = z.object({
  // This id is for the surcharge data object itself, can be a temporary client-side id.
  // React Hook Form's useFieldArray will provide a separate 'field.id' for keying in loops.
  id: z.union([z.string(), z.number()]).optional(), // Allow string for UUIDs or number for simple counters
  surchargeTypeId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn loại phụ phí' })
    .min(1, 'Vui lòng chọn loại phụ phí'),
  amount: z.coerce
    .number({
      invalid_type_error: 'Số tiền phụ phí phải là số',
      required_error: 'Vui lòng nhập số tiền phụ phí'
    })
    .min(0, 'Số tiền phụ phí không được âm')
});

const goodsItemSchema = z.object({
  commodityTypeId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn loại hàng hóa' })
    .min(1, 'Vui lòng chọn loại hàng hóa'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  lengthCm: z.coerce.number().positive('Chiều dài phải lớn hơn 0'),
  widthCm: z.coerce.number().positive('Chiều rộng phải lớn hơn 0'),
  heightCm: z.coerce.number().positive('Chiều cao phải lớn hơn 0'),
  weightKg: z.coerce.number().positive('Cân nặng phải lớn hơn 0'),
  quantity: z.coerce
    .number()
    .int()
    .positive('Số lượng phải là số nguyên dương'),
  unitPrice: z.coerce
    .number()
    .min(0, 'Đơn giá không được âm')
    .optional()
    .default(0),
  qualityNote: z.string().optional()
});

const insuranceDetailSchema = z
  .object({
    insurancePackageId: z.coerce
      .number({ invalid_type_error: 'Vui lòng chọn gói bảo hiểm' })
      .min(1, 'Vui lòng chọn gói bảo hiểm'),
    declaredValue: z.preprocess(
      (val) =>
        val === null || val === undefined || val === '' ? 0 : Number(val),
      z.coerce.number().min(0, 'Giá trị khai báo không được âm')
    ),
    insuranceFee: z.coerce.number().optional() // Calculated field
  })
  .optional();

const createShippingOrderSchema = z.object({
  branchId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn chi nhánh' })
    .min(1, 'Vui lòng chọn chi nhánh'),
  shippingServiceId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn dịch vụ vận chuyển' })
    .min(1, 'Vui lòng chọn dịch vụ vận chuyển'),
  shippingTypeId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn loại hình vận chuyển' })
    .min(1, 'Vui lòng chọn loại hình vận chuyển'),
  paymentTypeId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn hình thức thanh toán' })
    .min(1, 'Vui lòng chọn hình thức thanh toán'),
  routeId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn tuyến đường' })
    .min(1, 'Vui lòng chọn tuyến đường'),
  carrierId: z.coerce
    .number({ invalid_type_error: 'Vui lòng chọn hãng vận chuyển' })
    .min(1, 'Vui lòng chọn hãng vận chuyển'),
  branchDiscount: z.coerce.number().min(0).optional(),
  senderId: z.coerce.number().optional(),
  receiverId: z.coerce.number().optional(),
  senderInfo: customerSchema,
  receiverInfo: customerSchema,
  goods: z.array(goodsItemSchema).min(1, 'Phải có ít nhất một mặt hàng'),
  insurance: insuranceDetailSchema,
  surcharges: z.array(surchargeItemSchema).optional(),
  volumetricDivisor: z.number()
});

type CreateShippingOrderFormValues = z.infer<typeof createShippingOrderSchema>;

const initialDefaultValues = {
  branchId: undefined,
  shippingServiceId: undefined,
  shippingTypeId: undefined,
  paymentTypeId: undefined,
  routeId: undefined,
  carrierId: undefined,
  volumetricDivisor: 5000,
  senderId: undefined,
  senderInfo: {
    name: '',
    email: '',
    phone: '',
    cityId: undefined,
    address: '',
    postal: '',
    note: ''
  },
  receiverId: undefined,
  receiverInfo: {
    name: '',
    email: '',
    phone: '',
    cityId: undefined,
    address: '',
    postal: '',
    note: ''
  },
  goods: [],
  insurance: {
    insurancePackageId: undefined,
    declaredValue: 0,
    insuranceFee: 0
  },
  surcharges: []
};
const formatVND = (n?: number) =>
  n === undefined ? '' : n.toLocaleString('vi-VN'); // 12.345.678

export function CreateShippingOrderForm() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [cities, setCities] = useState<City[]>([]); // Will be populated by mockCities
  const [shippingTypes, setShippingTypes] = useState<ShippingType[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [commodityTypes, setCommodityTypes] = useState<CommodityType[]>([]);
  const [insurancePackages, setInsurancePackages] = useState<
    InsurancePackage[]
  >([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [surchargeTypes, setSurchargeTypes] = useState<SurchargeType[]>([]);
  const [shippingServices, setShippingServices] = useState<ShippingService[]>(
    []
  );
  const [prices, setPrices] = useState<Price[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [groupedCities, setGroupedCities] = useState<{ [key: string]: City[] }>(
    {}
  );
  const [senderCityInput, setSenderCityInput] = useState('');
  const [receiverCityInput, setReceiverCityInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          branchesData, // 2
          shippingTypesData, // 3
          paymentTypesData, // 4
          commodityTypesData, // 5
          insurancePackagesData, // 6
          routesData, // 7
          carriersData, // 8
          surchargeTypesData, // 9
          shippingServicesData, // 10
          pricesData, // 11
          customersData, // 12
          citiesData // 13
        ] = await Promise.all([
          getBranches(), // 2
          getShippingTypes(), // 3
          getPaymentTypes(), // 4
          getCommodityTypes(), // 5
          getInsurancePackages(), // 6
          getRoutes(), // 7
          getCarriers(), // 8
          getSurchargeTypes(), // 9
          getShippingServices(), // 10
          getPrices(), // 11
          getCustomers(), // 12
          getCities() // 13
        ]);

        setBranches(branchesData);
        setCities(citiesData); // Populate cities from mock data - this is separate
        setShippingTypes(shippingTypesData);
        setPaymentTypes(paymentTypesData);
        setCommodityTypes(commodityTypesData);
        setInsurancePackages(insurancePackagesData);
        setRoutes(routesData);
        setCarriers(carriersData);
        setSurchargeTypes(surchargeTypesData);
        setShippingServices(shippingServicesData);
        setPrices(pricesData);
        setCustomers(customersData);
        const groupedCities = citiesData.reduce(
          (acc: { [key: string]: City[] }, city: City) => {
            const countryName = city.country?.name;
            if (!countryName) {
              return acc;
            }
            if (!acc[countryName]) {
              acc[countryName] = [];
            }
            acc[countryName].push(city);
            return acc;
          },
          {} as { [key: string]: City[] }
        );
        setGroupedCities(groupedCities);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        // Handle error (e.g., show a notification to the user)
      }
    };
    fetchData();
  }, []);

  const form = useForm<CreateShippingOrderFormValues>({
    resolver: zodResolver(createShippingOrderSchema),
    defaultValues: initialDefaultValues,
    mode: 'onChange' // Validate on change for better UX
  });

  // useFieldArray hooks must be AFTER form initialization
  const {
    fields: goodsItemFields,
    append: appendGoodsItem,
    remove: removeGoodsItem
  } = useFieldArray({
    control: form.control,
    name: 'goods'
  });

  const {
    fields: surchargeItemFields,
    append: appendSurchargeItem,
    remove: removeSurchargeItem
  } = useFieldArray({
    control: form.control,
    name: 'surcharges'
  });

  const insurancePackageId = form.watch('insurance.insurancePackageId');
  const declaredValueForInsurance = form.watch('insurance.declaredValue');

  useEffect(() => {
    if (!insurancePackageId || declaredValueForInsurance === undefined) return;

    const selected = insurancePackages.find((p) => p.id === insurancePackageId);
    const fee = selected
      ? selected.rate * declaredValueForInsurance
      : undefined;

    // Lấy object hiện tại
    const current = form.getValues('insurance') ?? {
      insurancePackageId: 0,
      declaredValue: 0
    };

    // Thay thế hoàn toàn → object reference mới
    form.setValue(
      'insurance',
      {
        ...current,
        insuranceFee: fee,
        insurancePackageId: current.insurancePackageId,
        declaredValue: current.declaredValue
      },
      { shouldValidate: true }
    );
  }, [insurancePackageId, declaredValueForInsurance, insurancePackages, form]);

  // Lấy các giá trị cần theo dõi
  const routeId = form.watch('routeId');
  const shippingServiceId = form.watch('shippingServiceId');
  const volumetricDivisor = form.watch('volumetricDivisor');
  const goodsWatch = useWatch({
    control: form.control,
    name: 'goods' // chỉ vậy thôi
  });

  useEffect(() => {
    // Chỉ tính khi đủ dữ liệu
    if (!routeId || !shippingServiceId || !volumetricDivisor) return;

    // Tìm carrierRate phù hợp (giả sử chọn bản có hiệu lực & chưa xoá)
    const today = new Date();
    const priceRow = prices.find(
      (p) =>
        p.routeId === routeId &&
        p.shippingServiceId === shippingServiceId &&
        new Date(p.effectiveDate) <= today &&
        (!p.deletionDate || new Date(p.deletionDate) > today)
    );
    const carrierRate = priceRow?.baseRatePerKg ?? 0;

    // Lặp qua từng goods và set unitPrice
    goodsWatch.forEach((g, idx) => {
      if (
        !g.lengthCm ||
        !g.widthCm ||
        !g.heightCm ||
        !g.weightKg ||
        carrierRate === 0
      )
        return;

      // 1) DIM weight
      const rawDim = (g.lengthCm * g.widthCm * g.heightCm) / volumetricDivisor;

      // 2) Làm tròn 0.5 kg
      const dimWeight = Math.ceil(rawDim / 0.5) * 0.5;

      // 3) Chargeable weight
      const chargeable = Math.max(dimWeight, g.weightKg);

      // 5) unitPrice
      const price = chargeable * carrierRate;
      // ✨ Chỉ khi giá đổi mới setValue để tránh loop
      if (price !== g.unitPrice) {
        form.setValue(`goods.${idx}.unitPrice`, price, {
          shouldValidate: true,
          shouldDirty: true
        });
      }
    });
  }, [
    goodsWatch, // ← bây giờ **thực sự** thay đổi
    routeId,
    shippingServiceId,
    volumetricDivisor,
    prices,
    form
  ]);

  /* ---------- watch các phần liên quan ---------- */
  const goods = useWatch({ control: form.control, name: 'goods' });
  const surcharges = useWatch({ control: form.control, name: 'surcharges' });
  const insurance = useWatch({ control: form.control, name: 'insurance' });
  const discount = useWatch({ control: form.control, name: 'branchDiscount' });

  /* ---------- tính toán tổng ---------- */
  const summary = React.useMemo(() => {
    // 1) Phí vận chuyển = Σ( unitPrice × quantity )
    const shippingFee = goods?.reduce(
      (sum, g) => sum + (g.unitPrice || 0) * (g.quantity || 0),
      0
    );

    // 2) Phí bảo hiểm
    const insuranceFee = insurance?.insuranceFee ?? 0;

    // 3) Phụ phí = Σ amount
    const surchargeTotal = surcharges?.reduce(
      (sum, s) => sum + (s.amount || 0),
      0
    );

    // 4) Chiết khấu chi nhánh (có thể undefined)
    const branchDiscount = discount ?? 0;

    // 5) Tổng cộng
    const grandTotal =
      shippingFee + insuranceFee + (surchargeTotal || 0) - branchDiscount;

    return {
      shippingFee,
      insuranceFee,
      surchargeTotal,
      branchDiscount,
      grandTotal
    };
  }, [goods, surcharges, insurance, discount]);

  function onSubmit(data: CreateShippingOrderFormValues) {
    // Transform data to match API payload if necessary
    const payload = {
      ...data,
      status: ShippingOrderStatus.Draft,
      createdAt: new Date().toISOString(),
      // creatorId: fromAuthContext(), // This should come from auth context or backend
      goods: data.goods.map((g) => ({
        ...g,
        volumeM3: (g.lengthCm * g.widthCm * g.heightCm) / 1000000 // Calculate volume in m³
      }))
      // insurance: data.insurance ? { ...data.insurance, fee: calculateInsuranceFee(...) } : undefined,
    };
    // Replace with actual API call: mutation.mutate(payload)
    toast.success('Đơn hàng đã được lưu nháp.', {
      description: 'Khởi tạo đơn hàng thành công.'
    });

    form.reset(); // Reset form after successful submission
    router.push('/shipping-orders/list');
  }
  function onInvalid(errors: FieldErrors<CreateShippingOrderFormValues>) {}
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className='w-full space-y-8'
      >
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Chung</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2'>
            <FormField
              control={form.control}
              name='branchId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi Nhánh *</FormLabel>
                  <FormDescription>
                    Chọn chi nhánh (tự động chọn từ thông tin người dùng)
                  </FormDescription>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={field.value?.toString() ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn chi nhánh' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem
                          key={branch.id}
                          value={branch.id.toString()}
                        >
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='shippingServiceId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dịch Vụ Vận Chuyển *</FormLabel>
                  <FormDescription>Chọn dịch vụ vận chuyển</FormDescription>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={field.value?.toString() ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn dịch vụ vận chuyển' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shippingServices.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='shippingTypeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại Hình Vận Chuyển *</FormLabel>
                  <FormDescription>Chọn loại hình vận chuyển</FormDescription>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={field.value?.toString() ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn loại hình vận chuyển' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shippingTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='paymentTypeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương Thức Thanh Toán *</FormLabel>
                  <FormDescription>Chọn phương thức thanh toán</FormDescription>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={field.value?.toString() ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn phương thức thanh toán' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='routeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuyến Vận Chuyển *</FormLabel>
                  <FormDescription>Chọn tuyến vận chuyển</FormDescription>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={field.value?.toString() ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn tuyến vận chuyển' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id.toString()}>
                          {route.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='carrierId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn Vị Vận Chuyển *</FormLabel>
                  <FormDescription>Chọn đơn vị vận chuyển</FormDescription>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={field.value?.toString() ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn đơn vị vận chuyển' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carriers.map((carrier) => (
                        <SelectItem
                          key={carrier.id}
                          value={carrier.id.toString()}
                        >
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='volumetricDivisor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hệ Số Quy đổi *</FormLabel>
                  <Select
                    value={field.value?.toString() ?? ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn divisor' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='5000'>5000</SelectItem>
                      <SelectItem value='6000'>6000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Dùng để tính trọng lượng quy đổi (DIM)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Người Gửi *</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* START: Customer Selection for Sender */}
              <FormField
                control={form.control}
                name='senderId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người Gửi *</FormLabel>
                    <div className='flex items-center gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const customerId = value ? Number(value) : undefined;
                          field.onChange(customerId); // Update sender.customerId
                          const selectedCustomer = customers.find(
                            (customer: Customer) => customer.id === customerId
                          );
                          if (customerId) {
                            // Customer is selected, set other sender fields to undefined in form state.
                            // The UI will display details from mockCustomers, but these values won't be part of the form submission for these fields.

                            form.setValue(
                              'senderInfo',
                              {
                                name: selectedCustomer?.name,
                                email: selectedCustomer?.email,
                                phone: selectedCustomer?.phone,
                                cityId: selectedCustomer?.cityId,
                                address: selectedCustomer?.address,
                                postal: selectedCustomer?.postal,
                                note: selectedCustomer?.note
                              },
                              { shouldValidate: true }
                            );
                            setSenderCityInput(
                              cities.find(
                                (c) => c.id === selectedCustomer?.cityId
                              )?.name ?? ''
                            );
                            form.trigger('senderInfo');
                          } else {
                            // No customer selected ("Không chọn"), clear fields for manual entry and validate them.
                            form.setValue(
                              'senderInfo',
                              {
                                name: '',
                                email: '',
                                phone: '',
                                cityId: undefined,
                                address: '',
                                postal: '',
                                note: ''
                              },
                              { shouldValidate: true }
                            );
                            setSenderCityInput('');
                            form.trigger('senderInfo');
                          }
                        }}
                        value={field.value?.toString() ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn khách hàng' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem
                              key={customer.id}
                              value={customer.id.toString()}
                            >
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='whitespace-nowrap'
                      >
                        Thêm Mới
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <>
                <FormField
                  name='senderInfo.name'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên Người Gửi</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Nguyễn Văn A' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='senderInfo.email'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          {...field}
                          placeholder='example@email.com'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='senderInfo.phone'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số Điện Thoại</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='09xxxxxxxx' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='senderInfo.cityId'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thành Phố</FormLabel>
                      <Combobox
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => {
                          return field.onChange(
                            value ? Number(value) : undefined
                          );
                        }}
                        inputValue={senderCityInput} // text hiển thị
                        onInputValueChange={setSenderCityInput} // cho phép gõ tìm
                      >
                        <ComboboxAnchor>
                          <ComboboxInput placeholder='Chọn thành phố' />
                          <ComboboxTrigger>
                            <ChevronDown className='h-4 w-4' />
                          </ComboboxTrigger>
                        </ComboboxAnchor>
                        <ComboboxContent className='relative max-h-[300px] overflow-x-hidden overflow-y-auto'>
                          <ComboboxEmpty>No cities found</ComboboxEmpty>
                          {Object.entries(groupedCities).map(
                            ([countryId, cities], index) => (
                              <React.Fragment key={countryId}>
                                <ComboboxGroup>
                                  <ComboboxGroupLabel>
                                    {countryId}
                                  </ComboboxGroupLabel>
                                  {cities.map((city) => (
                                    <ComboboxItem
                                      key={city.id}
                                      value={city.id.toString()}
                                    >
                                      {city.name}
                                    </ComboboxItem>
                                  ))}
                                </ComboboxGroup>
                                {index <
                                  Object.entries(groupedCities).length - 1 && (
                                  <ComboboxSeparator />
                                )}
                              </React.Fragment>
                            )
                          )}
                        </ComboboxContent>
                      </Combobox>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='senderInfo.address'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa Chỉ</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Số nhà, tên đường, phường/xã, quận/huyện'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='senderInfo.postal'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã Bưu Điện</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='VD: 700000' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='senderInfo.note'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chú Thích</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Thông tin thêm cho người gửi'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
              {/* END: Customer Selection for Sender */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Người Nhận *</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* START: Customer Selection for Receiver */}
              <FormField
                control={form.control}
                name='receiverId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người Nhận *</FormLabel>
                    <div className='flex items-center gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const customerId = value ? Number(value) : undefined;
                          field.onChange(customerId); // Update receiver.customerId

                          const selectedCustomer = customers.find(
                            (customer) => customer.id === customerId
                          );
                          if (customerId) {
                            form.setValue(
                              'receiverInfo',
                              {
                                name: selectedCustomer?.name,
                                email: selectedCustomer?.email,
                                phone: selectedCustomer?.phone,
                                cityId: selectedCustomer?.cityId,
                                address: selectedCustomer?.address,
                                postal: selectedCustomer?.postal,
                                note: selectedCustomer?.note
                              },
                              { shouldValidate: true }
                            );
                            setReceiverCityInput(
                              cities.find(
                                (c) => c.id === selectedCustomer?.cityId
                              )?.name ?? ''
                            );
                            form.trigger('receiverInfo');
                          } else {
                            form.setValue(
                              'receiverInfo',
                              {
                                name: '',
                                email: '',
                                phone: '',
                                cityId: undefined,
                                address: '',
                                postal: '',
                                note: ''
                              },
                              { shouldValidate: true }
                            );
                            setReceiverCityInput('');
                            form.trigger('receiverInfo');
                          }
                        }}
                        value={field.value?.toString() ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn khách hàng' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem
                              key={customer.id}
                              value={customer.id.toString()}
                            >
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='whitespace-nowrap'
                      >
                        Thêm Mới
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <>
                <FormField
                  name='receiverInfo.name'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên Người Nhận</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Trần Thị B' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='receiverInfo.email'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          {...field}
                          placeholder='receiver@email.com'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='receiverInfo.phone'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số Điện Thoại</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='03xxxxxxxx' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='receiverInfo.cityId'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thành Phố</FormLabel>
                      <Combobox
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => {
                          return field.onChange(
                            value ? Number(value) : undefined
                          );
                        }}
                        inputValue={receiverCityInput} // text hiển thị
                        onInputValueChange={setReceiverCityInput} // cho phép gõ tìm
                      >
                        <ComboboxAnchor>
                          <ComboboxInput placeholder='Chọn thành phố' />
                          <ComboboxTrigger>
                            <ChevronDown className='h-4 w-4' />
                          </ComboboxTrigger>
                        </ComboboxAnchor>
                        <ComboboxContent className='relative max-h-[300px] overflow-x-hidden overflow-y-auto'>
                          <ComboboxEmpty>No cities found</ComboboxEmpty>
                          {Object.entries(groupedCities).map(
                            ([countryId, cities], index) => (
                              <React.Fragment key={countryId}>
                                <ComboboxGroup>
                                  <ComboboxGroupLabel>
                                    {countryId}
                                  </ComboboxGroupLabel>
                                  {cities.map((city) => (
                                    <ComboboxItem
                                      key={city.id}
                                      value={city.id.toString()}
                                    >
                                      {city.name}
                                    </ComboboxItem>
                                  ))}
                                </ComboboxGroup>
                                {index <
                                  Object.entries(groupedCities).length - 1 && (
                                  <ComboboxSeparator />
                                )}
                              </React.Fragment>
                            )
                          )}
                        </ComboboxContent>
                      </Combobox>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='receiverInfo.address'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa Chỉ</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Số nhà, tên đường, phường/xã, quận/huyện'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='receiverInfo.postal'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã Bưu Điện</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='VD: 100000' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='receiverInfo.note'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chú Thích</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Thông tin thêm cho người nhận'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
              {/* END: Customer Selection for Receiver */}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Thông Tin Hàng Hóa *</CardTitle>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() =>
                appendGoodsItem({
                  commodityTypeId: 1,
                  description: 'Hàng thông thường',
                  lengthCm: 50,
                  widthCm: 50,
                  heightCm: 50,
                  weightKg: 1,
                  quantity: 1,
                  unitPrice: 0
                })
              }
            >
              <PlusCircle className='mr-2 h-4 w-4' /> Thêm Hàng Hóa
            </Button>
          </CardHeader>
          <CardContent className='space-y-6'>
            {goodsItemFields.map((field, index: number) => (
              <div
                key={field.id}
                className='relative space-y-4 rounded-md border bg-slate-50 p-4 dark:bg-slate-800/30'
              >
                <div className='mb-2 flex items-center justify-between'>
                  <h4 className='text-lg font-medium'>Mặt hàng #{index + 1}</h4>
                  {goodsItemFields.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeGoodsItem(index)}
                      className='text-destructive hover:bg-destructive/10'
                    >
                      <Trash2 className='h-5 w-5' />
                    </Button>
                  )}
                </div>
                <div className='grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-4'>
                  <FormField
                    control={form.control}
                    name={`goods.${index}.commodityTypeId`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Loại hàng hóa *</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value ? Number(value) : undefined)
                          }
                          value={field.value?.toString() ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn loại hàng' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {commodityTypes.map((type) => (
                              <SelectItem
                                key={type.id}
                                value={type.id.toString()}
                              >
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`goods.${index}.description`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Mô tả chi tiết *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Mô tả hàng hóa, ví dụ: Sách giáo khoa'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`goods.${index}.qualityNote`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Ghi chú chất lượng</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Ví dụ: Hàng dễ vỡ, vui lòng nhẹ tay'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`goods.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Số lượng *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10) || 0)
                            }
                            placeholder='1'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`goods.${index}.lengthCm`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Dài (cm) *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.1'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder='30'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`goods.${index}.widthCm`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Rộng (cm) *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.1'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder='20'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`goods.${index}.heightCm`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Cao (cm) *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.1'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder='5'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`goods.${index}.weightKg`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Cân nặng (kg) *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder='0.5'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`goods.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className='lg:col-span-1'>
                        <FormLabel>Đơn giá (Tính tự động)</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            readOnly // chỉ hiển thị
                            className='bg-muted/50'
                            value={
                              Number.isFinite(field.value)
                                ? new Intl.NumberFormat('vi-VN').format(
                                    field.value as number
                                  )
                                : ''
                            }
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder='50000'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>{' '}
                {/* Closing the inner grid div for a goods item */}
              </div> // Closing the div for a goods item (key={item.id})
            ))}{' '}
            {/* Closing goodsFields.map */}
          </CardContent>
        </Card>{' '}
        {/* Closing Card for "Thông Tin Hàng Hóa" */}
        {/* Correctly placed Insurance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bảo hiểm (Tùy chọn)</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='insurance' // Single FormField for the entire insurance object
              render={({ field: insuranceField }) => (
                <FormItem className='col-span-2 grid grid-cols-1 items-start gap-4'>
                  <div className='lg:col-span-1'>
                    {' '}
                    {/* Package Select */}
                    <FormLabel style={{ marginBottom: '0.5rem' }}>
                      Gói Bảo Hiểm
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const packageId = value ? Number(value) : undefined;
                        if (packageId) {
                          const currentDeclaredValue =
                            insuranceField.value?.declaredValue;
                          insuranceField.onChange({
                            insurancePackageId: packageId,
                            declaredValue:
                              currentDeclaredValue === undefined
                                ? 0
                                : currentDeclaredValue
                            // insuranceFee will be calculated by useEffect
                          });
                        } else {
                          insuranceField.onChange(undefined); // Clear entire insurance object
                        }
                      }}
                      value={
                        insuranceField.value?.insurancePackageId?.toString() ??
                        ''
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Không sử dụng bảo hiểm' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* <SelectItem value="">Not using insurance</SelectItem> */}
                        {insurancePackages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id.toString()}>
                            {pkg.name} ({pkg.rate * 100}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>

                  {insuranceField.value?.insurancePackageId && (
                    <>
                      <div className='lg:col-span-1'>
                        {' '}
                        {/* Declared Value Input */}
                        <FormLabel
                          style={{
                            marginBottom: '0.5rem',
                            marginTop: '0.5rem'
                          }}
                        >
                          Giá trị khai báo (VNĐ)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            inputMode='numeric'
                            placeholder='0'
                            value={formatVND(
                              insuranceField.value?.declaredValue
                            )}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, ''); // bỏ kí tự không phải số
                              insuranceField.onChange({
                                ...insuranceField.value,
                                declaredValue: raw ? Number(raw) : undefined
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                      {insuranceField.value?.insuranceFee !== undefined && (
                        <>
                          {' '}
                          {/* Insurance Fee Display */}
                          <FormLabel style={{ marginTop: '0.5rem' }}>
                            {' '}
                            Phí bảo hiểm (VNĐ)
                          </FormLabel>
                          <FormDescription>
                            Phí bảo hiểm dựa trên giá trị khai báo và gói bảo
                            hiểm đã chọn
                          </FormDescription>
                          <FormControl>
                            <Input
                              type='text'
                              readOnly
                              className='bg-muted/50'
                              value={formatVND(
                                insuranceField.value?.insuranceFee
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </>
                      )}
                    </>
                  )}
                </FormItem>
              )}
            />
          </CardContent>
          {/* Header + nút “Thêm phụ phí” */}
          <CardHeader className='flex items-center justify-between'>
            <CardTitle>Phụ phí (Tùy chọn)</CardTitle>

            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={
                () => appendSurchargeItem({ surchargeTypeId: 1, amount: 0 }) // thêm 1 dòng rỗng
              }
            >
              <PlusCircle className='mr-2 h-4 w-4' />
              Thêm Phụ Phí
            </Button>
          </CardHeader>

          {/* Danh sách phụ phí */}
          <CardContent className='space-y-4'>
            {surchargeItemFields.map((field, index) => (
              <div
                key={field.id}
                className='relative grid grid-cols-12 gap-4 rounded-md bg-slate-50 p-4 dark:bg-slate-800/30'
              >
                {/* Loại phụ phí */}
                <FormField
                  control={form.control}
                  name={`surcharges.${index}.surchargeTypeId`}
                  render={({ field }) => (
                    <FormItem className='col-span-6 sm:col-span-5 md:col-span-4 lg:col-span-3'>
                      <FormLabel>Loại Phụ Phí *</FormLabel>
                      <Select
                        value={field.value?.toString() ?? ''}
                        onValueChange={(v) =>
                          field.onChange(v ? Number(v) : undefined)
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select surcharge type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {surchargeTypes.map((st) => (
                            <SelectItem key={st.id} value={st.id.toString()}>
                              {st.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Số tiền */}
                <FormField
                  control={form.control}
                  name={`surcharges.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className='col-span-5 sm:col-span-4 md:col-span-3 lg:col-span-2'>
                      <FormLabel style={{ marginBottom: '0.5rem' }}>
                        Số tiền *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          inputMode='numeric'
                          placeholder='0'
                          value={formatVND(field.value)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, ''); // bỏ kí tự không phải số
                            field.onChange(raw ? Number(raw) : undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nút xoá */}
                {surchargeItemFields.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => removeSurchargeItem(index)}
                    className='text-destructive hover:bg-destructive/10 absolute top-3 right-3'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        {/* ---------- Thẻ tóm tắt chi phí ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt chi phí</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span>Phí giao hàng</span>
              <span className='font-medium'>
                {formatVND(summary.shippingFee)} ₫
              </span>
            </div>

            {summary.insuranceFee > 0 && (
              <div className='flex justify-between'>
                <span>Phí bảo hiểm</span>
                <span className='font-medium'>
                  {formatVND(summary.insuranceFee)} ₫
                </span>
              </div>
            )}

            {summary.surchargeTotal !== undefined && (
              <div className='flex justify-between'>
                <span>Phụ phí</span>
                <span className='font-medium'>
                  {formatVND(summary.surchargeTotal)} ₫
                </span>
              </div>
            )}

            {summary.branchDiscount > 0 && (
              <div className='text-destructive flex justify-between'>
                <span>Giảm giá</span>
                <span>-{formatVND(summary.branchDiscount)} ₫</span>
              </div>
            )}

            <Separator className='my-2' />

            <div className='flex justify-between text-base font-semibold'>
              <span>Tổng</span>
              <span>{formatVND(summary.grandTotal)} ₫</span>
            </div>
          </CardContent>
        </Card>
        <div className='mt-4 mb-4 flex justify-start space-x-4'>
          <Button
            type='button'
            variant='destructive'
            onClick={() => form.reset()}
          >
            Khởi tạo lại
          </Button>
          <Button variant='default' type='submit'>
            Lưu
          </Button>
        </div>
      </form>
    </Form>
  );
}
