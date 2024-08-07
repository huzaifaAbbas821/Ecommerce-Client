import React, { useState, useEffect } from "react";
import Cards from "./Cards";

function Container() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Login to save Products");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "https://ecommerce-backend-l7uf.vercel.app/api/users/save-product",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setData(data.data);
        } else {
          console.error("Data fetching was not successful:", data.message);
          setError(data.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="h-[90vh] flex justify-center items-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="h-[90vh] flex justify-center items-center text-lg text-black">{error}</div>;
  }

  return (
    <div className="min-h-[100vh] xl:max-w-[100vw] w-screen bg-white text-white grid auto-rows-max xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 xl:gap-x-[4em] xl:p-[2vw] py-5 sm:px-[2vw] gap-y-[3em] xl:px-[4vw] mt-[2vw] justify-items-center">
      {data.map((product) => (
        <Cards key={product._id} product={product} />
      ))}
    </div>
  );
}

export default Container;
