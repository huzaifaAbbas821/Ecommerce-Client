import React from 'react'

function Filter({setQuery}) {
    return (
        <div className="search  xs:hidden  bg-gray-400  px-3 cursor-pointer rounded-sm overflow-hidden flex items-center justify-between gap-0">
        <input
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
          type="text"
          placeholder="Search.."
          className="w-[90%] py-2 text-black rounded-lg placeholder:text-black bg-gray-400 outline-none border-0 border-transparent text-base"
        />
        <IoIosSearch className="w-[6vw] h-[6vw] bg-transparent  md:w-6 md:h-7 md:m-0 md:p-0 lg:w-[2vw] lg:h-[2vw] " />
      </div>
    )
}

export default Filter
