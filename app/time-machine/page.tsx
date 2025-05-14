'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import DatePicker from '@/components/features/date-picker';
import ContentCard from '@/components/features/content-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CalendarDays, TimerReset, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TimeMachinePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Mock data - in a real app, this would come from Firebase
  const mockEntries = [
    // For demo purposes, create some mock entries
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  选择日期
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DatePicker date={selectedDate} setDate={setSelectedDate} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  时间线
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <ScrollArea className="h-[300px] px-1">
                  <div className="space-y-2 pr-3">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - i);
                      
                      return (
                        <button
                          key={i}
                          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                          onClick={() => setSelectedDate(new Date(date))}
                        >
                          <div className="font-medium">{formatDate(date, 'PPP')}</div>
                          <div className="text-xs text-muted-foreground">{i === 0 ? '今天' : `${i}天前`}</div>
                        </button>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {formatDate(selectedDate, 'PPP')}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      <span>{formatDate(selectedDate, 'EEEE')}</span>
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TimerReset className="mr-1 h-4 w-4" />
                    {selectedDate.toDateString() === new Date().toDateString() 
                      ? '今天' 
                      : `${Math.floor((new Date().getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24))}天前`
                    }
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="report">
                  <TabsList className="mb-6">
                    <TabsTrigger value="report">日报</TabsTrigger>
                    <TabsTrigger value="content">内容</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="report" className="min-h-[300px]">
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <CalendarDays className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">暂无日报</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        这一天还没有生成日报。上传一些内容后，AI将为您生成日报摘要。
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="content" className="min-h-[300px]">
                    {mockEntries.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {mockEntries.map((entry) => (
                          <ContentCard 
                            key={entry.id}
                            id={entry.id}
                            title={entry.title}
                            type={entry.type}
                            content={entry.content}
                            createdAt={entry.createdAt}
                            tags={entry.tags}
                            onView={(id) => console.log('View', id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                          <CalendarDays className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">暂无内容</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          这一天还没有上传任何内容。点击上传按钮添加一些内容。
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}