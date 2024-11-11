import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import BookResults from '../components/BookResults';
import LanguageDropdown from '../components/LanguageDropdown';
import '../styles/homepage.css';

const HomePage = () => {
  // State for managing search and loading results
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  // State for search type and pagination
  const [searchType, setSearchType] = useState('all');
  const [currentPageBasic, setCurrentPageBasic] = useState(1);
  const [currentPageAdvanced, setCurrentPageAdvanced] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // State for toggling between Basic and Advanced search
  const [isAccordion, setIsAccordion] = useState(true);

  // Language state for both search types
  const [basicLanguage, setBasicLanguage] = useState('');
  const [advancedLanguage, setAdvancedLanguage] = useState('');

  // State for storing advanced search parameters
  const [advancedSearch, setAdvancedSearch] = useState({
    author: '',
    title: '',
    year: '',
    subject: '',
    publisher: ''
  });

  // Function to handle API search requests for both basic and advanced search
  const handleSearch = async (query, pageNumber = 1, language = '', isAdvanced = false) => {
    const params = new URLSearchParams({
      page: pageNumber,
      limit: 12,
    });

    // Append advanced search related filters
    if (isAdvanced) {
      if (advancedSearch.author) params.append('author', advancedSearch.author);
      if (advancedSearch.title) params.append('title', advancedSearch.title);
      if (advancedSearch.year) params.append('first_publish_year', advancedSearch.year);
      if (advancedSearch.subject) params.append('subject', advancedSearch.subject);
      if (advancedSearch.publisher) params.append('publisher', advancedSearch.publisher);
      if (language) params.append('language', language);
    } else {
      // Append filters for basic search
      if (query) params.append(searchType === 'all' ? 'q' : searchType, query);
      if (language) params.append('language', language);
    }
    setLoading(true);
    try {
      // Fetch search results from the Open Library API
      const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
      const data = await response.json();
      setBooks(data.docs);
      setTotalPages(Math.ceil(data.numFound / 12)); // Calculate total pages based on results
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
    setHasSearched(true); 
  };

  // Handler for a basic search
  const onSearch = (query = '', searchType = 'all') => {
    setSearchQuery(query);
    setCurrentPageBasic(1); // Reset pagination for a new search
    handleSearch(query, 1, basicLanguage, false);
  };

  // Handler for an advanced search
  const onAdvancedSearch = () => {
    setCurrentPageAdvanced(1); // Reset pagination for a new search
    handleSearch('', 1, advancedLanguage, true);
  };

  // Language selection handler based on basic/advanced search
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    if (isAccordion) {
      setBasicLanguage(newLanguage); 
      handleSearch(searchQuery, 1, newLanguage, false);
    } else {
      setAdvancedLanguage(newLanguage);
      handleSearch('', 1, newLanguage, true);
    }
  };

  // Function to toggle between Basic and Advanced search modes
  const toggleAccordion = () => {
    setIsAccordion(!isAccordion);
    setBooks([]);
    setHasSearched(false);
    setSearchQuery(''); // Clear search query
    setAdvancedSearch({
      author: '',
      title: '',
      year: '',
      subject: '',
      publisher: ''
    });
    setBasicLanguage(''); // Reset language for basic search
    setAdvancedLanguage(''); // Reset language for advanced search
  };

  // Single search handler for advanced search
  const handleAdvancedSearchChange = (event) => {
    const { name, value } = event.target;
    setAdvancedSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handlers for opening and closing a modal with book details
  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="container">
      <h1>Your Book Finder</h1>

      {/* Render SearchBar component for Basic Search */}
      {isAccordion && (
        <SearchBar
          onSearch={onSearch}
          searchType={searchType}
          handleSearchTypeChange={(e) => setSearchType(e.target.value)}
          selectedLanguage={basicLanguage}
          handleLanguageChange={handleLanguageChange}
          hasSearched={hasSearched}
        />
      )}

      {/* Toggle button for switching between Basic and Advanced search */}
      <button className='advanced-button' onClick={toggleAccordion}>
        {isAccordion ? 'Show Advanced Search' : 'Back to Basic Search'}
      </button>

      {/* Advanced search */}
      {!isAccordion && (
        <div className="advanced-search">
          <p>Advanced Search Options:</p>
          {/* Render input fields for each advanced search criterion */}
          {['author', 'title', 'year', 'subject', 'publisher'].map((field) => (
            <label key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                type="text"
                name={field}
                value={advancedSearch[field]}
                onChange={handleAdvancedSearchChange}
                placeholder={`Enter ${field}`}
              />
            </label>
          ))}
          {/* Language dropdown for advanced search */}
          {hasSearched && <LanguageDropdown 
            selectedLanguage={advancedLanguage} 
            handleLanguageChange={handleLanguageChange} 
          />}
          <button onClick={onAdvancedSearch}>Search</button>
        </div>
      )}

      {/* Render BookResults component to display search results */}
      <BookResults
        books={books}
        loading={loading}
        hasSearched={hasSearched}
        openModal={openModal}
        selectedBook={selectedBook}
        closeModal={closeModal}
      />

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => {
            const newPage = isAccordion ? currentPageBasic - 1 : currentPageAdvanced - 1;
            if (newPage >= 1) {
              isAccordion ? setCurrentPageBasic(newPage) : setCurrentPageAdvanced(newPage);
              handleSearch(
                searchQuery,
                newPage,
                isAccordion ? basicLanguage : advancedLanguage,
                !isAccordion
              );
            }
          }}
          disabled={isAccordion ? currentPageBasic === 1 : currentPageAdvanced === 1}
        >
          Previous
        </button>
        <span>
          Page {isAccordion ? currentPageBasic : currentPageAdvanced} of {totalPages}
        </span>
        <button
          onClick={() => {
            const newPage = isAccordion ? currentPageBasic + 1 : currentPageAdvanced + 1;
            if (newPage <= totalPages) {
              isAccordion ? setCurrentPageBasic(newPage) : setCurrentPageAdvanced(newPage);
              handleSearch(
                searchQuery,
                newPage,
                isAccordion ? basicLanguage : advancedLanguage,
                !isAccordion
              );
            }
          }}
          disabled={isAccordion ? currentPageBasic === totalPages : currentPageAdvanced === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
