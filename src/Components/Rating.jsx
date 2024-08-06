import React, { useState } from 'react';
import Rating from 'react-rating';
import { FaRegStar, FaStar } from "react-icons/fa";

const RatingComponent = ({id}) => {
  const [rating, setRating] = useState(0);
const [disable,setDisable] = useState(false);
const handleRatingChange = (rate) => {
  setRating(rate);
  setDisable(true);
  ratingAdder(rate); // Pass the new rating to ratingAdder
};
const token = localStorage.getItem('accessToken')
const ratingAdder = async (newRating) => { // Accept the new rating as a parameter
  try {
    const response = await fetch("https://ecommerce-backend-l7uf.vercel.app/api/products/rating-product", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({ id, rate: newRating }) // Use the new rating
    });
    
    if (!response.ok) {
      throw new Error('Failed to update rating');
    }

    const data = await response.json();
    console.log(data); // Log response data if needed

  } catch (error) {
    console.log(error);
  }
};

  
  return (
    <div className={`${disable ? "hidden" : "block"} flex justify-center items-center gap-x-4`}>
      <h1>Add Rating:</h1>
      <div className='flex justify-evenly items-center gap-x-2'>
        <Rating
        
          emptySymbol={<FaRegStar style={{ color: 'gray'}} />}
          fullSymbol={<FaStar style={{ color: 'yellow' }} />}
          initialRating={rating}
          onClick={handleRatingChange}
        />
      </div>
    </div>
  );
}

export default RatingComponent;