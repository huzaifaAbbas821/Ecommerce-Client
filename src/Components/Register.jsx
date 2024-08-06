import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      [username, email, password, confirm].some((field) => field.trim() === "")
    ) {
      setErrorConfirm("All fields are required.");
      return;
    }

    if (password !== confirm) {
      setErrorConfirm("The passwords do not match.");
      return;
    }

    try {
      const response = await fetch("https://ecommerce-backend-l7uf.vercel.app/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      
      setSuccessMessage(responseData.message);
      navigate("/login")
      

    } catch (error) {
      setErrorConfirm(error.message);
    }
  };

  return (
    <div className="bg-white w-screen h-screen border text-black border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30  relative">
      <div>
        <h1 className="text-4xl text-[#131921] font-bold text-center mb-3">
          Register
        </h1>

        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}

        <form onSubmit={handleRegister} className="flex justify-center items-center flex-col">
          <div className="relative my-3">
            <label htmlFor="username" className="font-bold mb-2">Username</label>
            <input
              required
              type="text"
              placeholder="Username"
              className="block w-72 py-2.3 px-3 text-black text-sm bg-transparent border-2 py-1 placeholder-gray-400 rounded-xl border-gray-300 "
              value={username}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, ""); // Remove spaces from input
                setUsername(value);
              }}
            />
          </div>
          <div className="relative my-3">
            <label htmlFor="email" className="font-bold mb-2">Email</label>
            <input
              required
              type="text"
              placeholder="Email"
              className="block w-72 py-2.3 px-3 text-sm bg-transparent border-2 py-1 placeholder-gray-400 rounded-xl border-gray-300  "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative my-3">
            <label htmlFor="password" className="font-bold mb-2">Password</label>
            <input
              required
              type="password"
              placeholder="Password"
              className="block w-72 py-2.3 px-3 text-sm bg-transparent border-2 py-1 placeholder-gray-400 rounded-xl border-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative my-3 gap-y-2">
            <label htmlFor="confirm" className="font-bold ">Confirm Password</label>
            <input
              required
              type="password"
              placeholder="Confirm Password"
              className="block w-72 py-2.3 px-3 text-sm bg-transparent border-2 py-1 placeholder-gray-400 rounded-xl border-gray-300 "
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {errorConfirm && <div className="text-red-500">{errorConfirm}</div>}
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="text-center text-white text-xl font-semibold hover:bg-slate-700 overflow-hidden bg-[#131921] px-6 py-2 my-2 rounded-3xl"
            >
              Submit
            </button>
          </div>
          <div>
            <span className="capitalize">
              Already Have an account?
              <Link
                to="/login"
                className="ml-2 cursor-pointer hover:border-b-2 hover:border-black"
              >
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
