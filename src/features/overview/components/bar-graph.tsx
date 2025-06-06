'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', aus: 222, usa: 150, jpn: 150 },
  { date: '2024-04-02', aus: 97, usa: 180, jpn: 150 },
  { date: '2024-04-03', aus: 167, usa: 120, jpn: 150 },
  { date: '2024-04-04', aus: 242, usa: 260, jpn: 150 },
  { date: '2024-04-05', aus: 373, usa: 290, jpn: 150 },
  { date: '2024-04-06', aus: 301, usa: 340, jpn: 150 },
  { date: '2024-04-07', aus: 245, usa: 180, jpn: 150 },
  { date: '2024-04-08', aus: 409, usa: 320, jpn: 150 },
  { date: '2024-04-09', aus: 59, usa: 110, jpn: 150 },
  { date: '2024-04-10', aus: 261, usa: 190, jpn: 150 },
  { date: '2024-04-11', aus: 327, usa: 350, jpn: 150 },
  { date: '2024-04-12', aus: 292, usa: 210, jpn: 210 },
  { date: '2024-04-13', aus: 342, usa: 380, jpn: 380 },
  { date: '2024-04-14', aus: 137, usa: 220, jpn: 220 },
  { date: '2024-04-15', aus: 120, usa: 170, jpn: 170 },
  { date: '2024-04-16', aus: 138, usa: 190, jpn: 190 },
  { date: '2024-04-17', aus: 446, usa: 360, jpn: 360 },
  { date: '2024-04-18', aus: 364, usa: 410, jpn: 410 },
  { date: '2024-04-19', aus: 243, usa: 180, jpn: 180 },
  { date: '2024-04-20', aus: 89, usa: 150, jpn: 150 },
  { date: '2024-04-21', aus: 137, usa: 200, jpn: 200 },
  { date: '2024-04-22', aus: 224, usa: 170, jpn: 170 },
  { date: '2024-04-23', aus: 138, usa: 230, jpn: 230 },
  { date: '2024-04-24', aus: 387, usa: 290, jpn: 290 },
  { date: '2024-04-25', aus: 215, usa: 250, jpn: 250 },
  { date: '2024-04-26', aus: 75, usa: 130, jpn: 130 },
  { date: '2024-04-27', aus: 383, usa: 420, jpn: 420 },
  { date: '2024-04-28', aus: 122, usa: 180, jpn: 180 },
  { date: '2024-04-29', aus: 315, usa: 240, jpn: 240 },
  { date: '2024-04-30', aus: 454, usa: 380, jpn: 380 },
  { date: '2024-05-01', aus: 165, usa: 220, jpn: 220 },
  { date: '2024-05-02', aus: 293, usa: 310, jpn: 310 },
  { date: '2024-05-03', aus: 247, usa: 190, jpn: 190 },
  { date: '2024-05-04', aus: 385, usa: 420, jpn: 420 },
  { date: '2024-05-05', aus: 481, usa: 390, jpn: 390 },
  { date: '2024-05-06', aus: 498, usa: 520, jpn: 520 },
  { date: '2024-05-07', aus: 388, usa: 300, jpn: 300 },
  { date: '2024-05-08', aus: 149, usa: 210, jpn: 210 },
  { date: '2024-05-09', aus: 227, usa: 180, jpn: 180 },
  { date: '2024-05-10', aus: 293, usa: 330, jpn: 330 },
  { date: '2024-05-11', aus: 335, usa: 270, jpn: 270 },
  { date: '2024-05-12', aus: 197, usa: 240, jpn: 240 },
  { date: '2024-05-13', aus: 197, usa: 160, jpn: 160 },
  { date: '2024-05-14', aus: 448, usa: 490, jpn: 490 },
  { date: '2024-05-15', aus: 473, usa: 380, jpn: 380 },
  { date: '2024-05-16', aus: 338, usa: 400, jpn: 400 },
  { date: '2024-05-17', aus: 499, usa: 420, jpn: 420 },
  { date: '2024-05-18', aus: 315, usa: 350, jpn: 350 },
  { date: '2024-05-19', aus: 235, usa: 180, jpn: 180 },
  { date: '2024-05-20', aus: 177, usa: 230, jpn: 230 },
  { date: '2024-05-21', aus: 82, usa: 140, jpn: 140 },
  { date: '2024-05-22', aus: 81, usa: 120, jpn: 120 },
  { date: '2024-05-23', aus: 252, usa: 290, jpn: 290 },
  { date: '2024-05-24', aus: 294, usa: 220, jpn: 220 },
  { date: '2024-05-25', aus: 201, usa: 250, jpn: 250 },
  { date: '2024-05-26', aus: 213, usa: 170, jpn: 170 },
  { date: '2024-05-27', aus: 420, usa: 460, jpn: 460 },
  { date: '2024-05-28', aus: 233, usa: 190, jpn: 190 },
  { date: '2024-05-29', aus: 78, usa: 130, jpn: 130 },
  { date: '2024-05-30', aus: 340, usa: 280, jpn: 280 },
  { date: '2024-05-31', aus: 178, usa: 230, jpn: 230 },
  { date: '2024-06-01', aus: 178, usa: 200, jpn: 200 },
  { date: '2024-06-02', aus: 470, usa: 410, jpn: 410 },
  { date: '2024-06-03', aus: 103, usa: 160, jpn: 160 },
  { date: '2024-06-04', aus: 439, usa: 380, jpn: 380 },
  { date: '2024-06-05', aus: 88, usa: 140, jpn: 140 },
  { date: '2024-06-06', aus: 294, usa: 250, jpn: 250 },
  { date: '2024-06-07', aus: 323, usa: 370, jpn: 370 },
  { date: '2024-06-08', aus: 385, usa: 320, jpn: 320 },
  { date: '2024-06-09', aus: 438, usa: 480, jpn: 480 },
  { date: '2024-06-10', aus: 155, usa: 200, jpn: 200 },
  { date: '2024-06-11', aus: 92, usa: 150, jpn: 150 },
  { date: '2024-06-12', aus: 492, usa: 420, jpn: 420 },
  { date: '2024-06-13', aus: 81, usa: 130, jpn: 130 },
  { date: '2024-06-14', aus: 426, usa: 380, jpn: 380 },
  { date: '2024-06-15', aus: 307, usa: 350, jpn: 350 },
  { date: '2024-06-16', aus: 371, usa: 310, jpn: 310 },
  { date: '2024-06-17', aus: 475, usa: 520, jpn: 520 },
  { date: '2024-06-18', aus: 107, usa: 170, jpn: 170 },
  { date: '2024-06-19', aus: 341, usa: 290, jpn: 290 },
  { date: '2024-06-20', aus: 408, usa: 450, jpn: 450 },
  { date: '2024-06-21', aus: 169, usa: 210, jpn: 210 },
  { date: '2024-06-22', aus: 317, usa: 270, jpn: 270 },
  { date: '2024-06-23', aus: 480, usa: 530, jpn: 530 },
  { date: '2024-06-24', aus: 132, usa: 180, jpn: 180 },
  { date: '2024-06-25', aus: 141, usa: 190, jpn: 190 },
  { date: '2024-06-26', aus: 434, usa: 380, jpn: 380 },
  { date: '2024-06-27', aus: 448, usa: 490, jpn: 490 },
  { date: '2024-06-28', aus: 149, usa: 200, jpn: 200 },
  { date: '2024-06-29', aus: 103, usa: 160, jpn: 160 },
  { date: '2024-06-30', aus: 446, usa: 400, jpn: 400 }
];

const chartConfig = {
  views: {
    label: 'Page Views'
  },
  aus: {
    label: 'Úc',
    color: 'var(--primary)'
  },
  usa: {
    label: 'Hoa Kỳ',
    color: 'var(--primary)'
  },
  jpn: {
    label: 'Nhật Bản',
    color: 'var(--primary)'
  },
  error: {
    label: 'Error',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('aus');

  const total = React.useMemo(
    () => ({
      aus: chartData.reduce((acc, curr) => acc + curr.aus, 0),
      usa: chartData.reduce((acc, curr) => acc + curr.usa, 0),
      jpn: chartData.reduce((acc, curr) => acc + curr.jpn, 0)
    }),
    []
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (activeChart === 'error') {
      throw new Error('Mocking Error');
    }
  }, [activeChart]);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Biểu đồ</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Tổng doanh thu trong 3 tháng gần nhất
            </span>
            <span className='@[540px]/card:hidden'>3 tháng gần nhất</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {['aus', 'usa', 'jpn'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('vi-VN', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='views'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
