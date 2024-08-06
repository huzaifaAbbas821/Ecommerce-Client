import React from 'react';
import { FaStar,  FaRegStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

function Stars({ rating, sold }) {
    let calRating = rating / sold;
    const ratingStars = Array.from({ length: 5 }, (elem, index) => {
        let number = index + 0.5;

        return (
            <span key={index} className='flex gap-1 items-start'>
                {calRating >= index + 1 ? (
                    <FaStar className="w-[1em] h-[1em]" color="orange" />
                ) : calRating >= number ? (
                    <FaStarHalfAlt className="w-[1em] h-[1em]" color='rgb(255, 213, 96)' />
                ) : (
                    <FaRegStar className="w-[1em] h-[1em]" color='rgb(255, 213, 96)' />
                )}
            </span>
        );
    });

    return (
        <div className='w-[100%] flex justify-start items-center'>
            {ratingStars}
            <span className='text-sm items-center mx-4'>{sold}</span>
        </div>
    );
}

export default Stars;
