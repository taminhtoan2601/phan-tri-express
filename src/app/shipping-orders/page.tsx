import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming Shadcn/UI Button
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'; // Assuming Shadcn/UI Card
import { PlusCircle } from 'lucide-react'; // Assuming lucide-react for icons
import PageContainer from '@/components/layout/page-container';

// Placeholder for Breadcrumb component
const Breadcrumb = ({
  items
}: {
  items: { label: string; href?: string }[];
}) => (
  <nav aria-label='breadcrumb' className='mb-4'>
    <ol className='text-muted-foreground flex space-x-2 text-sm'>
      {items.map((item, index) => (
        <li key={index} className='flex items-center'>
          {item.href ? (
            <Link href={item.href} className='hover:underline'>
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <span className='mx-2'>/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

interface OverviewCardProps {
  title: string;
  description: string;
  count: number | string; // Can be a number or a placeholder string like 'N/A'
  link: string;
  linkText: string;
}

const OverviewCard = ({
  title,
  description,
  count,
  link,
  linkText
}: OverviewCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className='mb-2 text-2xl font-bold'>{count}</div>
      <Button asChild variant='outline'>
        <Link href={link}>{linkText}</Link>
      </Button>
    </CardContent>
  </Card>
);

export default function ShippingOrdersOverviewPage() {
  // Later, these counts will come from an API: GET /shipping-orders/count-by-status
  const overviewCardsData: OverviewCardProps[] = [
    {
      title: 'Bản Nháp & Chờ Duyệt',
      description: 'Quản lý đơn hàng đang được chuẩn bị hoặc chờ phê duyệt.',
      count: 5, // Placeholder count
      link: '/shipping-orders/draft',
      linkText: 'Đến Bản Nháp'
    },
    {
      title: 'Duyệt Đơn',
      description: 'Xem xét và phê duyệt các đơn hàng chờ duyệt.',
      count: 3, // Placeholder count
      link: '/shipping-orders/approval',
      linkText: 'Đến duyệt đơn'
    },
    {
      title: 'Xác Nhận Chứng Từ',
      description: 'Xác nhận các chứng từ đã được gửi.',
      count: 2, // Placeholder count
      link: '/shipping-orders/verification',
      linkText: 'Đến xác nhận chứng từ'
    },
    {
      title: 'Nhập/Xuất Kho',
      description:
        'Quản lý các đơn hàng đã được nhập vào kho và sẵn sàng xuất.',
      count: 8, // Placeholder count
      link: '/shipping-orders/warehouse',
      linkText: 'Đến nhập/xuất kho'
    },
    {
      title: 'Đang Vận Chuyển',
      description: 'Quản lý các đơn hàng đang được vận chuyển.',
      count: 12, // Placeholder count
      link: '/shipping-orders/transit',
      linkText: 'Đến vận chuyển'
    },
    {
      title: 'Đã Giao',
      description: 'Quản lý các đơn hàng đã được giao.',
      count: 25, // Placeholder count
      link: '/shipping-orders/delivery',
      linkText: 'Đến đã giao'
    },
    {
      title: 'Đã Hủy',
      description: 'Quản lý các đơn hàng đã được hủy.',
      count: 25, // Placeholder count
      link: '/shipping-orders/cancelled',
      linkText: 'Đến đã hủy'
    }
  ];
  const allOrdersCardsData: OverviewCardProps[] = [
    {
      title: 'Tổng Quan',
      description: 'Tất cả trạng thái.',
      count: '40', // Count might not be applicable here or could be total orders
      link: '/shipping-orders/list',
      linkText: 'Xem Tổng Quan'
    }
  ];
  return (
    <PageContainer scrollable={true}>
      <div className='container mx-auto p-4 md:p-6'>
        <div className='mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center'>
          <h1 className='mb-2 text-2xl font-bold tracking-tight sm:mb-0 md:text-3xl'>
            Đơn Vận Chuyển
          </h1>
          <Button asChild>
            <Link href='/shipping/new'>
              <PlusCircle className='mr-2 h-4 w-4' /> Tạo Đơn Mới
            </Link>
          </Button>
        </div>
        {allOrdersCardsData.map((card) => (
          <OverviewCard key={card.title} {...card} />
        ))}

        <h1 className='mb-2 text-2xl font-bold tracking-tight sm:my-6 md:text-3xl'>
          Theo Trạng Thái
        </h1>
        <div className='my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2'>
          {overviewCardsData.map((card) => (
            <OverviewCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
