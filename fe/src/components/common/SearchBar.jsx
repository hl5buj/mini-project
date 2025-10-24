import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({
  onSearch,
  placeholder = '검색...',
  initialValue = '',
  debounceMs = 500
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Update internal state when initial value changes (e.g., from URL)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-disabled]">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-[--color-bg-secondary] border border-[--color-border] rounded-full text-[--color-text-primary] placeholder-[--color-text-disabled] focus:outline-none focus:border-[--color-primary] transition-colors"
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-disabled] hover:text-[--color-text-primary] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  debounceMs: PropTypes.number,
};

export default SearchBar;
