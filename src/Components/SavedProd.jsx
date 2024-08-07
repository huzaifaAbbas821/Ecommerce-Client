import React, { useState, useEffect } from "react";
import Cards from "./Cards";

function Container() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem("accessToken");
        if(!token){
          return <div className="h-[90vh] flex justify-center items-center text-lg">
                 Login to save Products 
          </div>
        }
      try {
        const response = await fetch("https://ecommerce-backend-l7uf.vercel.app/api/users/save-product", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Await the response to ensure data is set correctly

        if (data.success) {
          setData(data.data); // Set the fetched data to state
        } else {
          console.error("Data fetching was not successful:", data.message);
        }

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className='min-h-[100vh] xl:max-w-[100vw] w-screen bg-white text-white grid auto-rows-max xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 xl:gap-x-[4em] xl:p-[2vw] py-5 sm:px-[2vw] gap-y-[3em] xl:px-[4vw] mt-[2vw] justify-items-center'>
      {loading ? (
        <div>Loading...</div>
      ) : (
        data.map((product) => (
          <Cards key={product._id} product={product} />
        ))
      )}
    </div>
  );
}

export default Container;
