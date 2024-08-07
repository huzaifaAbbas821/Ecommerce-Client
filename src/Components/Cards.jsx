import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Stars from "./Stars";

function Cards({ product }) {
  const [shortTitle, setTitle] = useState("");
  const [shortShortTitle, setShortTitle] = useState("");
  const [rating, setRating] = useState();
  const [sold, setSold] = useState();

  useEffect(() => {
    if (product.title.length > 28) {
      setTitle(product.title.substring(0, 28) + "...");
    } else {
      setTitle(product.title);
    }
    if (product.title.length > 20) {
      setShortTitle(product.title.substring(0, 20) + "...");
    } else {
      setShortTitle(product.title);
    }
    const ratingsArray = product.ratings;
    if (ratingsArray.length > 0) {
      setRating(ratingsArray.reduce((acc, elem) => acc + elem.rating, 0));
      console.log(rating);
    }
    setSold(product.sold);
  }, [product.title]);
  return (
    <div
      key={product._id}
      className="transform transition hover:scale-105 duration-300 2xl:w-[320px] 2xl:h-[400px] shadow-lg lg:w-[240px] lg:h-[290px] sm:w-[210px] sm:h-[270px] w-[150px] h-[220px] bg-gray-100 border-gray-300 text-black overflow-hidden rounded-sm sm:ml-0 ml-2"
    >
      <Link to={`/product/${product._id}`}>
        <div className="image w-[100%] md:h-[70%] h-[70%] bg-black z-10 rounded-t-sm overflow-hidden bg-contain">
          <img
            src={product.featuredImage}
            className="w-[100%] h-[100%]"
            alt={`image 0`}
          />
        </div>
        <div className="w-[100%]  md:mt-1 md:mx-2 md:my-0 ">
          <div className="w-[100%]  font-semibold text-nowrap hidden sm:block overflow-hidden text-black md:text-base text-sm text-start">
            {" "}
            {shortTitle}
          </div>
          <div className="w-[100%]  font-semibold text-nowrap sm:hidden overflow-hidden text-black md:text-base text-sm text-start">
            {" "}
            {shortShortTitle}
          </div>
          <Stars rating={rating} sold={sold} />
          <span className="w-[50%]  text-sm font-semibold">
            ${product.price}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default Cards;
