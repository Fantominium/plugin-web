import { useCallback, useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  onChange: (selected: string[]) => void;
  selectedCategories?: string[];
  showCount?: boolean;
  categoryCount?: Record<string, number>;
}

export default function CategoryFilter({
  categories,
  onChange,
  selectedCategories = [],
  showCount = false,
  categoryCount = {},
}: CategoryFilterProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedCategories));

  const handleToggle = useCallback(
    (category: string) => {
      const newSelected = new Set(selected);
      if (newSelected.has(category)) {
        newSelected.delete(category);
      } else {
        newSelected.add(category);
      }
      setSelected(newSelected);
      onChange(Array.from(newSelected));
    },
    [selected, onChange],
  );

  const handleClearAll = useCallback(() => {
    setSelected(new Set());
    onChange([]);
  }, [onChange]);

  return (
    <div className="category-filter">
      <fieldset>
        <legend className="text-lg font-semibold mb-4">Categories</legend>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`cat-${category}`}
                checked={selected.has(category)}
                onChange={() => handleToggle(category)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor={`cat-${category}`} className="ml-2 cursor-pointer flex-1">
                {category}
                {showCount && categoryCount[category] && (
                  <span className="ml-2 text-sm text-gray-500">({categoryCount[category]})</span>
                )}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {selected.size > 0 && (
        <button
          type="button"
          onClick={handleClearAll}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
          aria-label="Clear all category filters"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
