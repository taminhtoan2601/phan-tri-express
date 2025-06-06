import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Phan Tri Express',
  description: 'Phan Tri Express'
};

export default async function ShippingOrdersLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
        <footer className='bg-background text-muted-foreground fixed right-0 bottom-0 left-0 w-full p-5 text-center text-sm'>
          <p>
            Phan Tri Express &copy; {new Date().getFullYear()} @Bản quyền thuộc
            về Phan Tri Express
          </p>
        </footer>
      </SidebarProvider>
    </KBar>
  );
}
