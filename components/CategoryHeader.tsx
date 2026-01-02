// components/CategoryHeader.tsx
'use client'
import Link from 'next/link';

interface CategoryHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  totalItems?: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: 'grid-4' | 'grid-5' | 'list';
  setViewMode: (value: 'grid-4' | 'grid-5' | 'list') => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  breadcrumbs, 
  totalItems,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="w-full bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left - Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link 
                    href={crumb.href}
                    className="hover:text-gray-700 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-700">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </div>
            ))}
          </div>

          {/* Right - Sort and View Options */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white text-gray-700 py-2 pl-4 pr-8 text-sm font-normal focus:outline-none cursor-pointer border-none"
              >
                <option value="default">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="rating">Sort by average rating</option>
                <option value="latest">Sort by latest</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1">
              {/* 4 Column Grid */}
              <button
                onClick={() => setViewMode('grid-4')}
                className={`p-2 rounded transition-all cursor-pointer ${
                  viewMode === 'grid-4'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                aria-label="4 column grid view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>

              {/* 3 Column Grid */}
              <button
                onClick={() => setViewMode('grid-5')}
                className={`p-2 rounded transition-all cursor-pointer ${
                  viewMode === 'grid-5'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                aria-label="3 column grid view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="6" height="7" rx="1" />
                  <rect x="10" y="3" width="6" height="7" rx="1" />
                  <rect x="18" y="3" width="4" height="7" rx="1" />
                  <rect x="2" y="14" width="6" height="7" rx="1" />
                  <rect x="10" y="14" width="6" height="7" rx="1" />
                  <rect x="18" y="14" width="4" height="7" rx="1" />
                </svg>
              </button>

              {/* List View */}
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                aria-label="List view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="2" rx="1" />
                  <rect x="3" y="11" width="18" height="2" rx="1" />
                  <rect x="3" y="18" width="18" height="2" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Optional: Item Count */}
        {totalItems !== undefined && (
          <div className="mt-3 text-sm text-gray-500">
            Showing {totalItems} {totalItems === 1 ? 'result' : 'results'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryHeader;