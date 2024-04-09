import React, { useState } from 'react';

const StarRating = ({ value, onClick }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (starValue) => {
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={`star ${starValue <= (hoverRating || value) ? 'filled' : ''}`}
            onMouseOver={() => handleMouseOver(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              onClick(starValue);
              console.log("Clicked rating:", starValue); // Log the value when clicked
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;

