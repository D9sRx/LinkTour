import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  // Example data for dashboard
  const stats = [
    { label: '上传内容', value: '0' },
    { label: '生成报告', value: '0' },
    { label: '记录天数', value: '0' },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">欢迎来到游牧志</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            使用AI智能分析你的内容，自动生成日报，并通过时光机功能回顾过去的记录。
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>上传内容</CardTitle>
              <CardDescription>
                上传文字、视频、音频或文档，AI将为你分析内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <Upload className="h-12 w-12 text-muted-foreground opacity-80" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/upload" className="w-full">
                <Button className="w-full">
                  开始上传
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>今日报告</CardTitle>
              <CardDescription>
                查看AI生成的今日内容总结
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <Sparkles className="h-12 w-12 text-muted-foreground opacity-80" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/journal" className="w-full">
                <Button variant="outline" className="w-full">
                  查看报告
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>时光机</CardTitle>
              <CardDescription>
                回顾过去的记录和回忆
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <Calendar className="h-12 w-12 text-muted-foreground opacity-80" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/time-machine" className="w-full">
                <Button variant="outline" className="w-full">
                  开始回顾
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>

        <section className="border rounded-lg p-6 bg-muted/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">开始记录你的灵感</h2>
              <p className="text-muted-foreground mt-1">
                上传你的第一个内容，让AI帮你整理思路
              </p>
            </div>
            <Link href="/upload">
              <Button size="lg">
                立即开始
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}