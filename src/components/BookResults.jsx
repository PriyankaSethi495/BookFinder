// src/components/BookResults.js
import React from 'react';
import BookModal from './BookModal';
import Spinner from './Spinner'; // Import Spinner here

const BookResults = ({ books, loading, hasSearched, openModal, selectedBook }) => {
  return (
    <div>
      {loading && <Spinner />} {/* Show Spinner when loading is true */}
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

      {/* Display the modal when a book is selected */}
      {selectedBook && <BookModal book={selectedBook} closeModal={() => openModal(null)} />}
    </div>
  );
};

export default BookResults;
