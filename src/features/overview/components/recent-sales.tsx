import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const salesData = [
  {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/1.png',
    fallback: 'NV',
    amount: '+5 000 000'
  },
  {
    name: 'Nguyễn Văn B',
    email: 'nguyenvanb@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/2.png',
    fallback: 'NV',
    amount: '+15 000 000'
  },
  {
    name: 'Nguyễn Văn C',
    email: 'nguyenvanc@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/3.png',
    fallback: 'NV',
    amount: '+50 000 000'
  },
  {
    name: 'Nguyễn Văn D',
    email: 'nguyenvand@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/4.png',
    fallback: 'NV',
    amount: '+5 000 000'
  },
  {
    name: 'Nguyễn Văn E',
    email: 'nguyenvane@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
    fallback: 'NV',
    amount: '+5 000 000'
  }
];

export function RecentSales() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Đơn hàng gần nhất</CardTitle>
        <CardDescription>Chi nhánh đã giao 265 đơn hàng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {salesData.map((sale, index) => (
            <div key={index} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={sale.avatar} alt='Avatar' />
                <AvatarFallback>{sale.fallback}</AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>{sale.name}</p>
                <p className='text-muted-foreground text-sm'>{sale.email}</p>
              </div>
              <div className='ml-auto font-medium'>{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
