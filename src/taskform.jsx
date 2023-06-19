/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Viewtask from "./components/viewtask";
// import Select from "react-select";
import "./taskform.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
// import { DayPicker } from "react-day-picker";
// import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DatePicker from "react-datepicker";
import {
  faPencilAlt,
  faCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format, parse, set } from "date-fns";

// import 'react-select/dist/react-select.css';

function TaskForm({ accessToken, companyId }) {
  // const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState();
  const [taskDescription, setTaskDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  // const [showForm, setShowForm] = useState(false);
  // const [date, setDate] = useState(new Date());
  const [isAdd, setIsAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  // const [currentPage, setCurrentP] = useState("view");
  // const [isEdit, setIsEdit] = useState(false);
  const [editVariable, setEditVariable] = useState("");
  const [totalTime, setTotalTime] = useState();
  const [parsing, setParsing] = useState(false);
  const [value, setValue] = useState("");
  const [isComplete, setIsComplete] = useState("");
  // const [isLoading2, setisLoading2] = useState(true);

  // const [selected, setSelected] = React.useState();

  // const handleAddTask = () => {
  //   setShowForm(true);
  // };

  // const handleCancel = () => {
  //   setShowForm(false);
  // };
  console.log(totalTime,'time');
  const formattedDate = selectedDate
    ? parse(selectedDate, "yyyy-MM-dd", new Date())
    : null;
  const defaultTime = set(new Date(), { hours: 0, minutes: 0, seconds: 0 }); // Set the default time to midnight (00:00:00)
  // Edit task details
  useEffect(() => {
    const edit = axios
      .get(
        `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${editVariable}?company_id=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setTaskDescription(response.data.results.task_msg);
        setTotalTime(response.data.results.task_time);
        setTaskDate(response.data.results.task_date);
        setSelectedDate(response.data.results.task_date);
        setSelectedUser(response.data.results.assigned_user);
      })
      .catch((e) => console.log(e));
    // console.log(edit)
  }, [editVariable]);

  useEffect(() => {
    const totalSeconds = Number(totalTime);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setTaskTime(time);
    console.log(time, "totalTime");
  }, [totalTime]);

  // useEffect(() => {
  //   if (
  //     taskDescription != null &&
  //     taskDate != null &&
  //     selectedUser != null &&
  //     taskTime != null
  //   ) {
  //     toggleState()
  //   }
  // }, [taskTime, taskDescription, taskDate, selectedUser]);

  const editTask = async (e) => {
    e.preventDefault();
    setParsing(true);

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
        ` https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${editVariable}?company_id=${companyId}`,
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
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === editVariable) {
              return { ...task, ...taskData };
            } else {
              return task;
            }
          })
        );
        setParsing(false);
        // setIsLoading(true);
        setTaskDescription("");
        setTotalTime("");
        setTaskDate("");
        setSelectedDate("");
        setSelectedUser("");
        setEditVariable("");
      } else {
        setError("Failed to add task");
      }
    } catch (error) {
      setError("Error during task addition");
    }
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

  // Delete Task
  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      handleDeleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${editVariable}?company_id=${companyId}`,
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
          console.log(response.data.results);
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

  const customStyles = {
    // Define your custom styles here
    // For example, changing the background color
    datePicker: {
      background: "red",
    },
    placeholderTextColor: "red", // Change this to your desired color
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

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    setParsing(true);

    // Convert taskTime to seconds
    const [hours, minutes] = taskTime.split(":");
    const totalSeconds = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
    const taskData = {
      assigned_user: selectedUser,
      task_date: selectedDate,
      task_time: totalSeconds,
      is_completed: 0,
      time_zone: new Date().getTimezoneOffset() * 60,
      task_msg: taskDescription,
    };

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
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) => [...prevTasks, taskData]); // Add the new task to the tasks state
        setParsing(false);
        setIsAdd(false);
      } else {
        setError("Failed to add task");
      }
    } catch (error) {
      setError("Error during task addition");
    }
  };

  const addTaskToggle = () => {
    setIsAdd(!isAdd);
    setTaskDescription("");
    setTotalTime("");
    setTaskDate("");
    setSelectedDate("");
    setSelectedUser("");
    setEditVariable("");
  };

  // Toggle state
  // useEffect(() => {
  //   axios
  //     .get(
  //       `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${value}?company_id=${companyId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response.data.results, "response");
  //       setTaskDescription(response.data.results.task_msg);
  //       setTotalTime(response.data.results.task_time);
  //       setTaskDate(response.data.results.task_date);
  //       setSelectedDate(response.data.results.task_date);
  //       setSelectedUser(response.data.results.assigned_user);
  //       setIsComplete(response.data.results.is_completed);
  //       // toggleState();
  //     })
  //     .catch((e) => console.log(e));
  //   // console.log(edit)
  // }, [value]);

  // const toggleState = async (e) => {
  //   // e.preventDefault();
  //   setParsing(true);

  //   // Convert taskTime to seconds
  //   const [hours, minutes] = taskTime.split(":");
  //   const totalSeconds = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
  //   let status;
  //   const complete = isComplete;
  //   if (complete == 0) {
  //     status = 1;
  //   } else {
  //     status = 0;
  //   }
  //   const taskData = {
  //     assigned_user: selectedUser,
  //     task_date: taskDate,
  //     task_time: totalSeconds,
  //     is_completed: status,
  //     time_zone: new Date().getTimezoneOffset() * 60,
  //     task_msg: taskDescription,
  //   };

  //   console.log(taskData, "taskData");

  //   try {
  //     const response = await axios.put(
  //       ` https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${value}?company_id=${companyId}`,
  //       taskData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("completion");

  //       setTasks((prevTasks) =>
  //         prevTasks.map((task) => {
  //           if (task.id === value) {
  //             return { ...task, ...taskData };
  //           } else {
  //             return task;
  //           }
  //         })
  //       );
  //       setParsing(false);
  //       // setIsLoading(true);
  //       setValue("");
  //     } else {
  //       setError("Failed to add task");
  //     }
  //   } catch (error) {
  //     setError("Error during toggling state");
  //     console.log(error);
  //   }
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="w-full">
      <div
        className="flex border-b-2 border-gray-200 "
        style={{
          width: "100%",
          height: "72px",
          backgroundColor: "white",
        }}
      ></div>
      <div
        className="font-semibold"
        style={{ fontSize: "28px", marginLeft: "69px", marginTop: "20px" }}
      >
        Test
      </div>
      <div
        className=""
        style={{
          fontSize: "18px",
          marginLeft: "69px",
          marginTop: "8px",
          color: "#3366FF",
        }}
      >
        Sloovi.com
      </div>
      <div
        className=""
        style={{
          fontSize: "18px",
          marginLeft: "69px",
          marginTop: "5px",
          color: "#767986",
        }}
      >
        <i>Add description,</i>
      </div>

      <div
        className="flex text-gray-800 mt-12 border p-3 pl-6  mb-4 flex items-center"
        style={{
          backgroundColor: "#F9F9FA",
          borderColor: "#E5E5E5",
          width: "505px",
          height: "60px",
          marginLeft: "69px",
        }}
      >
        <p className="" style={{ width: "37px", height: "16px" }}>
          TASKS
        </p>
        <p
          className=""
          style={{
            marginLeft: "25px",
            marginTop: "5px",
            color: "#A2A4AA",
            fontSize: "20px",
          }}
        >
          {" "}
          {tasks.length}
        </p>
        <div
          className="border border-color-black cursor-pointer "
          style={{
            width: "50px",
            height: "57px",
            marginLeft: "385px",
            marginBottom: "1px",
          }}
        >
          <p
            className="color-black"
            style={{ fontSize: "30px" }}
            onClick={addTaskToggle}
          >
            +
          </p>
        </div>
      </div>

      <div>
        {isAdd && (
          <>
            <div
              className="flex  justify-center items-center h-screen"
              style={{
                marginBottom: "-255px",
                marginTop: "-270px",
                marginRight: "1021px",
              }}
            >
              <div
                className=" p-10 shadow-md"
                style={{ backgroundColor: "#EDF7FC" }}
              >
                <form onSubmit={addTask} className="mt-4">
                  {/* Display selected user details */}
                  {userDetails && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">
                        Selected User Details
                      </h3>
                      <p>Name: {userDetails.name}</p>
                      <p>Email: {userDetails.email}</p>
                      {/* Display any other user details as needed */}
                    </div>
                  )}

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-xl mb-2"
                      required
                    >
                      Task Description
                    </label>
                    <textarea
                      id="description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="border rounded text-xl"
                      style={{
                        width: "420px",
                        height: "45px",
                        resize: "none",
                      }}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4 flex items-center">
                    <div className="mr-4">
                      <label htmlFor="date" className="block text-xl mb-2">
                        Date
                      </label>
                      <div className="custom-datepicker relative">
                        <span className="absolute z-50 left-3 top-1/2 transform -translate-y-1/2 text-gray-600 ">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </span>
                        <DatePicker
                          className="react-datepicker__input border w-48 bg-white rounded p-2 pl-9 text-xl pr-10 black-placeholderText"
                          selected={formattedDate}
                          onChange={(date) => {
                            const formatted = format(date, "yyyy-MM-dd");
                            setSelectedDate(formatted);
                          }}
                          customStyles={customStyles}
                          placeholderText="06/13/23"
                          timeInputLabel="" // Set the timeInputLabel to an empty string
                          showTimeSelect={false}
                          timeFormat="HH:mm"
                          timeIntervals={30}
                          minTime={defaultTime}
                          maxTime={set(defaultTime, { hours: 23, minutes: 30 })}
                          dateFormat="dd/MM/yyyy h:mm aa"
                          style={{ color: "black" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-xl mb-2">
                        Time
                      </label>
                      <div className="relative ml-3">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="text-white bg-black rounded-full"
                            style={{ border: "2px solid black" }}
                          />
                        </span>
                        <select
                          id="time"
                          value={taskTime ? taskTime : undefined}
                          onChange={(e) => setTaskTime(e.target.value)}
                          className="border bg-white rounded p-2  px-10 pl-12  text-xl"
                          required
                        >
                          <option value="">Time</option>

                          {/* <option value="00:00">12:00AM</option> */}
                          <option value="00:30">12:30AM</option>
                          <option value="01:00">01:00AM</option>
                          <option value="01:30">01:30AM</option>
                          <option value="02:00">02:00AM</option>
                          <option value="02:30">02:30AM</option>
                          <option value="03:00">03:00AM</option>
                          <option value="03:30">03:30AM</option>
                          <option value="04:00">04:00AM</option>
                          <option value="04:30">04:30AM</option>
                          <option value="05:00">05:00AM</option>
                          <option value="05:30">05:30AM</option>
                          <option value="06:00">06:00AM</option>
                          <option value="06:30">06:30AM</option>
                          <option value="07:00">07:00AM</option>
                          <option value="07:30">07:30AM</option>
                          <option value="08:00">08:00AM</option>
                          <option value="08:30">08:30AM</option>
                          <option value="09:00">09:00AM</option>
                          <option value="09:30">09:30AM</option>
                          <option value="10:00">10:00AM</option>
                          <option value="10:30">10:30AM</option>
                          <option value="11:00">11:00AM</option>
                          <option value="11:30">11:30AM</option>
                          <option value="12:00">12:00PM</option>
                          <option value="12:30">12:30PM</option>
                          <option value="13:00">01:00PM</option>
                          <option value="13:30">01:30PM</option>
                          <option value="14:00">02:00PM</option>
                          <option value="14:30">02:30PM</option>
                          <option value="15:00">03:00PM</option>
                          <option value="15:30">03:30PM</option>
                          <option value="16:00">04:00PM</option>
                          <option value="16:30">04:30PM</option>
                          <option value="17:00">05:00PM</option>
                          <option value="17:30">05:30PM</option>
                          <option value="18:00">06:00PM</option>
                          <option value="18:30">06:30PM</option>
                          <option value="19:00">07:00PM</option>
                          <option value="19:30">07:30PM</option>
                          <option value="20:00">08:00PM</option>
                          <option value="20:30">08:30PM</option>
                          <option value="21:00">09:00PM</option>
                          <option value="21:30">09:30PM</option>
                          <option value="22:00">10:00PM</option>
                          <option value="22:30">10:30PM</option>
                          <option value="23:00">11:00PM</option>
                          <option value="23:30">11:30PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 select-wrapper">
                    <label
                      htmlFor="description"
                      className="block text-xl mb-2"
                      required
                    >
                      Assign User
                    </label>
                    <div className="relative ">
                      {/* <select
                        id="user"
                        value={selectedUser}
                        onChange={handleUserSelect}
                        className="border rounded w-full p-2  bg-white  text-xl appearance-none"
                        style={{
                          width: "420px",
                          height: "45px",
                          resize: "none",
                        }}
                        required
                      >
                        <option value=""> User 1</option>
                        {userList.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select> */}
                      <select
                        id="user"
                        value={selectedUser}
                        onChange={handleUserSelect}
                        className="border rounded w-full p-2 bg-white text-xl appearance-none"
                        style={{
                          width: "420px",
                          height: "45px",
                          resize: "none",
                          color: "black", // Set the color to black
                        }}
                        required
                      >
                        <option value="" disabled hidden>
                          User 1
                        </option>
                        {userList.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      <div className="userm py-1  ">
                        <div className="select-arrow up"></div>
                        <div className="select-arrow down"></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        type="button"
                        className=" text-black px-4 py-2 rounded"
                        onClick={() => setIsAdd(false)}
                      >
                        Cancel
                      </button>
                      {parsing ? (
                        <button
                          type="submit"
                          className={`bg-blue-700 text-white px-8 py-[-20] rounded-full disabled`}
                          disabled={true}
                        >
                          Saving
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className={`bg-blue-700 text-white px-8 py-[-20] rounded-full`}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </form>
                {/* )} */}
              </div>
            </div>
          </>
        )}
        <ul>
          {tasks.map((task) => (
            <>
              {editVariable === task.id ? (
                <>
                  <div
                    className="flex justify-center items-center h-fit"
                    style={{
                      marginBottom: "20px",
                      marginTop: "-16px",
                      marginRight: "1021px",
                    }}
                  >
                    <div
                      className=" p-10 shadow-md"
                      style={{ backgroundColor: "#EDF7FC" }}
                    >
                      <form onSubmit={editTask} className="">
                        {/* Display selected user details */}
                        {userDetails && (
                          <div className="mb-4">
                            <h3 className="text-lg font-bold">
                              Selected User Details
                            </h3>
                            <p>Name: {userDetails.name}</p>
                            <p>Email: {userDetails.email}</p>
                            {/* Display any other user details as needed */}
                          </div>
                        )}

                        <div className="mb-4">
                          <label
                            htmlFor="description"
                            className="block text-xl mb-2"
                            required
                          >
                            Task Description
                          </label>
                          <textarea
                            id="description"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className="border rounded text-xl"
                            style={{
                              width: "420px",
                              height: "45px",
                              resize: "none",
                            }}
                            required
                          ></textarea>
                        </div>

                        <div className="mb-4 flex items-center">
                          <div className="mr-4">
                            <label
                              htmlFor="date"
                              className="block text-xl mb-2"
                            >
                              Date
                            </label>
                            <div className="custom-datepicker relative">
                              <span className="absolute z-50 left-3 top-1/2 transform -translate-y-1/2 text-gray-600 ">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </span>
                              <DatePicker
                                className="react-datepicker__input border w-48 bg-white rounded p-2 pl-9 text-xl pr-10 black-placeholderText"
                                selected={formattedDate}
                                onChange={(date) => {
                                  const formatted = format(date, "yyyy-MM-dd");
                                  setSelectedDate(formatted);
                                }}
                                customStyles={customStyles}
                                placeholderText="06/13/23"
                                timeInputLabel="" // Set the timeInputLabel to an empty string
                                showTimeSelect={false}
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                minTime={defaultTime}
                                maxTime={set(defaultTime, {
                                  hours: 23,
                                  minutes: 30,
                                })}
                                dateFormat="dd/MM/yyyy h:mm aa"
                                style={{ color: "black" }}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="time"
                              className="block text-xl mb-2"
                            >
                              Time
                            </label>
                            <div className="relative ml-3">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="text-white bg-black rounded-full"
                                  style={{ border: "2px solid black" }}
                                />
                              </span>
                              <select
                                id="time"
                                value={taskTime}
                                onChange={(e) => setTaskTime(e.target.value)}
                                className="border bg-white rounded p-2  px-10 pl-12  text-xl"
                                required
                              >
                                <option value="">Time</option>

                                <option value="00:00">12:00AM</option>
                                <option value="00:30">12:30AM</option>
                                <option value="01:00">01:00AM</option>
                                <option value="01:30">01:30AM</option>
                                <option value="02:00">02:00AM</option>
                                <option value="02:30">02:30AM</option>
                                <option value="03:00">03:00AM</option>
                                <option value="03:30">03:30AM</option>
                                <option value="04:00">04:00AM</option>
                                <option value="04:30">04:30AM</option>
                                <option value="05:00">05:00AM</option>
                                <option value="05:30">05:30AM</option>
                                <option value="06:00">06:00AM</option>
                                <option value="06:30">06:30AM</option>
                                <option value="07:00">07:00AM</option>
                                <option value="07:30">07:30AM</option>
                                <option value="08:00">08:00AM</option>
                                <option value="08:30">08:30AM</option>
                                <option value="09:00">09:00AM</option>
                                <option value="09:30">09:30AM</option>
                                <option value="10:00">10:00AM</option>
                                <option value="10:30">10:30AM</option>
                                <option value="11:00">11:00AM</option>
                                <option value="11:30">11:30AM</option>
                                <option value="12:00">12:00PM</option>
                                <option value="12:30">12:30PM</option>
                                <option value="13:00">01:00PM</option>
                                <option value="13:30">01:30PM</option>
                                <option value="14:00">02:00PM</option>
                                <option value="14:30">02:30PM</option>
                                <option value="15:00">03:00PM</option>
                                <option value="15:30">03:30PM</option>
                                <option value="16:00">04:00PM</option>
                                <option value="16:30">04:30PM</option>
                                <option value="17:00">05:00PM</option>
                                <option value="17:30">05:30PM</option>
                                <option value="18:00">06:00PM</option>
                                <option value="18:30">06:30PM</option>
                                <option value="19:00">07:00PM</option>
                                <option value="19:30">07:30PM</option>
                                <option value="20:00">08:00PM</option>
                                <option value="20:30">08:30PM</option>
                                <option value="21:00">09:00PM</option>
                                <option value="21:30">09:30PM</option>
                                <option value="22:00">10:00PM</option>
                                <option value="22:30">10:30PM</option>
                                <option value="23:00">11:00PM</option>
                                <option value="23:30">11:30PM</option>

                                {/* Add more options as needed */}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 select-wrapper">
                          <label
                            htmlFor="description"
                            className="block text-xl mb-2"
                            required
                          >
                            Assign User
                          </label>
                          <div className="relative ">
                            <select
                              id="user"
                              value={selectedUser}
                              onChange={handleUserSelect}
                              className="border rounded w-full p-2  bg-white  text-xl appearance-none"
                              style={{
                                width: "420px",
                                height: "45px",
                                resize: "none",
                              }}
                              required
                            >
                              <option value=""> User 1</option>
                              {userList.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                            </select>
                            <div className="userm py-1  ">
                              <div className="select-arrow up"></div>
                              <div className="select-arrow down"></div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "end" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "10px",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className=" position-absolute z-50 cursor-pointer"
                              style={{
                                color: "#999999",
                                // backgroundColor:"#999999",
                                background: "none",
                                marginRight: "200px",
                                marginTop: "10px",
                              }}
                              onClick={() => deleteTask(editVariable)}
                            />
                            <button
                              type="button"
                              className=" text-black px-4 py-2 rounded"
                              onClick={() => setEditVariable("")}
                            >
                              Cancel
                            </button>
                            {parsing ? (
                              <button
                                type="submit"
                                className="bg-blue-700 text-white px-8 py-[-20] rounded-full"
                                disabled={true}
                              >
                                Saving
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="bg-blue-700 text-white px-8 py-[-20] rounded-full"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                      {/* )} */}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    key={task.id}
                    className=" bg-white text-gray-800 border -mt-5  p-4 pl-6 mb-4 flex "
                    style={{
                      width: "505px",
                      height: "70px",
                      borderColor: "#E5E5E5",
                      marginLeft: "69px",
                    }}
                  >
                    <div className="flex-left">
                      <li
                        className={`flex-grow text-black font-semibold ${
                          task.is_completed ? "completed-task" : ""
                        }`}
                        style={{
                          color: "#262E39",
                          width: "190px", // Adjust the width as per your requirements
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span>{task.task_msg}</span>
                      </li>
                      <li
                        className="flex-grow text-black font-semibold -mt-2"
                        style={{ color: "#D0021B" }}
                      >
                        {task.task_date}
                      </li>
                    </div>
                    <div className="flex-end justify-end ml-44 "
                    // style={{marginRight:"750px"}}
                    >
                      <div className="ml-auto flex -space-x-4">
                        <div className="flex ">
                          <FontAwesomeIcon
                            icon={faPencilAlt}
                            className="text-black cursor-pointer px-4 py-2 rounded"
                            style={{
                              color: "#464A55",
                              fontSize: "16px",
                            }}
                            onClick={() => {
                              setIsAdd(false);
                              setEditVariable(task.id);
                            }}
                          />
                        </div>
                        <div className="flex">
                          <FontAwesomeIcon
                            icon={faBell}
                            className="text-black cursor-pointer px-4 py-2 rounded"
                            style={{
                              color: "#464A55",
                              fontSize: "16px",
                            }}
                          />
                        </div>
                        <div className="flex ">
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-black cursor-pointer px-4 py-2 rounded"
                            style={{
                              color: "#464A55",
                              fontSize: "20px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default TaskForm;
