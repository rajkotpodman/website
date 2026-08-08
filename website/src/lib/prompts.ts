import { Prompt, FilterOptions } from '@/types/prompt';

export async function fetchPrompts(): Promise<Prompt[]> {
  try {
    // Load prompts from static JSON file (for static export / GitHub Pages)
    const response = await fetch('/sample-prompts.json');
    if (!response.ok) {
      console.error('Failed to load sample-prompts.json');
      return [];
    }
    const data = await response.json();
    const prompts = data.prompts || [];
    console.log(`✓ Loaded ${prompts.length} prompts from sample-prompts.json`);
    return prompts;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
}

export function filterPrompts(prompts: Prompt[], filters: FilterOptions): Prompt[] {
  return prompts.filter(prompt => {
    // Search query filter
    const matchesSearch = filters.searchQuery === '' ||
      prompt.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(filters.searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = !filters.category || prompt.category === filters.category;

    // Style filter
    const matchesStyle = !filters.style || prompt.style === filters.style;

    // Featured filter
    const matchesFeatured = !filters.featuredOnly || prompt.featured;

    return matchesSearch && matchesCategory && matchesStyle && matchesFeatured;
  });
}

export function getUniqueCategories(prompts: Prompt[]): string[] {
  return Array.from(new Set(prompts.map(p => p.category))).sort();
}

export function getUniqueStyles(prompts: Prompt[]): string[] {
  return Array.from(new Set(prompts.map(p => p.style))).sort();
}
