// LanguageDropdown.js
import React from 'react';

const LanguageDropdown = ({ selectedLanguage, handleLanguageChange }) => (
  <div className="filter-section">
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
  </div>
);

export default LanguageDropdown;
