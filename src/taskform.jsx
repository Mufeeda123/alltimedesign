/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Viewtask from "./components/viewtask";

function TaskForm({ accessToken, companyId, setActivePage }) {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // State to hold the selected user details
  const [tasks, setTasks] = useState([]); // State to hold the tasks
  const [showForm, setShowForm] = useState(false); // State to track the visibility of the form

  const handleAddTask = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };
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
        } else {
          setError("Failed to fetch user details");
        }
      } catch (error) {
        setError("Error during user details fetch");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [accessToken, companyId]);

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(
        `https://stage.api.sloovi.com/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUserDetails(response.data);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error during user details fetch:", error);
    }
  };

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

    console.log(taskTime);
    try {
      const response = await axios.post(
        `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=${companyId}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          //   body: JSON.stringify(taskData),
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("API Response:", data);
        setTasks((prevTasks) => [...prevTasks, data]); // Add the new task to the tasks state
        setActivePage("dashboard");
        // Handle any further actions or display success message
      } else {
        setError("Failed to add task");
      }
    } catch (error) {
      setError("Error during task addition");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 shadow-md rounded-lg">
        <form onSubmit={handleTaskSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="user" className="block">
              User:
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={handleUserSelect}
              className="border rounded p-1"
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

          {/* Display selected user details */}
          {userDetails && (
            <div className="mb-4">
              <h3 className="text-lg font-bold">Selected User Details</h3>
              <p>Name: {userDetails.name}</p>
              <p>Email: {userDetails.email}</p>
              {/* Display any other user details as needed */}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="date" className="block text-xl">
              Date:
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

          <div className="mb-4">
            <label htmlFor="time" className="block text-xl">
              Time:
            </label>
            <input
              id="time"
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="border rounded p-2 text-xl"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-xl" required>
              Description:
            </label>
            <textarea
              id="description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="border rounded p-2 text-xl"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </form>
        {/* )} */}
      </div>
    </div>
  );
}
export default TaskForm;
