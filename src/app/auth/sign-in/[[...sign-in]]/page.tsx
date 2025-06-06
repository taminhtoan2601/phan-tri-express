import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'Phan Tri Express | Đăng nhập',
  description: 'Đăng nhập vào hệ thống.'
};

export default async function Page() {
  return <SignInViewPage />;
}
