import React from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/homepage.css';

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const remainder = rating - fullStars;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="full-star" />);
  }

  if (remainder >= 0.75) {
    stars.push(<FaStar key="three-quarters" className="three-quarters-star" />);
  } else if (remainder >= 0.5) {
    stars.push(<FaStar key="half" className="half-star" />);
  } else if (remainder >= 0.25) {
    stars.push(<FaStar key="quarter" className="quarter-star" />);
  }

  // Fill remaining stars to total 5
  while (stars.length < 5) {
    stars.push(<FaStar key={`empty-${stars.length}`} className="empty-star" />);
  }

  return <div className="star-rating">{stars}</div>;
};

export default RatingStars;
