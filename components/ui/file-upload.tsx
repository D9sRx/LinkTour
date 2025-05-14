'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { File, Upload, X, FileText, Music, Video, File as FileIcon } from 'lucide-react';
import { getContentTypeFromFile } from '@/lib/utils';
import { ContentType } from '@/types';

interface FileUploadProps {
  onFileSelect: (file: File, type: ContentType) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

export default function FileUpload({
  onFileSelect,
  acceptedFileTypes = ".txt,.pdf,.docx,.mp3,.mp4,.wav,.avi,.png,.jpg",
  maxSizeMB = 50
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`文件大小超过限制 (${maxSizeMB}MB)`);
      return false;
    }
    
    // Reset error state
    setError(null);
    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;
    
    setSelectedFile(file);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const contentType = getContentTypeFromFile(file);
        onFileSelect(file, contentType);
      }
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type.startsWith('text/') || type.includes('pdf') || type.includes('word')) {
      return <FileText className="h-8 w-8" />;
    } else if (type.startsWith('audio/')) {
      return <Music className="h-8 w-8" />;
    } else if (type.startsWith('video/')) {
      return <Video className="h-8 w-8" />;
    } else if (type.startsWith('image/')) {
      return <FileIcon className="h-8 w-8" />;
    } else {
      return <File className="h-8 w-8" />;
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileInputChange}
      />
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          } transition-colors duration-200 cursor-pointer`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">将文件拖放到此处或点击上传</p>
              <p className="text-sm text-muted-foreground mt-1">
                支持的格式: 文本, 音频, 视频 和 文档
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                最大文件大小: {maxSizeMB}MB
              </p>
            </div>
            <Button variant="outline" className="mt-4">
              选择文件
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile)}
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={removeSelectedFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-right mt-1 text-muted-foreground">
              {uploadProgress}%
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}