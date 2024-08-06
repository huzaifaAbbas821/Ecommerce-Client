import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMenu } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenIcon, setIsDropdownOpenIcon] = useState(false);
  const dropdownRef = useRef(null);
  const [menuIcon, setMenuIcon] = useState(true);
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
          setMenuIcon(true);
        } else {
          setMenuIcon(false);
        }
      } catch (error) {
        console.error(error);
        setMenuIcon(true); // Set to true on error
      }
    };

    fetchData();
  }, [token])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dropdownOpenIcon = () => {
    setIsDropdownOpenIcon(!isDropdownOpenIcon);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
      setIsDropdownOpenIcon(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      if (!response.ok) {
        throw "Error msg";
      }
      console.log(response);
      // localStorage.setItem("accessToken", "")
    } catch (error) {
      console.error(error);
      setLoginDecide(true); // Set to true on error
    }
  };

  return (
    <div className="relative flex flex-col items-start" ref={dropdownRef}>
      {menuIcon ? (
        <IoMenu
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          onClick={dropdownOpenIcon}
          className="w-8 h-8 sm:w-10 sm:h-9 cursor-pointer"
          type="button"
          color="#fff"
        />
      ) : (
        <CgProfile
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          onClick={toggleDropdown}
          className="w-7 h-7 sm:w-9 sm:h-9 cursor-pointer"
          type="button"
          color="#fff"
        />
      )}

      {isDropdownOpen && (
        <div
          id="dropdown"
          className="absolute top-8 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm md:text-base md:font-bold text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <Link
                to={"/profile"}
                className="block px-4 py-2 hover:bg-gray-300  "
              >
                User Information
              </Link>
            </li>
            <li>
              <Link
                to={"/products"}
                className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Add Product
              </Link>
            </li>
            <li>
              <Link
                to={"/watch-products"}
                className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Recently watched Products
              </Link>
            </li>
            <li>
              <Link
                to={"/buy-products"}
                className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Buy History
              </Link>
            </li>
            <li>
              <Link
                onClick={handleRemove}
                className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      )}

      {isDropdownOpenIcon && (
        <div
          id="dropdown"
          className="absolute top-8 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm md:text-base font-bold text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <Link
                to={"/login"}
                className="block px-4 py-2 hover:bg-gray-300  "
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to={"/register"}
                className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
