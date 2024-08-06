import React, { useState, useEffect } from "react";
import Cards from "./Cards";

function Container({ query }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ecommerce-backend-l7uf.vercel.app/api/products/all-product",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.success) {
          setData(responseData.data);
        } else {
          console.error("Data fetching was not successful:", responseData.message);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((prod) => {
    const matchesQuery = query ? prod.title.toLowerCase().includes(query) : true;
    const matchesFilterQuery = filterQuery ? prod.category.toLowerCase().includes(filterQuery) : true;
    return matchesQuery && matchesFilterQuery;
  });

  return (
    <div className="min-h-[100vh] pt-[2vw] max-w-[100vw] bg-gray-100 text-white">
      <span className="flex justify-start items-center m-2 md:px-6  text-black">
        <label htmlFor="category" className="mr-3 text-base md:text-lg font-bold md:mx-2" >Filter by Category:</label>
        <select
          required
          id="category"
          name="category"
          onChange={(e) => setFilterQuery(e.target.value)}
          className='px-2 text-base md:text-lg border-2 border-black placeholder-gray-800 rounded-xl'
        >
          <option value="">All</option>
          <option value="clothes">Clothes</option>
          <option value="watches">Electronics</option>
          <option value="health product">Home & Kitchen</option>
        </select>
      </span>
      <div className="min-h-[100vh] pt-[1vw] md:mt-5 max-w-[100vw] bg-gray-100 text-white grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 xl:gap-x-[3em] xl:p-[2vw] py-5 sm:px-[2vw] gap-y-[3em] xl:px-[4vw] justify-items-center">
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredData.map((product) => <Cards key={product._id} product={product} />)
        )}
      </div>
    </div>
  );
}

export default Container;
