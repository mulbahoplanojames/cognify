export interface kpiCardsType {
  title: string;
  value: number;
  change: string;
  changeType: "positive" | "negative";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    username: string;
  };
  status: "DRAFT" | "PUBLISHED" | "PENDING" | "SCHEDULED";
  createdAt: string | Date;
  updatedAt: string | Date;
  excerpt: string | null;
  views: number;
  content?: string;
  slug?: string;
  coverImage?: string | null;
  ogImage?: string | null;
  publishedAt?: string | Date | null;
  featured?: boolean;
  tagIds?: string[];
  _count?: {
    reports?: number;
  };
}
