'use client';

import { useState, useEffect } from 'react';
import { Prompt, FilterOptions } from '@/types/prompt';
import { fetchPrompts, filterPrompts, getUniqueCategories, getUniqueStyles } from '@/lib/prompts';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import PromptCard from './PromptCard';

export default function Gallery() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: null,
    style: null,
    featuredOnly: false,
  });

  // Load prompts on mount
  useEffect(() => {
    async function loadPrompts() {
      try {
        const data = await fetchPrompts();
        setPrompts(data);
        setCategories(getUniqueCategories(data));
        setStyles(getUniqueStyles(data));
        setFilteredPrompts(data);
      } catch (error) {
        console.error('Failed to load prompts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPrompts();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    const filtered = filterPrompts(prompts, filters);
    setFilteredPrompts(filtered);
  }, [filters, prompts]);

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleCategoryChange = (category: string | null) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleStyleChange = (style: string | null) => {
    setFilters(prev => ({ ...prev, style }));
  };

  const handleFeaturedChange = (featured: boolean) => {
    setFilters(prev => ({ ...prev, featuredOnly: featured }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar value={filters.searchQuery} onChange={handleSearchChange} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              categories={categories}
              styles={styles}
              selectedCategory={filters.category}
              selectedStyle={filters.style}
              featuredOnly={filters.featuredOnly}
              onCategoryChange={handleCategoryChange}
              onStyleChange={handleStyleChange}
              onFeaturedChange={handleFeaturedChange}
              totalResults={filteredPrompts.length}
            />
          </div>

          {/* Gallery Grid */}
          <div className="lg:col-span-3">
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No prompts found
                </h3>
                <p className="mt-2 text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrompts.map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
