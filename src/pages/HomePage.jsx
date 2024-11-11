import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import BookResults from '../components/BookResults';
import '../styles/homepage.css';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // To store the selected book for modal
  const [selectedLanguage, setSelectedLanguage] = useState(''); // Store selected language
  const [searchType, setSearchType] = useState('all'); // Store the selected search type

  // Fetch books based on the search query, page, language, and subject
  const handleSearch = async (query, searchType = 'all', pageNumber = 1, language = '') => {
    if (!query) return;
    setLoading(true);
    try {
      let url = `https://openlibrary.org/search.json?page=${pageNumber}&limit=12`;
      const encodedQuery = encodeURIComponent(query);
      if (searchType === 'title') {
        url += `&title=${encodedQuery}`;
      } else if (searchType === 'author') {
        url += `&author=${encodedQuery}`;
      } else if (searchType === 'subject') {
        url += `&subject=${encodedQuery}`;
      } else {
        url += `&q=${encodedQuery}`;  // Default search for "all" fields
      }

      if (language) url += `&language=${language}`;

      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
    setHasSearched(true);
  };

  // Handle the search operation
  const onSearch = (query = '', searchType = 'all') => {
    if (!query) return;
    setSearchQuery(query);
    handleSearch(query, searchType, 1, selectedLanguage);
  };

  // Update search type
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
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

      {/* Display Book Results with pagination handled in BookResults */}
      <BookResults
        books={books}
        loading={loading}
        hasSearched={hasSearched}
        openModal={openModal}
        selectedBook={selectedBook}
        closeModal={closeModal}
        handleSearch={handleSearch} // Pass handleSearch if needed for specific page
      />
    </div>
  );
};

export default HomePage;
