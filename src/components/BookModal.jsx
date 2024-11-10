import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Font Awesome close icon
import '../styles/bookmodal.css'; 
import RatingStars from './RatingStars';

const BookModal = ({ book, closeModal }) => {

  return (
    <div className="book-modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={closeModal}>
          <FaTimes />
        </span>
        <div className="modal-body">
          {/* Book Info Section */}
          <div className="book-info">
            <h2>{book.title}</h2>
            <p> {book.first_sentence ? `${book.first_sentence[0]}...` : ""}</p>

            <p><strong>Author:</strong> {book.author_name?.join(', ')}</p>
            <p><strong>First Published:</strong> {book.first_publish_year}</p>
            <p><strong>Language:</strong> {book.language?.join(', ')}</p>
          </div>

          {/* Rating Section */}
          <div className="book-rating-section">
            <h3>Rating</h3>
            <div className="rating-stars">
            <RatingStars rating={book.ratings_average}/>
            </div>
            {book.ratings_average ?  (                   
            <p><strong>Average Rating:</strong> {book.ratings_average?.toFixed(1)} ({book.ratings_count} reviews)</p>
        
          ) : (<p>No ratings available</p>)}
          </div>

          {/* Additional Info Section */}
          <div className="book-additional-info">
            <p><strong>Publisher(s):</strong> {book.publisher?.length ? book.publisher.join(', ') : "Information unavailable"}</p>
            <p><strong>Subject(s):</strong> {book.subject?.length ? book.subject.join(', ') : "Information unavailable"}</p>
            <p><strong>Available format(s):</strong> {book.format?.length ? book.format.join(', ') : "Information unavailable"}</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
