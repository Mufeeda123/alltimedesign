/* eslint-disable valid-typeof */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Edittask({
  accessToken,
  companyId,
  taskvalue,
  setediting,
  setIsLoading,
  setTasks,
  tasks,
}) {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [taskDate, setTaskDate] = useState(null);
  const [taskTime, setTaskTime] = useState(null);
  const [taskDescription, setTaskDescription] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading2, setisLoading2] = useState(true);
  const [userDetails, setUserDetails] = useState(null); // State to hold the selected user details
  // const [tasks, setTasks] = useState([]); // State to hold the tasks
  const [totalTime, setTotalTime] = useState(); // State to hold the tasks
  const [showForm, setShowForm] = useState(false); // State to track the visibility of the form
  useEffect(() => {
    const edit = axios
      .get(
        `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${taskvalue}?company_id=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // console.log(response.data.results);

        setTaskDescription(response.data.results.task_msg);
        setTotalTime(response.data.results.task_time);
        setTaskDate(response.data.results.task_date);
        setSelectedUser(response.data.results.assigned_user);
      })
      .catch((e) => console.log(e));
    // console.log(edit)
  }, []);

  useEffect(() => {
    if (
      taskDescription != null &&
      taskDate != null &&
      selectedUser != null &&
      taskTime != null
    ) {
      setisLoading2(false);
    }
  }, [taskTime, taskDescription, taskDate, selectedUser]);

  useEffect(() => {
    const totalSeconds = Number(totalTime);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setTaskTime(time);
  }, [totalTime]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://stage.api.sloovi.com/team?product=outreach&company_id=${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setUserList(response.data.results.data);
          // console.log("user details");
          // console.log(response.data);
        } else {
          setError("Failed to fetch user details");
          // console.log("error");
        }
      } catch (error) {
        setError("Error during user details fetch");
        console.log(error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    // console.log(userList);
  }, [userList]);

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    if (userId) {
      fetchUserById(userId);
    } else {
      setUserDetails(null);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    // Convert taskTime to seconds
    const [hours, minutes] = taskTime.split(":");
    const totalSeconds = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
    const taskData = {
      assigned_user: selectedUser,
      task_date: taskDate,
      task_time: totalSeconds,
      is_completed: 0,
      time_zone: new Date().getTimezoneOffset() * 60,
      task_msg: taskDescription,
    };

    try {
      const response = await axios.put(
        ` https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${taskvalue}?company_id=${companyId}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setIsLoading(true);
        setediting("dashboard");
      } else {
        setError("Failed to add task");
      }
    } catch (error) {
      setError("Error during task addition");
    }
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      handleDeleteTask(taskId);
      console.log(tasks);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setediting("dashboard");
      console.log("lllmmmmmmmmm");
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

      // if (response.status === 200) {
      //   toast.success("Task deleted successfully");
      //   // console.log(response);
      // } else {
      //   toast.error("Failed to delete task");
      // }
    } catch (error) {
      console.log(error);
      // toast.error("Error during task deletion");
    }
  };

  // if (isLoading2) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <>
      {isLoading2 ? (
        <div>Loading......</div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 shadow-md rounded-lg">
            <form onSubmit={handleTaskSubmit} className="mt-4">
              {userDetails && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Selected User Details</h3>
                  <p>Name: {userDetails.name}</p>
                  <p>Email: {userDetails.email}</p>
                  {/* Display any other user details as needed */}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-xl "
                  required
                >
                  Task Description
                </label>
                <textarea
                  id="description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="border rounded  text-xl "
                  style={{ width: "100%" }}
                  required
                ></textarea>
              </div>
              <div className="mb-4 flex items-center">
                <div className="mr-4">
                  <label htmlFor="date" className="block text-xl">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="border rounded p-2 text-xl"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-xl">
                    Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="border rounded p-2 text-xl w-40"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-xl" required>
                  Assign User
                </label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={handleUserSelect}
                  className="border rounded w- p-2 text-xl "
                  style={{ width: "100%" }}
                  required
                >
                  <option value="">Select User</option>
                  {userList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-black cursor-pointer"
                    style={{
                      background: "none",
                      marginRight: "130px",
                      marginTop: "8px",
                    }}
                    onClick={() => deleteTask(taskvalue)}
                  />

                  <button
                    type="button"
                    className=" text-black px-4 py-2 rounded"
                    onClick={() => setediting("dashboard")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
            {/* )} */}
          </div>
        </div>
      )}
    </>
  );
}
