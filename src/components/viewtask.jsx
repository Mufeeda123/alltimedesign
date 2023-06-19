/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { useLocation } from "react-router";
import Edittask from "./edittask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const Viewtask = ({ accessToken, companyId, setActivePage }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [edittask, setedittask] = useState("");
  const [editing, setediting] = useState(false);

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
          setTasks={setTasks}
          tasks={tasks}
        />
      ) : (
        <div>
          <h2>You have {tasks.length} Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-200 text-gray-800 border border-gray-400 p-3 pl-6 mb-4 flex items-center"
              >
                <li className="flex-grow">{task.task_msg}</li>
                <div>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-black cursor-pointer px-4 py-2 rounded mr-2"
                    onClick={() => editfunction(task.id)}
                  />
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
