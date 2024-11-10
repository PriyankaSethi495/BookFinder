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

  // Fetch books based on the search query, page, and language
  const handleSearch = async (query, pageNumber = 1, language = '') => {
    if (!query) return;
    setLoading(true);
    try {
      const url = `https://openlibrary.org/search.json?title=${query}&page=${pageNumber}&limit=12${language ? `&language=${language}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs);
      setTotalPages(Math.ceil(data.numFound / 12));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
    setHasSearched(true);
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    handleSearch(query, 1, selectedLanguage);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
    setPage(newPage);
    handleSearch(searchQuery, newPage, selectedLanguage);
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value); // Update selected language
    setPage(1); // Reset to first page when filter changes
    handleSearch(searchQuery, 1, event.target.value); // Fetch books with selected language
  };
  
  const openModal = (book) => {
    setSelectedBook(book); // Set the selected book data
  };

  const closeModal = () => {
    setSelectedBook(null); // Close the modal
  };


  return (
    <div className="container">
      <h1>Your Book Finder</h1>
      <SearchBar onSearch={onSearch} />
      
        {/* Language Filter Dropdown */}
        <div className="filter-section">
        <label htmlFor="language">Select Language:</label>
        <select id="language" value={selectedLanguage} onChange={handleLanguageChange}>
        <option value="">All Languages</option>
        <option value="eng">English</option>
        <option value="fre">French</option>
        <option value="ger">German</option>
        <option value="spa">Spanish</option>
        <option value="ita">Italian</option>
        <option value="chi">Chinese</option>
        <option value="cmn">Mandarin</option>
        <option value="hin">Hindi</option>
        <option value="por">Portuguese</option>
        <option value="und">Undetermined</option>
          {/* Add more language options as needed */}
        </select>
      </div>

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
              {/* Display Rating */}
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
      {selectedBook && <BookModal book={selectedBook} closeModal={closeModal} />} {/* Display the modal when a book is selected */}
    </div>
  );
};

export default HomePage;
