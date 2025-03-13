// AdvancedSearch.jsx
import React from 'react';
import LanguageDropdown from './LanguageDropdown';

const AdvancedSearch = ({ advancedSearch, onAdvancedSearch, handleAdvancedSearchChange, selectedLanguage, handleLanguageChange, hasSearched }) => (
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onAdvancedSearch(); // Call the additional function
            }
          }} 
        />
      </label>
    ))}
    {/* Language dropdown for advanced search */}
    {hasSearched && <LanguageDropdown selectedLanguage={selectedLanguage} handleLanguageChange={handleLanguageChange} />}
    <button onClick={onAdvancedSearch}>Search</button>
  </div>
);

export default AdvancedSearch;
