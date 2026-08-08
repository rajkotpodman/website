'use client';

import Image from 'next/image';
import { Prompt } from '@/types/prompt';
import { useState, useCallback, useRef } from 'react';

/**
 * Props for the production-ready PromptCard component.
 */
interface PromptCardProps {
  prompt: Prompt;
  /** Optional callback when card is deleted (for admin/gallery integration) */
  onDelete?: (id: number) => void;
  /** Optional callback when card is favorited */
  onFavorite?: (id: number) => void;
}

/**
 * Generate a deterministic gradient background from a category string.
 * Used as a placeholder before the image loads or if the image fails.
 */
const CATEGORY_GRADIENTS: Record<string, string> = {
  photography: 'from-amber-400 to-orange-500',
  illustration: 'from-violet-400 to-purple-500',
  writing: 'from-emerald-400 to-teal-500',
  coding: 'from-cyan-400 to-blue-500',
  design: 'from-pink-400 to-rose-500',
  marketing: 'from-lime-400 to-green-500',
  default: 'from-blue-400 to-indigo-500',
};

/**
 * Production-ready Prompt Gallery Card component.
 *
 * Features:
 * - Accessible keyboard navigation and ARIA attributes
 * - Copy-to-clipboard with visual feedback toast
 * - Optimistic favorite toggle with callback
 * - Image error boundary with gradient fallback
 * - Skeleton loading state (via PromptCardSkeleton export)
 * - Scroll-shadow for long content previews
 */
export default function PromptCard({
  prompt,
  onDelete,
  onFavorite,
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Show a temporary toast message */
  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2000);
  }, []);

  /** Copy prompt content to clipboard with error handling */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      showToast('Copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt.content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Copied to clipboard!');
      } catch {
        showToast('Failed to copy');
      }
      document.body.removeChild(textarea);
    }
  }, [prompt.content, showToast]);

  /** Optimistic favorite toggle */
  const handleFavorite = useCallback(() => {
    setIsFavorited((prev) => !prev);
    onFavorite?.(prompt.id);
  }, [prompt.id, onFavorite]);

  /** Get gradient class based on category */
  const gradientClass =
    CATEGORY_GRADIENTS[prompt.category.toLowerCase()] ??
    CATEGORY_GRADIENTS.default;

  return (
    <article
      className={`
        relative bg-white rounded-xl shadow-md overflow-hidden
        hover:shadow-xl transition-shadow duration-300
        h-full flex flex-col group/card
        ${prompt.featured ? 'ring-2 ring-yellow-400' : ''}
      `}
      aria-label={`Prompt card: ${prompt.title}`}
    >
      {/* ───────── Toast Notification ───────── */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="
            absolute top-3 left-1/2 -translate-x-1/2 z-20
            bg-gray-900 text-white text-xs px-4 py-2 rounded-full
            shadow-lg animate-fade-in
          "
        >
          {toastMessage}
        </div>
      )}

      {/* ───────── Image Section ───────── */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {/* Gradient placeholder visible until image loads */}
        {(!imageLoaded || imageError) && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white/70 text-4xl font-bold">
              {prompt.category.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {!imageError && (
          <Image
            src={prompt.image}
            alt={`Preview image for ${prompt.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-cover hover:scale-105 transition-transform duration-500
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Featured badge */}
        {prompt.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
            ⭐ Featured
          </div>
        )}

        {/* Favorite button (overlay on image) */}
        <button
          onClick={handleFavorite}
          className={`
            absolute top-3 left-3 p-2 rounded-full
            bg-white/80 backdrop-blur-sm shadow-md
            hover:bg-white transition-all duration-200
            ${isFavorited ? 'text-red-500' : 'text-gray-400'}
          `}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>

      {/* ───────── Content Section ───────── */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 leading-snug">
          {prompt.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {prompt.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
            {prompt.category}
          </span>
          <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">
            {prompt.style}
          </span>
        </div>

        {/* Author */}
        <div className="text-xs text-gray-400 mb-3">
          by <span className="font-semibold text-gray-500">{prompt.author}</span>
        </div>

        {/* ───────── Expanded Content Preview ───────── */}
        {isExpanded && (
          <div
            className="
              mt-3 pt-3 border-t border-gray-100
              max-h-48 overflow-y-auto pr-1
              scrollbar-thin scrollbar-thumb-gray-300
              [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
            "
            role="region"
            aria-label="Prompt content preview"
          >
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {prompt.content}
            </p>
          </div>
        )}

        {/* ───────── Action Buttons ───────── */}
        <div className="mt-auto pt-3 flex gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="
              flex-1 inline-flex items-center justify-center gap-1.5
              bg-gray-100 text-gray-700 py-2 rounded-lg
              hover:bg-gray-200 active:scale-95
              transition-all font-medium text-xs
              focus:outline-none focus:ring-2 focus:ring-gray-400
            "
            aria-label={`Copy content of ${prompt.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>

          {/* Expand/collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              flex-1 inline-flex items-center justify-center gap-1.5
              bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg
              hover:from-blue-600 hover:to-purple-700 active:scale-95
              transition-all font-semibold text-xs
              focus:outline-none focus:ring-2 focus:ring-purple-400
            "
            aria-expanded={isExpanded}
            aria-controls={`prompt-content-${prompt.id}`}
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Skeleton loader component for PromptCard.
 * Renders a placeholder animation while data is loading.
 *
 * @example
 * <PromptCardSkeleton />
 */
export function PromptCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 flex-grow flex flex-col gap-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-12" />
        </div>
        <div className="mt-auto flex gap-2">
          <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
