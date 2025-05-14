'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/ui/file-upload';
import TextEditor from '@/components/features/text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileIcon } from 'lucide-react';
import { ContentType } from '@/types';
import { generateRandomId } from '@/lib/utils';
import { analyzeContent } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const router = useRouter();
  const { toast } = useToast();
  
  const handleFileSelect = (file: File, type: ContentType) => {
    setSelectedFile(file);
    setContentType(type);
    if (!title) {
      setTitle(file.name.split('.')[0]);
    }
  };
  
  const handleTextSave = (textContent: string) => {
    setContent(textContent);
    setContentType('text');
  };
  
  const handleSubmit = async () => {
    if (!title) {
      toast({
        title: "请输入标题",
        description: "内容标题不能为空",
      });
      return;
    }
    
    if (!contentType) {
      toast({
        title: "未检测到内容",
        description: "请上传文件或输入文本内容",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, we would upload the file to Firebase here
      const contentToAnalyze = contentType === 'text' ? content : selectedFile?.name || '';
      
      // Call the Gemini API to analyze the content
      const analysis = await analyzeContent(contentToAnalyze, contentType);
      
      // Store the content and analysis in Firestore (mock)
      const contentId = generateRandomId();
      
      // Success notification
      toast({
        title: "内容已处理",
        description: "您的内容已成功上传并分析完成",
      });
      
      // In a real app, we would redirect to the content details page
      // For now, just redirect to the home page
      router.push('/');
    } catch (error) {
      console.error("Error processing content:", error);
      toast({
        title: "处理失败",
        description: "内容处理过程中发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">上传内容</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>内容信息</CardTitle>
            <CardDescription>
              给你的内容起个标题，然后上传文件或输入文本
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                placeholder="输入标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="upload">上传文件</TabsTrigger>
                <TabsTrigger value="text">输入文本</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <FileUpload onFileSelect={handleFileSelect} />
              </TabsContent>
              
              <TabsContent value="text">
                <TextEditor
                  initialValue={content}
                  onSave={handleTextSave}
                  placeholder="开始输入你的想法..."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? '处理中...' : '提交'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}