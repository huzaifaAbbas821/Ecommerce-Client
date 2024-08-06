import React, { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Stars from "./Stars";

function Cards({ product }) {
  const [shortTitle, setTitle] = useState("");
  const [shortShortTitle, setShortTitle] = useState("");
  const [rating,setRating] = useState();
  const [sold, setSold] = useState();

  useEffect(() => {
    if (product.title.length > 24) {
      setTitle(product.title.substring(0, 24) + "...");
    } else {
      setTitle(product.title);
    }
    if(product.title.length > 20){
setShortTitle(product.title.substring(0,20) + "...")
    }
    else {
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
      className="transform transition hover:scale-105 duration-300 2xl:w-[320px] 2xl:h-[400px] shadow-lg lg:w-[240px] lg:h-[310px] sm:w-[210px] sm:h-[270px] w-[150px] h-[220px] bg-gray-100 border-gray-400 text-black overflow-hidden rounded-xl sm:ml-0 ml-2"
    >
      <Link to={`/product/${product._id}`}>
        <div className="image w-[100%] md:h-[70%] h-[60%] bg-black z-10 rounded-t-xl overflow-hidden bg-contain">
          <img
            src={product.featuredImage}
            className="w-[100%] h-[100%]"
            alt={`image 0`}
          />
        </div>
        <div className="w-[100%]  md:mt-1 md:mx-2 md:my-0 ">
          <div className="w-[100%]  font-semibold text-nowrap hidden sm:block overflow-hidden text-black md:text-lg text-base text-start">
            {" "}
            {shortTitle}
          </div>
          <div className="w-[100%]  font-semibold text-nowrap sm:hidden overflow-hidden text-black md:text-lg text-base text-start">
            {" "}
            {shortShortTitle}
          </div>
          <Stars rating={rating} sold={sold} />
          <span className="w-[50%] xl:text-lg text-sm font-normal">
            ${product.price}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default Cards;
