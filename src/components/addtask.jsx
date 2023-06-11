/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from "react";
import TaskForm from "../taskform";

const Addtask = ({ setActivePage }) => {
  return (
    <>
      <TaskForm
        accessToken={localStorage.getItem("accesstoken")}
        companyId={localStorage.getItem("companyid")}
        leadId="your-lead-id"
        setActivePage={setActivePage}
      />
    </>
  );
};
export default Addtask;
