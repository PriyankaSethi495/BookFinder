import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import BookResults from '../components/BookResults';
import '../styles/homepage.css';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchType, setSearchType] = useState('all');
  const [currentPageBasic, setCurrentPageBasic] = useState(1);
  const [currentPageAdvanced, setCurrentPageAdvanced] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isAccordion, setIsAccordion] = useState(true); // Toggle for advanced search
  const [basicLanguage, setBasicLanguage] = useState(''); // Basic search language
  const [advancedSearch, setAdvancedSearch] = useState({
    author: '',
    title: '',
    year: '',
    subject: '',
    publisher: ''
  });
  const [advancedLanguage, setAdvancedLanguage] = useState(''); // Advanced search language

  const handleSearch = async (query, pageNumber = 1, language = '', isAdvanced = false) => {
    const params = new URLSearchParams({
      page: pageNumber,
      limit: 12,
    });

    if (isAdvanced) {
      if (advancedSearch.author) params.append('author', advancedSearch.author);
      if (advancedSearch.title) params.append('title', advancedSearch.title);
      if (advancedSearch.year) params.append('first_publish_year', advancedSearch.year);
      if (advancedSearch.subject) params.append('subject', advancedSearch.subject);
      if (advancedSearch.publisher) params.append('publisher', advancedSearch.publisher);
      if (language) params.append('language', language);
    } else {
      if (query) params.append(searchType === 'all' ? 'q' : searchType, query);
      if (language) params.append('language', language);
    }

    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
      const data = await response.json();
      setBooks(data.docs);
      setTotalPages(Math.ceil(data.numFound / 12));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
    setHasSearched(true);
  };

  // Handle basic search
  const onSearch = (query = '', searchType = 'all') => {
    setSearchQuery(query);
    setCurrentPageBasic(1);
    handleSearch(query, 1, basicLanguage, false);
  };

  // Advanced search submission
  const onAdvancedSearch = () => {
    setCurrentPageAdvanced(1);
    handleSearch('', 1, advancedLanguage, true);
  };

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

  // Handle toggling between Basic and Advanced search
  const toggleAccordion = () => {
    setIsAccordion(!isAccordion);
    setBooks([]);
    setHasSearched(false);
    setSearchQuery('');
    setAdvancedSearch({
      author: '',
      title: '',
      year: '',
      subject: '',
      publisher: ''
    });
    setBasicLanguage('');
    setAdvancedLanguage('');
  };

  // Update Advanced Search Fields
  const handleAdvancedSearchChange = (event) => {
    const { name, value } = event.target;
    setAdvancedSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="container">
      <h1>Your Book Finder</h1>

      {isAccordion && <SearchBar
        onSearch={onSearch}
        searchType={searchType}
        handleSearchTypeChange={(e) => setSearchType(e.target.value)}
        selectedLanguage={isAccordion ? basicLanguage : advancedLanguage}
        handleLanguageChange={handleLanguageChange}
        hasSearched={hasSearched}
      />}

      <button className='advanced-button' onClick={toggleAccordion}>
        {isAccordion ? 'Show Advanced Search' : 'Back to Basic Search'}
      </button>

      {!isAccordion && (
        <div className="advanced-search">
          <p>Advanced Search Options:</p>
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
          <button onClick={onAdvancedSearch}>Search</button>
        </div>
      )}

      <BookResults
        books={books}
        loading={loading}
        hasSearched={hasSearched}
        openModal={openModal}
        selectedBook={selectedBook}
        closeModal={closeModal}
      />

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
