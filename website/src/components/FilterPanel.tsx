'use client';

import { useCallback } from 'react';

interface FilterPanelProps {
  categories: string[];
  styles: string[];
  selectedCategory: string | null;
  selectedStyle: string | null;
  featuredOnly: boolean;
  onCategoryChange: (category: string | null) => void;
  onStyleChange: (style: string | null) => void;
  onFeaturedChange: (featured: boolean) => void;
  totalResults: number;
}

export default function FilterPanel({
  categories,
  styles,
  selectedCategory,
  selectedStyle,
  featuredOnly,
  onCategoryChange,
  onStyleChange,
  onFeaturedChange,
  totalResults,
}: FilterPanelProps) {
  const handleClearFilters = useCallback(() => {
    onCategoryChange(null);
    onStyleChange(null);
    onFeaturedChange(false);
  }, [onCategoryChange, onStyleChange, onFeaturedChange]);

  const hasActiveFilters = selectedCategory || selectedStyle || featuredOnly;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 max-h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-900">{totalResults}</span> prompts found
        </p>
      </div>

      {/* Featured Filter */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => onFeaturedChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-3 text-sm font-semibold text-gray-700">
            ⭐ Featured Only
          </span>
        </label>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Category</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat}
                  onChange={() => onCategoryChange(selectedCategory === cat ? null : cat)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700 hover:text-gray-900">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Style Filter */}
      {styles.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Style</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {styles.map((style) => (
              <label key={style} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="style"
                  checked={selectedStyle === style}
                  onChange={() => onStyleChange(selectedStyle === style ? null : style)}
                  className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="ml-3 text-sm text-gray-700 hover:text-gray-900">
                  {style}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
