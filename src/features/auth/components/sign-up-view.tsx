import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { IconStar } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignUpViewPage() {
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
          <ClerkSignUpForm
            initialValues={{
              emailAddress: 'your_mail+clerk_test@example.com'
            }}
          />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
