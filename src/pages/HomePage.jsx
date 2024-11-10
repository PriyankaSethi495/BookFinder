import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import '../styles/homepage.css';
import Spinner from '../components/Spinner';
import BookModal from '../components/BookModal';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // To store the selected book for modal
  const [selectedLanguage, setSelectedLanguage] = useState(''); // Store selected language
  const [searchType, setSearchType] = useState('all'); // Store the selected search type

  // Fetch books based on the search query, page, language and subject
  const handleSearch = async (query, searchType = 'all', pageNumber = 1, language = '') => {
    if (!query) return;
    setLoading(true);
    try {
      let url = `https://openlibrary.org/search.json?page=${pageNumber}&limit=12`;
      const encodedQuery = encodeURIComponent(query);
      // Construct the URL based on search type
      if (searchType === 'title') {
        url += `&title=${encodedQuery}`;
      } else if (searchType === 'author') {
        url += `&author=${encodedQuery}`;
      } else if (searchType === 'subject') {
        url += `&subject=${encodedQuery}`;
      } else {
        url += `&q=${encodedQuery}`;  // Default search for "all" fields
      }

      // Add additional filters
      if (language) url += `&language=${language}`;

      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs);

      // Pagination logic
      setTotalPages(Math.ceil(data.numFound / 12));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
    setHasSearched(true);
  };

  // Handle the search operation
  const onSearch = (query='', searchType='all') => {
    if (!query) return; 
    setSearchQuery(query);
    setPage(1);
    handleSearch(query, searchType, 1, selectedLanguage);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      handleSearch(searchQuery, searchType, newPage, selectedLanguage);
    }
  };

  // Update search type
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleLanguageChange = (event) => {
    // Update selected language and reset to first page when filter changes
    setSelectedLanguage(event.target.value);
    setPage(1);
    handleSearch(searchQuery, searchType, 1, event.target.value);
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

      <SearchBar 
        onSearch={onSearch}
        searchType={searchType}
        handleSearchTypeChange={handleSearchTypeChange}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange} 
        hasSearched={hasSearched}
      />

      {loading && <Spinner />}
      <div className="book-results">
        {hasSearched && books.length === 0 ? (
          <p className="no-results">No books found. Try a different search.</p>
        ) : (
          books.map((book) => (
            <div key={book.key} className="book-card" onClick={() => openModal(book)}>
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="book-cover"
                />
              ) : (
                <div className="no-cover">No Cover Available</div>
              )}
              <h3>{book.title}</h3>
              <p>{book.author_name?.join(', ')}</p>
              <p>{book.first_publish_year}</p>
              {book.ratings_average ? (
                <div className="book-rating">
                  <span>Rating: {(book.ratings_average).toFixed(1)}</span><span> ({book.ratings_count} reviews)</span>
                </div>
              ) : (
                <p className="no-rating">No rating available</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={loading || page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Display the modal when a book is selected */}
      {selectedBook && <BookModal book={selectedBook} closeModal={closeModal} />}
    </div>
  );
};

export default HomePage;
