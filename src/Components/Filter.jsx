import React from 'react';
import PropTypes from 'prop-types';
import { IoIosSearch } from "react-icons/io";

const Filter = ({ setQuery }) => {
    return (
        <form 
            className="search xs:hidden bg-gray-400 px-3 cursor-pointer rounded-sm overflow-hidden flex items-center justify-between gap-0"
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                type="text"
                placeholder="Search.."
                className="w-[90%] py-2 text-black rounded-lg placeholder:text-black bg-gray-400 outline-none border-0 border-transparent text-base"
            />
            <button type="submit" className="bg-transparent border-0 p-0">
                <IoIosSearch className="w-[6vw] h-[6vw] md:w-6 md:h-7 lg:w-[2vw] lg:h-[2vw]" />
            </button>
        </form>
    );
};


export default Filter;
