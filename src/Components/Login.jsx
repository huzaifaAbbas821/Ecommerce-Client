import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorUser, setErrorUser] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorUser("Complete the above field.");
      return;
    } else {
      setErrorUser("");
    }

    if (!password) {
      setErrorMessage("Complete the above field.");
      return;
    } else {
      setErrorMessage("");
    }

    try {
      const response = await fetch("https://ecommerce-backend-l7uf.vercel.app/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 404) {
        setErrorMessage("Account does not exist");
      }
      else if (response.status === 401) {
        setErrorMessage("All Fields are mandatory");
      }
      else if (response.status === 402) {
        setErrorMessage("Password is incorrect");
      }
      else {
        setMessage("Login successful");
      }
      console.log(data) 
      localStorage.setItem("accessToken", data.data.accessToken);
      console.log("Access Token ", data.data.accessToken);
      navigate("/")
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error");
    }
  };

  return (
    <div className="bg-slate-100 w-screen flex justify-center items-center h-screen border text-black border-slate-400 rounded-md p-8 shadow-lg backdrop:filter backdrop-blur-sm bg-opacity-30  relative">
      <div className="flex flex-col justify-center items-center  md:p-10">
        <h1 className="text-4xl text-black font-bold text-center mb-3">LOGIN</h1>
        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center">
          <div className="relative my-4">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Email"
              className="block w-72 py-2.3 px-3 text-sm bg-transparent border-2 py-1 placeholder-gray-500 rounded-xl border-gray-500 peer appearance-none focus:outline-none focus:text-black focus:ring-0"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorUser && <div className="msg1 text-red-600 text-sm">{errorUser}</div>}
          </div>

          <div className="relative my-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="block w-72 py-2.3 px-3 text-sm bg-transparent border-2 py-1 placeholder-gray-500 rounded-xl border-gray-500 peer appearance-none focus:outline-none focus:text-black focus:ring-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
              <div className="msg2 text-red-600 text-sm">{errorMessage}</div>
            )}
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="text-center text-white text-xl font-semibold hover:bg-slate-600 overflow-hidden bg-[#131921] px-6 py-2 my-2 rounded-3xl"
            >
              Login
            </button>
          </div>
          {message && <div className="text-green-600">{message}</div>}
          <div>
            <span>
              New Here?{" "}
              <Link
                to="/register"
                className="cursor-pointer hover:border-b-2 hover:border-gray-400"
              >
                Create an Account
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
