'use client';

import { useState } from 'react';
import { BookOpen, Calendar, Clock, Edit, FileText, Music, Video, FileIcon, Trash } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentType } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  id: string;
  title: string;
  type: ContentType;
  content: string;
  createdAt: Date;
  tags?: string[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function ContentCard({
  id,
  title,
  type,
  content,
  createdAt,
  tags = [],
  onEdit,
  onDelete,
  onView
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getTypeIcon = () => {
    switch (type) {
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'text':
        return 'bg-blue-500/10 text-blue-500';
      case 'audio':
        return 'bg-purple-500/10 text-purple-500';
      case 'video':
        return 'bg-red-500/10 text-red-500';
      case 'document':
        return 'bg-amber-500/10 text-amber-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card 
      className="overflow-hidden h-full transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className={`${getTypeColor()} mb-2 font-normal`}>
              <span className="flex items-center gap-1">
                {getTypeIcon()}
                <span className="capitalize">{type}</span>
              </span>
            </Badge>
            <CardTitle className="line-clamp-1">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="flex items-center mt-1 gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(createdAt, 'PPP')}</span>
          <span className="mx-1">•</span>
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(createdAt, 'p')}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncateText(content, 150)}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView && onView(id)}
          className="text-sm"
        >
          查看详情
        </Button>
        
        <div className={`flex gap-1 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}