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
      <div className='relative hidden h-full flex-col items-center justify-center text-white lg:flex dark:border-r'>
        {/* Background image */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: `url('/bg.jpg')` }}
        />

        {/* Nội dung phía trước ảnh */}
        <div className='relative z-20 flex flex-col items-center space-y-6 text-center'>
          <div className='flex items-center gap-2'>
            <Image
              src='/logo.png'
              alt='Phan Tri Express'
              width={50}
              height={50}
            />
            <span className='text-lg font-semibold text-white'>
              Phan Tri Express
            </span>
          </div>
          <h2 className='text-4xl font-bold text-white'>
            Hệ thống quản lý vận chuyển
          </h2>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <ClerkSignInForm
            appearance={{
              elements: {
                formButton: {
                  color: 'blue'
                }
              },
              layout: {
                logoImageUrl: '/logo.png'
              }
            }}
            initialValues={{
              username: 'phantriadmin'
            }}
          />
        </div>
      </div>
    </div>
  );
}
