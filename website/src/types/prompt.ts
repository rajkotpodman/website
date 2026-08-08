export interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  style: string;
  author: string;
  image: string;
  featured: boolean;
}

export interface FilterOptions {
  searchQuery: string;
  category: string | null;
  style: string | null;
  featuredOnly: boolean;
}
