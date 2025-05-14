'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BookOpenCheck, FileText, Loader2, RefreshCw } from 'lucide-react';
import ContentCard from '@/components/features/content-card';
import { formatDate } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateDailyReport } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

export default function JournalPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string>('');
  const { toast } = useToast();
  
  // Mock data - in a real app, this would come from Firebase
  const today = new Date();
  const mockEntries = [
    // For demo purposes, pretend there are no entries yet
  ];
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, we would fetch the analysis results from Firebase
      const mockAnalysisResults = [
        {
          summary: 'Sample summary',
          insights: ['Insight 1', 'Insight 2'],
          topics: ['Topic 1', 'Topic 2'],
          sentiment: 'positive' as const
        }
      ];
      
      // Call the Gemini API to generate the daily report
      const generatedReport = await generateDailyReport(mockAnalysisResults);
      setReport(generatedReport);
      
      toast({
        title: "日报生成成功",
        description: "您的日报已成功生成",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "生成失败",
        description: "日报生成过程中发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">今日日报</h1>
            <p className="text-muted-foreground mt-1">
              {formatDate(today, 'PPP')}
            </p>
          </div>
          
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating || mockEntries.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : report ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                重新生成
              </>
            ) : (
              <>
                <BookOpenCheck className="mr-2 h-4 w-4" />
                生成日报
              </>
            )}
          </Button>
        </section>
        
        {mockEntries.length === 0 && !report && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>暂无内容</AlertTitle>
            <AlertDescription>
              您今天还没有上传任何内容。请先上传一些内容，然后再生成日报。
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="report">
          <TabsList>
            <TabsTrigger value="report">日报</TabsTrigger>
            <TabsTrigger value="content">今日内容</TabsTrigger>
          </TabsList>
          
          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>今日总结</CardTitle>
                <CardDescription>
                  AI生成的今日内容摘要
                </CardDescription>
              </CardHeader>
              <CardContent>
                {report ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }} />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">暂无日报</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      您还没有生成今日日报。点击"生成日报"按钮，AI将为您总结今日的内容。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            {mockEntries.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    onEdit={(id) => console.log('Edit', id)}
                    onDelete={(id) => console.log('Delete', id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">暂无内容</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    您今天还没有上传任何内容。前往上传页面添加一些内容。
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/upload">上传内容</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}