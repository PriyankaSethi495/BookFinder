import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import '../styles/homepage.css';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch books based on the search query, page, and language
  const handleSearch = async (query, pageNumber = 1) => {
    if (!query) return;
    setLoading(true);
    try {
      const url = `https://openlibrary.org/search.json?title=${query}&page=${pageNumber}&limit=12`;
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
    handleSearch(query, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
    setPage(newPage);
    handleSearch(searchQuery, newPage);
    }
  };


  return (
    <div className="container">
      <h1>Your Book Finder</h1>
      <SearchBar onSearch={onSearch} />
      {loading && <Spinner />}
      <div className="book-results">
        {hasSearched && books.length === 0 ? (
          <p className="no-results">No books found. Try a different search.</p>
        ) : (
          books.map((book) => (
            <div key={book.key} className="book-card">
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
    </div>
  );
};

export default HomePage;
