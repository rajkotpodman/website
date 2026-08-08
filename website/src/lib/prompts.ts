import { Prompt, FilterOptions } from '@/types/prompt';

export async function fetchPrompts(): Promise<Prompt[]> {
  try {
    // Try to fetch from CMS API if available
    const cmsHost = process.env.NEXT_PUBLIC_CMS_HOST;
    if (cmsHost) {
      try {
        const response = await fetch('/api/prompts');
        if (response.ok) {
          const data = await response.json();
          console.log(`✓ Loaded ${data.length} prompts from CMS API`);
          return data;
        }
      } catch (cmsError) {
        console.warn('CMS API unavailable, falling back to sample data:', cmsError);
      }
    }

    // Fallback to sample data
    const response = await fetch('/sample-prompts.json');
    const data = await response.json();
    const prompts = data.prompts || [];
    console.log(`✓ Loaded ${prompts.length} sample prompts from JSON`);
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
