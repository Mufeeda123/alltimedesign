/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { useLocation } from "react-router";
import Edittask from "./edittask";

const Viewtask = ({ accessToken, companyId, setActivePage }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [edittask, setedittask] = useState("");
  const [editing, setediting] = useState(false);
  // const tokenValue = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODY0NTIyNTksIm5iZiI6MTY4NjQ1MjI1OSwianRpIjoiNGVmNGMzZDktMmJkYS00NDg5LWIxZTgtYWM4NWI4NzBhN2Q2IiwiaWRlbnRpdHkiOnsibmFtZSI6IlNhcmF2YW5hbiBDIiwiZW1haWwiOiJzbWl0aHdpbGxzMTk4OUBnbWFpbC5jb20iLCJ1c2VyX2lkIjoidXNlcl84YzJmZjIxMjhlNzA0OTNmYTRjZWRkMmNhYjk3YzQ5MiIsImljb24iOiJodHRwOi8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvY2Y5NGI3NGJkNDFiNDY2YmIxODViZDRkNjc0ZjAzMmI_ZGVmYXVsdD1odHRwcyUzQSUyRiUyRnMzLnNsb292aS5jb20lMkZhdmF0YXItZGVmYXVsdC1pY29uLnBuZyIsImJ5X2RlZmF1bHQiOiJvdXRyZWFjaCJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.-YW6d9QvX03DzyrbQGrVLd0uCXETRQ-HjykjpSkuZ5k"

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setTasks(response.data.results); // Assuming the response contains an array of tasks
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error during task fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [isLoading]);

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      handleDeleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${taskId}?company_id=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Task deleted successfully");
        // console.log(response);
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error during task deletion");
    }
  };
  const editfunction = (taskId) => {
    // console.log(taskId);
    setedittask(taskId);
    setediting(true);
  };

  return (
    <>
      {editing == true ? (
        <Edittask
          taskvalue={edittask}
          setediting={setediting}
          accessToken={localStorage.getItem("accesstoken")}
          companyId={localStorage.getItem("companyid")}
          setIsLoading={setIsLoading}
        />
      ) : (
        <div>
          <h2>You have {tasks.length} Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-200 text-gray-800 border border-gray-400 p-4 mb-4"
              >
                <li>{task.task_msg}</li>
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => editfunction(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Viewtask;
