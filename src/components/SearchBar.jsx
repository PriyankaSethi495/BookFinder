// src/components/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch, searchType, handleSearchTypeChange }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className='search-container'>
        {/* Search Type Dropdown */}
        <div className="search-type">
            <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="all">All</option>
            <option value="author">Author</option>
            <option value="title">Title</option>
            <option value="subject">Subject</option>
            </select>
        </div>
        <div className="search-bar">
        <input
            type="text"
            placeholder="Search for a book..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
            Search
        </button>
        </div>
    </div>
  );
};

export default SearchBar;
