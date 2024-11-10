// src/components/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch, searchType, handleSearchTypeChange, selectedLanguage, handleLanguageChange, hasSearched }) => {
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
  
        <input
            type="text"
            placeholder="Search for a book..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
        />
    {/* Language Filter Dropdown */}
      {hasSearched && <div className="filter-section">
        <select value={selectedLanguage} onChange={handleLanguageChange}>
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
        </select>
      </div>}
        <button onClick={handleSearch} className="search-button">
            Search
        </button>
        </div>
  
  );
};

export default SearchBar;
