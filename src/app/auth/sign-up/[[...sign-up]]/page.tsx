import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'Phan Tri Express | Đăng ký',
  description: 'Đăng ký vào hệ thống.'
};

export default async function Page() {
  return <SignUpViewPage />;
}
