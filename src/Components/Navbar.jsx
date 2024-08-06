import React, { useEffect, useState } from "react";
import axios from "axios";

// upper nav links :
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
// import { BsCart3 } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { FiHeart } from "react-icons/fi";

// lower nav links:
import { FaRegHeart, FaStar } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { BsTags } from "react-icons/bs";
import Dashboard from "./Dashboard";

function Navbar( {setQuery} ) {
  const [iconDown, seticonDown] = useState(false);
  const [loginDecide, setLoginDecide] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          "https://ecommerce-backend-l7uf.vercel.app/api/users/user",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          setLoginDecide(true);
        } else {
          setLoginDecide(false);
        }
      } catch (error) {
        console.error(error);
        setLoginDecide(true); // Set to true on error
      }
    };

    fetchData();
  }, [token]);

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const response = await axios.post(
        "https://ecommerce-backend-l7uf.vercel.app/api/users/logout",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(!response.ok){
        throw "Error msg"
      }
console.log(response)
      // localStorage.setItem("accessToken", "")
    } catch (error) {
      console.error(error);
      setLoginDecide(true); // Set to true on error
    }
  };

  const handleIcon = () => {
    seticonDown(!iconDown);
  };

  return (
    <>
      <div
        className="nav max-w-[100vw] bg-[#131921] py-2"
        style={{ boxShadow: "0 -6px 10px 5px rgba(0, 0, 0, 0.4)" }}
      >
        {/* // ----------  Upper part of navbar ------------ // */}

        <div className="upper   bg-[#131921] px-4 md:py-4 w-full flex justify-between  md:justify-evenly 2xl:gap-x-[3vw] lg:gap-x-[3vw]  items-center md:gap-x-6 ">
          <div className="logo -mt-[1vw] md:mt-0">
            <svg
              className="w-15 h-15 "
              width="65.8"
              height="22.4"
              viewBox="0 0 94 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M68.417 23.745c-.389-4.387-4.109-5.48-7.74-6.693-3.282-1.097-6.366-1.368-6.696-3.719-.354-2.495 2.097-4.174 4.664-3.722 2.783.492 3.311 2.635 2.668 4.023 1.284 1.59 4.473 1.426 5.453.314.808-.909 1.08-2.412-.614-3.838-2.074-1.748-6.331-2.582-10.409-1.818-4.008.752-7.182 3.433-6.823 7.334.387 4.196 3.376 5.415 8.109 6.679 4.58 1.224 6.08 2.852 5.781 4.978-.267 1.902-1.883 3.46-5.337 3.06-3.455-.402-5.271-3.045-4.566-6.033-3.934-.904-5.633 2.973-2.355 5.526 3.154 2.463 9.348 2.674 12.839 1.342 3.129-1.185 5.385-3.367 5.026-7.433ZM41.685 6.845c2.138 0 3.87-1.533 3.87-3.423 0-1.889-1.732-3.422-3.87-3.422s-3.87 1.531-3.87 3.422c0 1.892 1.732 3.423 3.87 3.423ZM44.735 8.717a7.496 7.496 0 0 1-6.1 0v22.595h6.114V8.72l-.014-.002ZM84.762 8.042a9.828 9.828 0 0 0-5.932 1.924V.679h-6.272v30.629h6.249V17.119c0-3.604.553-5.31 2.37-6.674 1.65-1.237 3.979-1.018 5.247-.132 1.53 1.07 1.462 3.635 1.462 5.681v15.317H94v-15.41c0-5.5-3.736-7.859-9.238-7.859ZM28.085 31.312H21.97l-4.804-13.984-3.393 13.979H7.656L0 8.719h6.279l6.482 19.545c2.32-6.55 3.773-12.656 1.52-19.545h6.114l7.69 22.593ZM30.626 8.009a23.382 23.382 0 0 1-5.1 6.21 25.452 25.452 0 0 1 5.1 8.278 25.483 25.483 0 0 1 5.106-8.278 23.425 23.425 0 0 1-5.106-6.21Z"
                fill="#ffff"
              ></path>
            </svg>
          </div>

          <div className="search hidden px-2 bg-gray-100 w-[50vw] cursor-pointer rounded-xl xs:flex items-center justify-between gap-0 sm:w-[50vw]   md:w-[50vw] lg:w-[50vw] overflow-hidden">
            <input
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
              type="text"
              placeholder="Search.."
              className="w-[90%] md:h-[95%] text-black rounded-lg placeholder:text-black bg-gray-100 outline-none border-0 border-transparent  lg:py-1 2xl:py-[0.5vw]  md:text-base"
            />
            <IoIosSearch  className=" bg-transparent sm:w-6 sm:h-7 md:m-0 md:p-0 lg:w-[2vw] lg:h-[2vw] " />
          </div>

          <div className="bell hidden md:block">
            <Link to={"/watch-products"}>
            <GoClock
              color="white"
              className="w-[6vw] h-[6vw] sm:w-[4vw] sm:h-[4vw]  md:w-[3vw] md:h-[3vw] lg:w-[2vw] lg:h-[2vw] "
            />
            </Link>
          </div>

          <div className="heart hidden md:block">
            <Link to={"/save-products"}>
            <FiHeart
              color="white"
              className="w-[6vw] h-[6vw] sm:w-[4vw] sm:h-[4vw]  md:w-[3vw] md:h-[3vw] lg:w-[2vw] lg:h-[2vw]  "
            />
            </Link>
          </div>

          <div className="cart">
            <Link to="/cart">
              <FaCartPlus
                className="hidden md:block 
              w-[6vw] h-[6vw] sm:w-[4vw] sm:h-[4vw]  md:w-[3vw] md:h-[3vw] lg:w-[2vw] lg:h-[2vw]"
                color="white"
              />
            </Link>
          </div>

          {loginDecide ? (
            <div className="login hidden md:block">
              <Link
                to="/login"
                className="bg-[#131921] block xl:text-md 2xl:py-[1vw] text-white rounded-xl  px-2 py-1 sm:tracking-normal whitespace-nowrap md:text-lg md:block font-semibold"
                style={{
                  fontFamily: "Poppins ,sans-serif",
                  fontWeight: "500",
                  fontStyle: "normal",
                }}
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="login hidden md:block">
            <Link
              onClick={handleRemove}
              className="bg-[#131921] hidden  xl:text-md 2xl:py-[1vw] text-white rounded-xl  px-2 py-1 sm:tracking-normal whitespace-nowrap md:text-lg md:block font-semibold"
              style={{
                fontFamily: "Poppins ,sans-serif",
                fontWeight: "500",
                fontStyle: "normal",
              }}
            >
              Sign Out
            </Link>
          </div>
          )}

          {loginDecide ? (
            <div className="login hidden  md:block">
              <Link
                to={"/register"}
                className="bg-[#131921] hidden  xl:text-md 2xl:py-[1vw] text-white rounded-xl  px-2 py-1 sm:tracking-normal whitespace-nowrap md:text-lg md:block font-semibold"
                style={{
                  fontFamily: "Poppins ,sans-serif",
                  fontWeight: "500",
                  fontStyle: "normal",
                }}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="login hidden md:block">
             <Dashboard />
          </div>
          )}

          <div className="flex justify-center items-center gap-x-6 md:hidden ">
            <Link>
              <FiHeart color="white" className="md:hidden w-5 h-5 sm:w-7 sm:h-7  " />
            </Link>
            <Link to="/cart">
              <FaCartPlus className="  md:hidden w-5 h-5 sm:w-7 sm:h-7  " color="#fff" />
            </Link>

            <Dashboard />
          </div>
        </div>
      </div>

    </>
  );
}

export default Navbar;
