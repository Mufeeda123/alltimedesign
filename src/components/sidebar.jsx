/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import TaskForm from '../taskform';

const Sidebar = ({ setActivePage }) => {
  

  const handleLogout = () => {
   localStorage.removeItem("islogin")
   localStorage.removeItem("accesstoken")
   localStorage.removeItem("companyid")
   window.location.reload(true)
  };
  return (
    <div className="bg-gray-800 w-64 min-h-screen px-8 py-4 text-white">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <ul className="mt-4">
        <li className="py-2">
          <button className="text-gray-300 hover:text-white" onClick={() => setActivePage('dashboard')}>View task</button>
        </li>
        <li className="py-2">
          <button className="text-gray-300 hover:text-white" onClick={() => setActivePage('users')}>Add task</button>
        </li>
        {/* <li className="py-2">
          <button className="text-gray-300 hover:text-white" onClick={() => setActivePage('products')}>Products</button>
        </li> */}
        <li className="py-2">
          <button className="text-black hover:text-blue-700 bg-blue-700 border border-blue-500 hover:border-blue-700 px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
        </li>

      </ul>
    </div>
  );
};
export default Sidebar



