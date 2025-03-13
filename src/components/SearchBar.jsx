import React, { useState } from 'react';
import '../styles/homepage.css'
import LanguageDropdown from './LanguageDropdown';

const SearchBar = ({ onSearch, searchType, handleSearchTypeChange, selectedLanguage, handleLanguageChange, hasSearched }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // Pass query and current searchType to onSearch
    onSearch(query, searchType);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        onSearch(query, searchType);
    }
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
            onKeyDown={handleKeyPress}  
            className="search-input"
        />
        
        {/* Language Filter Dropdown */}
        {hasSearched && (
        <LanguageDropdown 
          selectedLanguage={selectedLanguage} 
          handleLanguageChange={handleLanguageChange} 
        />
      )}
        
        <button onClick={handleSearch} className="search-button">
            Search
        </button>
    </div>
  );
};

export default SearchBar;
