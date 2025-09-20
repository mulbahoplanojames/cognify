export interface menuItemsType {
  name: string;
  href: string;
}

export interface ourMissionType {
  title: string;
  description: string;
  icons: React.ElementType;
  color: string;
  bgColor: string;
}

export interface premiumLibraryType {
  title: string;
  description: string;
  author: string;
  readTime: string;
  rating: number;
  tags: string[];
  imageUrl: string;
  featured: boolean;
}
