import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import '../styles/homepage.css';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch books based on the search query, page, and language
  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const url = `https://openlibrary.org/search.json?title=${query}}`;
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
    setHasSearched(true);
  };

  return (
    <div className="container">
      <h1>Your Book Finder</h1>
      <SearchBar onSearch={handleSearch} />
      {loading ? (<p>Loading</p>):(
      <div className="book-results">
        {hasSearched && books.length === 0 ? (
          <p className="no-results">No books found. Try a different search.</p>
        ) : (
          books.map((book) => (
            <div key={book.key} className="book-card">
              <h3>{book.title}</h3>
              <p>{book.author_name?.join(', ')}</p>
              <p>{book.first_publish_year}</p>
            </div>
          ))
        )}
      </div>)} 
    </div>
  );
};

export default HomePage;
