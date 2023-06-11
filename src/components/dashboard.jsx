/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import Viewtask from "./viewtask";
import Addtask from "./addtask";
import Sidebar from "./sidebar";
const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  let content;

  switch (activePage) {
    case "dashboard":
      content = <Viewtask accessToken={localStorage.getItem("accesstoken")} companyId={localStorage.getItem("companyid")}/>;
      break;
    case "users":
      content = <Addtask setActivePage={setActivePage} />;
      break;
  
    default:
      content = <Viewtask setActivePage={setActivePage}  accessToken={localStorage.getItem("accesstoken")}  companyId={localStorage.getItem("companyid")}/>;
  }

  return (
    <div className="flex">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-1 p-8 bg-gray-100">{content}</div>
    </div>
  );
};

export default AdminDashboard;
