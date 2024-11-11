// src/pages/AdvancedSearch.jsx
import React, { useState } from 'react';
import BookResults from '../components/BookResults'; // Reuse BookResults component
import '../styles/advancedsearch.css'; // Import the CSS


const AdvancedSearch = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `https://openlibrary.org/search.json?limit=12`;

      if (title) url += `&title=${encodeURIComponent(title)}`;
      if (author) url += `&author=${encodeURIComponent(author)}`;
      if (year) url += `&publish_year=${encodeURIComponent(year)}`;
      if (publisher) url += `&publisher=${encodeURIComponent(publisher)}`;
      if (language) url += `&language=${encodeURIComponent(language)}`;

      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
    setHasSearched(true);
  };

  return (
    <div className="advanced-search container">
      <h2>Advanced Search</h2>
      
      {/* Title Input */}
      <div className="input-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          placeholder="Enter book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Author Input */}
      <div className="input-group">
        <label htmlFor="author">Author:</label>
        <input
          id="author"
          type="text"
          placeholder="Enter author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      {/* Year Input */}
      <div className="input-group">
        <label htmlFor="year">Year:</label>
        <input
          id="year"
          type="text"
          placeholder="Enter publication year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      {/* Publisher Input */}
      <div className="input-group">
        <label htmlFor="publisher">Publisher:</label>
        <input
          id="publisher"
          type="text"
          placeholder="Enter publisher name"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
        />
      </div>

      {/* Language Dropdown */}
      <div className="input-group">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Any</option>
          <option value="eng">English</option>
          <option value="fre">French</option>
          <option value="spa">Spanish</option>
          <option value="ger">German</option>
          <option value="ita">Italian</option>
          {/* Add other languages as needed */}
        </select>
      </div>

      {/* Search Button */}
      <button onClick={handleSearch}>Search</button>

      {/* Display Results */}
      <BookResults
        books={books}
        loading={loading}
        hasSearched={hasSearched}
        openModal={() => {}}
        selectedBook={null}
        closeModal={() => {}}
      />
    </div>
  );
};

export default AdvancedSearch;
