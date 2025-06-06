import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Phan Tri Express',
  description: 'Phan Tri Express'
};

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* panel trái với ảnh bìa & slogan */}
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        {/* lớp phủ tối */}
        <div className='absolute inset-0 bg-black' />

        <div className='relative z-20 flex flex-col items-center space-y-6 text-center'>
          {/* Logo + tên */}
          <div className='flex items-center gap-2'>
            <img src='/logo.png' alt='Phan Tri Express' className='h-8 w-8' />
            <span className='text-lg font-semibold text-white'>
              Phan Tri Express
            </span>
          </div>

          {/* Slogan */}
          <div>
            <h2 className='text-2xl font-bold text-white'>
              Dịch vụ vận chuyển chuyên tuyến quốc tế
            </h2>
            <p className='mt-2 max-w-md text-sm text-white'>
              Từ bưu kiện đến pallet, từ địa phương đến quốc tế, hãy trải nghiệm
              các giải pháp vận chuyển linh hoạt, đáng tin cậy với chi phí hợp
              lý và đáp ứng nhu cầu của bạn
            </p>
          </div>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <ClerkSignInForm
            initialValues={{
              username: 'phantriadmin'
            }}
          />
        </div>
      </div>
    </div>
  );
}
