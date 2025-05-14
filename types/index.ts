// User type
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// Content types
export type ContentType = 'text' | 'audio' | 'video' | 'document';

export interface Content {
  id: string;
  userId: string;
  type: ContentType;
  title: string;
  content: string;
  url?: string;
  createdAt: Date;
  tags?: string[];
}

// Analysis types
export interface Analysis {
  id: string;
  contentId: string;
  summary: string;
  insights: string[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  createdAt: Date;
}

// Daily report types
export interface DailyReport {
  id: string;
  userId: string;
  date: Date;
  report: string;
  contentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}