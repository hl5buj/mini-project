import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import CourseCard from '../../components/courses/CourseCard';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get initial values from URL
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || '-created_at';
  const initialCategory = searchParams.get('category') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [categories, setCategories] = useState([]);

  // Sync URL params with state
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (sortBy !== '-created_at') params.sort = sortBy;
    if (selectedCategory) params.category = selectedCategory;
    if (currentPage !== 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [searchTerm, sortBy, selectedCategory, currentPage, setSearchParams]);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, sortBy, selectedCategory, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        ordering: sortBy,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const data = await courseService.getCourses(params);

      setCourses(data.results || []);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);

      // Extract unique categories from all courses
      const uniqueCategories = [...new Set(
        (data.results || [])
          .map(course => course.category)
          .filter(cat => cat && cat.trim() !== '')
      )].sort();
      setCategories(uniqueCategories);

      // Calculate total pages
      if (data.count) {
        const pageSize = data.results?.length || 10;
        setTotalPages(Math.ceil(data.count / pageSize));
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('강의를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[--color-bg-dark] py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">
            강의 둘러보기
          </h1>
          <p className="text-[--color-text-secondary]">
            다양한 강의를 찾아보고 학습을 시작하세요
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="강의 제목, 설명, 강사명으로 검색..."
                initialValue={searchTerm}
              />
            </div>

            {/* Sort */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-2.5 bg-[--color-bg-secondary] border border-[--color-border] rounded-md text-[--color-text-primary] focus:outline-none focus:border-[--color-primary] transition-colors"
              >
                <option value="-created_at">최신순</option>
                <option value="created_at">오래된순</option>
                <option value="-lectures_count">레슨 많은순</option>
                <option value="lectures_count">레슨 적은순</option>
                <option value="title">제목순 (A-Z)</option>
                <option value="-title">제목순 (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-sm text-[--color-text-secondary] whitespace-nowrap">
                카테고리:
              </span>
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === ''
                    ? 'bg-[--color-primary] text-white'
                    : 'bg-[--color-bg-secondary] text-[--color-text-secondary] hover:bg-[--color-bg-dark] hover:text-[--color-text-primary] border border-[--color-border]'
                }`}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-[--color-primary] text-white'
                      : 'bg-[--color-bg-secondary] text-[--color-text-secondary] hover:bg-[--color-bg-dark] hover:text-[--color-text-primary] border border-[--color-border]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-12 w-12 text-[--color-primary]"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-[--color-text-secondary]">강의를 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-[--color-primary] text-5xl mb-4">⚠️</div>
            <p className="text-[--color-text-primary] text-lg mb-2">{error}</p>
            <Button variant="primary" onClick={fetchCourses}>
              다시 시도
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[--color-text-disabled] text-6xl mb-4">📚</div>
            <p className="text-[--color-text-primary] text-lg mb-2">
              {searchTerm ? '검색 결과가 없습니다' : '등록된 강의가 없습니다'}
            </p>
            <p className="text-[--color-text-secondary]">
              {searchTerm
                ? '다른 검색어로 시도해보세요'
                : '첫 번째 강의를 만들어보세요'}
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {(hasNext || hasPrev) && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrev}
                >
                  이전
                </Button>

                <div className="flex items-center gap-2 px-4">
                  <span className="text-[--color-text-primary] font-medium">
                    {currentPage}
                  </span>
                  <span className="text-[--color-text-secondary]">
                    / {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
