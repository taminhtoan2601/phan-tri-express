'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  getZones,
  getCommodityTypes,
  getShippingTypes,
  getPaymentTypes,
  getRoutes,
  getCarriers,
  getInsurancePackages,
  getPriceConfigurations
} from '@/lib/api/system-configuration-api';

/**
 * Test page để kiểm tra các API mock trực tiếp
 * Hiển thị dữ liệu từ mỗi endpoint để xác nhận dữ liệu mock hoạt động đúng
 */
export default function TestApiPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runTests() {
    setLoading(true);
    setError(null);

    try {
      const results = {
        zones: await getZones(),
        commodityTypes: await getCommodityTypes(),
        shippingTypes: await getShippingTypes(),
        paymentTypes: await getPaymentTypes(),
        routes: await getRoutes(),
        carriers: await getCarriers(),
        insurancePackages: await getInsurancePackages(),
        priceConfigurations: await getPriceConfigurations()
      };

      setTestResults(results);
      console.log('API test results:', results);
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='mb-6 text-2xl font-bold'>API Test Page</h1>

      <Button onClick={runTests} disabled={loading} className='mb-6'>
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </Button>

      {error && (
        <div className='mb-6 rounded border border-red-400 bg-red-100 p-4 text-red-700'>
          {error}
        </div>
      )}

      {Object.keys(testResults).length > 0 && (
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-xl font-semibold'>Test Results</h2>

          {Object.entries(testResults).map(([key, value]: [string, any]) => (
            <div key={key} className='mb-6'>
              <h3 className='mb-2 text-lg font-medium text-gray-800'>{key}</h3>
              <div className='rounded border bg-gray-50 p-3'>
                <pre className='max-h-60 overflow-auto text-sm'>
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
