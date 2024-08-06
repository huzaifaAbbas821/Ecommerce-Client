import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Stars from "./Stars";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/reducer.js";
import { FiHeart } from "react-icons/fi";
import RatingComponent from "./Rating.jsx";

export default function Product() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeimg, setActive] = useState();
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [desc, setdesc] = useState();
  const [category, setCategory] = useState();
  const [rating, setRating] = useState();
  const [sold, setSold] = useState();
  const [hasRated, setHasRated] = useState(false);
  const [hasBuy, setHasBuy] = useState();

  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQunatity] = useState(1);
  const [btnEnable, setBtnEnable] = useState(false);
  const token = localStorage.getItem("accessToken"); // Ensure 'accessToken' is in quotes

  const watch = async () => {
    try {
      if (!token) {
        throw new Error("No access token found");
      }

      const res = await fetch(
        `https://ecommerce-backend-l7uf.vercel.app/api/users/watch-history/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update watch history");
      }

      const data = await res.json();
      // console.log("Success:", data.message);
    } catch (error) {
      console.error("problem wH", error, "");
    }
  };

  // const handleRemove =  async () => {
  //   try {
  //     const token = localStorage.getItem("accessToken"); // Ensure 'accessToken' is in quotes
  //     if (!token) {
  //       throw new Error("No access token found");
  //     }
  //     const response = await axios.delete(
  //       `https://ecommerce-backend-l7uf.vercel.app/api/products/product/${id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if(!response.ok){
  //       throw "Error while deleting"
  //     }
  //     navigate('/')
  //     console.log(response)}
  //     catch(error){
  //       console.log(error);
  //     }}
  const handleRemove = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Ensure 'accessToken' is in quotes
      if (!token) {
        throw new Error("No access token found");
      }

      if (!id) {
        throw new Error("No product ID provided");
      }

      const response = await axios.delete(
        `https://ecommerce-backend-l7uf.vercel.app/api/products/product/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Error while deleting");
      }

      navigate("/");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-backend-l7uf.vercel.app/api/products/product/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data);
        setActive(response.data.data.featuredImage);
        setTitle(response.data.data.title);
        setdesc(response.data.data.description);
        setPrice(response.data.data.price);
        setCategory(response.data.data.category);
        const ratingsArray = response.data.data.ratings;
        if (ratingsArray.length > 0) {
           
          setRating(await ratingsArray.reduce((acc, elem) => acc + elem.rating, 0));
          console.log(rating);
        }
        setSold(response.data.data.sold);
        setLoading(false);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        try {
          const res = await axios.get("https://ecommerce-backend-l7uf.vercel.app/api/users/user", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const hBuy = res.data.data.buyDetails.some((r) => r === id);
          setHasBuy(hBuy);

          const userId = res.data.data._id;
          const hasUserRated = response.data.data.ratings.some(
            (r) => r.userId === userId
          );
          setHasRated(hasUserRated);
          setBtnEnable(response.data.data.owner === res.data.data._id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        watch();
      } catch (error) {
        setError(true);
        setLoading(false);

        if (error.response) {
          console.error("Error fetching data:", error.response.message);
          setErrorMessage(
            `${error.response.status} ${error.response.statusText}`
          );
        } else {
          console.error("Error fetching data:", error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleSaveRequest = async (id) => {
    try {
      const token = localStorage.getItem("accessToken"); // Ensure 'accessToken' is in quotes
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `https://ecommerce-backend-l7uf.vercel.app/api/users/save-product/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update save history");
      }

      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 md:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 md:px-4 px-2">
            <div className="h-[300px] sm:h-[460px] rounded-lg bg-gray-200 dark:bg-gray-700 md:mb-4">
              <img
                className="w-full h-full object-contain rounded-sm "
                src={activeimg}
                alt="Product Image"
              />
            </div>
          </div>
          <div className="md:flex-1 relative px-4">
            {btnEnable && (
              <button className="p-1  absolute top-0 right-2 z-10 hover:bg-red-600">
                <svg
                  onClick={() => handleRemove(id)}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-red-500 hover:fill-white inline cursor-pointer"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                    data-original="#000000"
                  ></path>
                </svg>
              </button>
            )}
            <h2 className="text-lg font-bold md:pt-6 text-gray-800 ">
              {title}{" "}
            </h2>
            <div className="flex mb-4">
              <div className="mr-4">
                <span className="font-bold text-gray-700 ">Price:</span>
                <span className="text-gray-600 ">{price}</span>
              </div>
              <div>
                <span className="font-bold text-gray-700 ">Availability:</span>
                <span className="text-gray-600 ">In Stock</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-gray-700 ">
                Product Description:
              </span>
              <p className="text-gray-600  text-sm mt-2">{desc}</p>
            </div>
            <div className="flex sm:flex-row flex-col gap-y-2 my-2 md:my-4">
              <div className="mr-4 flex gap-x-2 ">
                <span className="font-bold text-[#007185] ">Rating:</span>
                <span>
                  <Stars rating={rating} sold={sold} />
                </span>
              </div>
              <div>
                <span className="font-bold text-[#007185] ">Category:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {" "}
                  {category}{" "}
                </span>
              </div>
            </div>
            <div className="flex my-4">
              <div className="mr-4 flex gap-x-2 ">
                {hasBuy && !hasRated && <RatingComponent id={id} />}
              </div>
            </div>
            <div className="flex -mx-2 mb-4">
              <div className="w-1/2 px-2">
                <button
                  onClick={() => {
                    setQunatity(1);
                    dispatch(
                      addItem({ title, price, quantity, activeimg, id })
                    );
                  }}
                  className="w-full bg-[rgba(255,216,20,0.97)] text-sm md:text-lg  text-black py-2 px-4 rounded-full font-bold hover:bg-[rgb(255,198,41)]"
                >
                  Add to Cart
                </button>
              </div>
              <div className="w-1/2 px-2">
                <button
                  onClick={() => {
                    handleSaveRequest(id);
                  }}
                  className="w-full text-sm md:text-lg bg-[#ffa41c] text-gray-800 py-2 px-4 rounded-full font-bold hover:bg-[#fa8900]"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//   {
//   <div className="flex flex-col justify-between lg:flex-row p-4 gap-6 lg:px-12 lg:h-screen lg:justify-around lg:items-center">
//     <div className="flex flex-col gap-6 lg:w-2/4">
//       <img
//         src={activeimg}
//         alt=""
//         className="w-full sm:h-[50vh] aspect-square object-cover rounded-xl"
//       />
//     </div>

//     <div className="flex flex-col gap-2 sm:gap-4 lg:gap-10 lg:w-[40%]">
//       <div>
//         <span className="text-[1.5vw]">{category}</span>
//         <h1 className="text-3xl md:text-[2vw] font-bold">Product</h1>
//       </div>
//       <p className="text-gray-500 md:text-[2vw] font-semibold">{desc}</p>
//       {/* <Stars rating={data.rating} /> */}

//       <h3 className="text-black font-semibold md:text-[2vw]">{price}</h3>

//       <FiHeart
//         onClick={() => {
//           handleSaveRequest(id);
//         }}
//       />

//       <button
//         onClick={() => {
//           setQunatity(1);
//           dispatch(addItem({ title, price, quantity, activeimg, id }));
//         }}
//         className="bg-green-500 text-[1vw] text-yellow-50 font-semibold py-3 px-3 text-nowrap rounded-xl lg:w-[50%] h-full"
//       >
//         Add to Cart
//       </button>
//       <Link to="/cart">
//         <button className="bg-green-500 text-[1vw] text-yellow-50 font-semibold py-3 px-3 text-nowrap rounded-xl lg:w-[50%] h-full">
//           Cart
//         </button>
//       </Link>
//     </div>
//   </div>;
// }
