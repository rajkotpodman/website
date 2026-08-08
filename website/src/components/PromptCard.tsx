'use client';

import Image from 'next/image';
import { Prompt } from '@/types/prompt';
import { useState } from 'react';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <Image
          src={prompt.image}
          alt={prompt.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {prompt.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
          {prompt.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {prompt.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {prompt.category}
          </span>
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {prompt.style}
          </span>
        </div>

        {/* Author */}
        <div className="text-xs text-gray-500 mb-3">
          by <span className="font-semibold">{prompt.author}</span>
        </div>

        {/* Full Content Preview */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700 mb-3">
              {prompt.content}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-auto w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-sm"
        >
          {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>
    </div>
  );
}
