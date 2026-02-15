/**
 * Icon suggestion and search panel for adding visual elements to slides.
 * @source docs/modules/ai-assistant/visual-suggestions.md
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Slide, SlideElement } from '@/types/slide';
import type { IconEntry, IconSuggestion, SuggestedIcon } from '@/types/ai';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface IconPanelProps {
  /** Current active slide for context-aware suggestions. */
  slide: Slide;
  /** Callback when user adds an icon (null elementId = new element). */
  onAddIcon: (elementId: string | null, icon: IconEntry) => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Search input with debounce support. */
function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
        {/* Search icon placeholder */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        type="text"
        className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Search icons..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** Renders a grid of icons. */
function IconGrid({
  icons,
  onSelect,
}: {
  icons: (SuggestedIcon | IconEntry)[];
  onSelect: (icon: IconEntry) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {icons.map((icon, idx) => {
        const name = 'iconName' in icon ? icon.iconName : icon.name;
        const category = 'category' in icon ? icon.category : '';

        return (
          <button
            key={`${name}-${idx}`}
            className="flex flex-col items-center gap-1 rounded-md border p-2 text-center transition-colors hover:bg-accent"
            onClick={() =>
              onSelect({
                name,
                source: 'source' in icon ? icon.source : 'lucide',
                category,
                tags: 'tags' in icon ? icon.tags : [],
              })
            }
            title={name}
          >
            {/* TODO: Render actual Lucide icon component via dynamic import */}
            <span className="text-xl">
              {/* Placeholder icon glyph */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
            </span>
            <span className="w-full truncate text-[0.625rem] text-muted-foreground">
              {name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Renders a group of AI suggestions for a specific slide element. */
function SuggestionGroup({
  suggestion,
  onSelect,
  onAddToSlide,
}: {
  suggestion: IconSuggestion;
  onSelect: (icon: SuggestedIcon) => void;
  onAddToSlide: (elementId: string, icon: SuggestedIcon) => void;
}) {
  const [selectedIcon, setSelectedIcon] = useState<SuggestedIcon | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Suggested for element
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestion.icons.map((icon, idx) => (
          <button
            key={`${icon.iconName}-${idx}`}
            className={`flex flex-col items-center gap-0.5 rounded-md border p-2 text-xs transition-colors hover:bg-accent ${
              selectedIcon?.iconName === icon.iconName
                ? 'border-primary bg-accent'
                : ''
            }`}
            onClick={() => {
              setSelectedIcon(icon);
              onSelect(icon);
            }}
          >
            {/* TODO: Render actual icon */}
            <span className="text-lg">*</span>
            <span className="truncate">{icon.iconName}</span>
          </button>
        ))}
      </div>
      {selectedIcon && (
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs"
          onClick={() => onAddToSlide(suggestion.slideId, selectedIcon)}
        >
          + Add to slide
        </Button>
      )}
    </div>
  );
}

/** Displays recently used icons. */
function RecentIcons({
  icons,
  onSelect,
}: {
  icons: IconEntry[];
  onSelect: (icon: IconEntry) => void;
}) {
  if (icons.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground">
        Recent Icons
      </h4>
      <div className="flex flex-wrap gap-2">
        {icons.map((icon, idx) => (
          <button
            key={`${icon.name}-${idx}`}
            className="rounded-md border p-2 transition-colors hover:bg-accent"
            onClick={() => onSelect(icon)}
            title={icon.name}
          >
            {/* TODO: Render actual icon */}
            <span className="text-sm">*</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function IconPanel({ slide, onAddIcon }: IconPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IconEntry[]>([]);
  const [suggestions, setSuggestions] = useState<IconSuggestion[]>([]);
  const [recentIcons, setRecentIcons] = useState<IconEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch AI-powered icon suggestions when slide changes
  useEffect(() => {
    // TODO: Call suggestIcons() from @/lib/ai/icon-suggestions
    // setSuggestions(result);
  }, [slide.id]);

  // TODO: Search icon library with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // TODO: Call searchIcons() from @/config/icon-library
        // setSearchResults(results);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddIcon = useCallback(
    (elementId: string | null, icon: IconEntry) => {
      onAddIcon(elementId, icon);
      // Track recently used icons (max 10)
      setRecentIcons((prev) => {
        const filtered = prev.filter((i) => i.name !== icon.name);
        return [icon, ...filtered].slice(0, 10);
      });
    },
    [onAddIcon],
  );

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-sm font-semibold">Visual Suggestions</h3>

      {/* Search */}
      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      {/* Search results */}
      {searchQuery.trim() && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">
            Search Results
          </h4>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : searchResults.length > 0 ? (
            <IconGrid
              icons={searchResults}
              onSelect={(icon) => handleAddIcon(null, icon)}
            />
          ) : (
            <p className="py-2 text-center text-xs text-muted-foreground">
              No icons found for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      )}

      {/* AI suggestions */}
      {!searchQuery.trim() && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <SuggestionGroup
              key={`${suggestion.slideId}-${idx}`}
              suggestion={suggestion}
              onSelect={() => {
                /* highlight in preview */
              }}
              onAddToSlide={(slideId, icon) =>
                handleAddIcon(slideId, {
                  name: icon.iconName,
                  source: 'lucide',
                  category: '',
                  tags: [],
                })
              }
            />
          ))}
        </div>
      )}

      {/* Placeholder when no suggestions yet */}
      {!searchQuery.trim() && suggestions.length === 0 && (
        <p className="py-4 text-center text-xs text-muted-foreground">
          Icon suggestions will appear based on your slide content
        </p>
      )}

      {/* Recent icons */}
      <div className="border-t pt-3">
        <RecentIcons
          icons={recentIcons}
          onSelect={(icon) => handleAddIcon(null, icon)}
        />
      </div>
    </div>
  );
}
