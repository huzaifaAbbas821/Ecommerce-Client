import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"




function EnterProd() {
  const [formData, setFormData] = useState({
    title: "",
    // productName:"",
    description: "",
    category: "clothes",
    currency: "$",
    price: "",
    stock: "",
    featuredImage: null,
  });

const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      featuredImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    // submitData.append("productName", formData.productName);
    submitData.append("description", formData.description);
    submitData.append("category", formData.category);
    // submitData.append("currency", formData.currency);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);
    submitData.append("featuredImage", formData.featuredImage);

    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "https://ecommerce-backend-l7uf.vercel.app/api/products/create-product",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
            if(response.status == 200){
        navigate("/")
      }
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  return (
    <div className="bg-gray-100 border text-[#131921] rounded-md min-h-screen h-full max-w-[100vw] shadow-lg">
      <div className="md:pt-10">
        <h1 className=" text-xl md:text-3xl text-[#131921] font-bold text-center mb-4">
          Register Product
        </h1>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col gap-y-4 md:mt-10 md:gap-y-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start  md:items-center mx-1 md:mx-4">
            <div className="relative my-2  md:w-1/2  flex flex-col md:flex-row justify-start items-start md:items-center">
              <label
                htmlFor="title"
                className="mr-2 text-base md:text-lg  font-semibold"
              >
                Product Title:
              </label>
              <textarea
                required
                name="title"
                id="title"
                cols="50"
                rows="3"
                value={formData.title}
                onChange={handleInputChange}
                className="px-2 w-[80%] md:w-[60%] text-base border-2 border-black placeholder-gray-800 rounded-xl"
              ></textarea>
            </div>
            <div className="relative my-2  md:mt-0 md:w-1/2  flex flex-col md:flex-row justify-start items-start md:items-center">
              <label
                htmlFor="description"
                className="mr-2 text-base md:text-lg font-semibold"
              >
                Product Description:
              </label>
              <textarea
                required
                name="description"
                id="description"
                cols="50"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="px-2 w-[80%] md:w-[60%] text-base  border-2 border-black placeholder-gray-800 rounded-xl"
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-1 md:mx-4">
            <div className="relative my-2 w-full md:w-1/2 flex flex-col md:flex-row justify-start items-start md:items-center">
              {/* <label
                htmlFor="productName"
                className="md:mr-2 text-base md:text-xl font-semibold"
              >
                Product Name:
              </label>
              <textarea
                required
                name="productName"
                id="productName"
                cols="50"
                rows="2"
                value={formData.productName}
                onChange={handleInputChange}
                className="px-2 w-[80%] md:w-[60%] text-base border-2 border-black placeholder-gray-800 rounded-xl"
              ></textarea> */}
                          <label
              htmlFor="featuredImage"
              className="block text-black text-base md:text-lg font-semibold"
            >
              Upload Image:
            </label>
            <input
              required
              type="file"
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-md"
            />
            </div>
            <div className="relative my-2 w-full md:w-1/2  flex ">
              <label
                htmlFor="category"
                className="mr-2 md:mr-4 text-black text-base md:text-lg font-semibold"
              >
                Product Category:
              </label>
              <select
                required
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="px-2 md:text-xl text-sm border-2 border-black placeholder-gray-800 rounded-xl"
              >
                <option value="clothes">Clothes</option>
                <option value="watches">Electronics</option>
                <option value="health product">Home $ Kitchen</option>
              </select>
            </div>
          </div>

         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-1 md:mx-4">
         <div className="relative my-2  w-full md:w-1/2 flex flex-1">
            <label
              htmlFor="price"
              className=" md:mr-4 text-black text-base md:text-lg font-semibold"
            >
              Product Price:
            </label>
            <span className="flex flex-shrink w-1/3 md:w-1/2 ">
              <input
                required
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
                className="md:px-2 text-sm md:text-base w-[80%] border-2 border-black placeholder-gray-800 rounded-xl"
              />
            </span>
          </div>
          <div className="relative my-2  w-full md:w-1/2 flex flex-1">
            <label
              htmlFor="stock"
              className="mr-2 lg:mr-4 text-black text-base md:text-lg font-semibold"
            >
              Product Stock:
            </label>
            <span>
              <input
                required
                type="number"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="px-2 md:w-[80%] text-sm md:text-lg border-2 border-black placeholder-gray-800 rounded-xl"
              />
            </span>
          </div>
         </div>
         
         
          {/* <div className="flex flex-col md:flex-row mx-1 md:mx-4 md:gap-x-4">
            <label
              htmlFor="featuredImage"
              className="block text-black text-base md:text-xl font-semibold"
            >
              Upload Image:
            </label>
            <input
              required
              type="file"
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-md"
            />
          </div> */}

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="text-center text-white  text-lg md:text-xl font-semibold hover:bg-slate-600 overflow-hidden bg-[#131921] px-6 py-2 my-2 rounded-3xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnterProd;
