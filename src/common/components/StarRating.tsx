import React from 'react';
import { FaStar, FaRegStar, FaR } from 'react-icons/fa6';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            key={index}
            className={`h-5 w-5 ${
              index <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            style={{ cursor: 'default' }}
          >
            {index <= rating ? (
              <FaStar />
            ) : (
              <FaRegStar />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
