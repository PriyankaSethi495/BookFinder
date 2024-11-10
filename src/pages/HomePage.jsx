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
  const [allSubjects, setAllSubjects] = useState([]); // Store All subjects of the results
  const [selectedSubject, setSelectedSubject] = useState(''); // Store selected subject
  const [searchType, setSearchType] = useState('all'); // Store the selected search type

   // Fetch books based on the search query, page, language and subject
  const handleSearch = async (query, pageNumber = 1, language = '', subject = '', searchType = 'all') => {
    if (!query) return;
    setLoading(true);
    try {
      let url = `https://openlibrary.org/search.json?page=${pageNumber}&limit=12`;

      if (searchType === 'title') {
        url += `&title=${query}`;
      } else if (searchType === 'author') {
        url += `&author=${query}`;
      } else if (searchType === 'subject') {
        url += `&subject=${query}`;
      } else {
        url += `&q=${query}`;  // Default search for "all" fields
      }

      if (language) url += `&language=${language}`;
      if (subject) url += `&subject=${subject}`;

      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs);

      //Pagination
      setTotalPages(Math.ceil(data.numFound / 12));

      // Collect all subjects from the results
      const subjects = data.docs.flatMap(book => book.subject || []);
      const uniqueSubjects = Array.from(new Set(subjects));
      setAllSubjects(uniqueSubjects.slice(0, 10)); // Show top 10 subjects
    }  catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
    setHasSearched(true);
  };

  //Handle the search operation
  const onSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    handleSearch(query, 1, selectedLanguage, selectedSubject, searchType);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      handleSearch(searchQuery, newPage, selectedLanguage, selectedSubject, searchType);
    }
  };

   // Update search type
   const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleLanguageChange = (event) => {
    // Update selected language
    setSelectedLanguage(event.target.value);
     // Reset to first page when filter changes
    setPage(1);
    handleSearch(searchQuery, 1, event.target.value, selectedSubject, searchType);   // Fetch books with selected language
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const handleSubjectFilter = (event) => {
    setSelectedSubject(encodeURIComponent(event.target.value));
    setPage(1);
    handleSearch(searchQuery, 1, selectedLanguage, event.target.value, searchType);
  };

  return (
    <div className="container">
      <h1>Your Book Finder</h1>

            {/* Search Type Dropdown */}
      {/* Pass searchType and handleSearchTypeChange to SearchBar */}
      <SearchBar 
        onSearch={onSearch}
        searchType={searchType}
        handleSearchTypeChange={handleSearchTypeChange}
      />

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
        </select>
      </div>

       {/* Subject Filter Dropdown */}
      <div className="filter-section">
        <label htmlFor="subject">Select Subject:</label>
        <select id="subject" value={selectedSubject} onChange={handleSubjectFilter}>
          <option value="">All Subjects</option>
          {allSubjects.map((subject, index) => (
            <option key={index} value={subject}>{subject}</option>
          ))}
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
      {/* Display the modal when a book is selected */}
      {selectedBook && <BookModal book={selectedBook} closeModal={closeModal} />}
    </div>
  );
};

export default HomePage;
