import axios from "axios";
import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"

function Profile() {
  const [existingUsername, setExistUsername] = useState("");
  const [username, setUsername] = useState("");
  const [existingEmail, setExistEmail] = useState("");
  const [email, setEmail] = useState("");
  const [displayOn, setDisplay] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  console.log(password)
  
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        setExistUsername(response.data.data.username);
        setExistEmail(response.data.data.email);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  const updateUsernameAndEmail = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      if(!username && !email){
        throw new Error("username and email is missing");
      }
      const response = await axios.patch(
        "http://localhost:3000/api/users/change-info",
        { username, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response);

      // Update the existing username and email after successful response
      setDisplay(false)
      setExistUsername(username);
      setExistEmail(email);

    } catch (error) {
      console.error(error);
    }
  };

  const updatePassword = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/users/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response)

      // Clear the password fields after successful update
      setPasswordCheck(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
    }
  };

 const deletePassword = async () => {
    try {
      const response = await axios.delete(
        'http://localhost:3000/api/users/delete-account',
        {
          data: { password: 'your-password-here' }, // Ensure the password is provided here
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      // Clear the password fields after successful update
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };





  return (
    <div className="min-h-[90vh] max-w-screen mx-2 md:py-8 md:px-8">
      {/* username */}
      <h1 className="text-2xl text-center md:text-start font-bold">User Details</h1>
      <hr className="h-2 my-2" />
      <h2 className="text-base text-start font-semibold">Username and Email Information</h2>
      <hr className="h-2 my-2" />
      <div>
        {/* display username and Email */}
        <div>
          <div className="flex gap-x-4 items-center my-2">
            <span className="text-base text-black font-semibold">Username:</span>
            <span className="text-gray-700">{existingUsername}</span>
          </div>

          <div className="flex gap-x-4 items-center my-2">
            <span className="text-base text-black font-semibold">Email:</span>
            <span className="text-gray-700">{existingEmail}</span>
          </div>
        </div>

        <button
          onClick={() => setDisplay((prev) => !prev)}
          className="text-sm bg-[#131921] rounded-lg font-semibold text-white p-2 my-2"
        >
          Change Username or Email
        </button>
        <div className={`${displayOn ? "block" : "hidden"} my-2 `}>
          <div className="flex items-center justify-start gap-x-4">
            <label htmlFor="username">Username:</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 border-gray-700 rounded-md text-sm px-2"
              type="text"
              name="username"
              id="username"
              required
            />
          </div>
        </div>
        <div
          className={`${displayOn ? "block" : "hidden"} flex items-center justify-start gap-x-4 my-2`}
        >
          <label htmlFor="email">Email:</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-700 rounded-md text-sm px-2"
            type="text"
            name="email"
            id="email"
            required
          />
        </div>
        <div className="flex justify-start items-center">
          <button
            type="submit"
            onClick={updateUsernameAndEmail}
            className={`${displayOn ? "block" : "hidden"} px-2 bg-green-600  rounded-lg text-white`}
          >
            Update
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={() => setPasswordCheck((prev) => !prev)}
          className="text-sm bg-[#131921] rounded-lg font-semibold text-white p-2 my-2"
        >
          Change Password
        </button>
        <div
          className={`${passwordCheck ? "block" : "hidden"} flex justify-start items-center gap-x-4 my-2`}
        >
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            onChange={(e) => setOldPassword(e.target.value)}
            className="border-2 border-gray-700 rounded-md text-sm px-2 "
            type="password"
            name="oldPassword"
            id="oldPassword"
          />
        </div>
        <div
          className={`${passwordCheck ? "block" : "hidden"} flex justify-start items-center gap-x-4 my-2`}
        >
          <label htmlFor="newPassword">New Password:</label>
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            className="border-2 border-gray-700 rounded-md text-sm px-2 "
            type="password"
            name="newPassword"
            id="newPassword"
          />
        </div>
        <div className="flex justify-end md:justify-start items-center my-2">
          <button
            type="submit"
            onClick={updatePassword}
            className={`${passwordCheck ? "block" : "hidden"} px-2 bg-green-600 text-white  rounded-lg`}
          >
            Update
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={deletePassword}
          className="bg-red-700 p-2 text-sm rounded-lg text-white font-semibold my-2"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Profile;

{/* <div>
        <button
          onClick={() => setDeleteBtn((prev) => !prev)}
          className="bg-red-700 p-2 text-sm rounded-lg text-white font-semibold my-2"
        >
          Delete Account
        </button>
        <div
          className={`flex justify-start items-center gap-x-4 my-2 ${deleteBtn ? "block" : "hidden"}`}
        >
          <label className="text-base">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border-2 border-gray-700 rounded-md text-sm px-2" />
        </div>
        <button onClick={deletePassword}  className={`bg-red-800 text-white rounded-lg text-base font-semibold p-2 ${deleteBtn ? "block" : "hidden"}`}>
          Submit
        </button>
      </div> */}