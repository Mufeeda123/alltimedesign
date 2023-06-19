/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// import LoginPage from "./LoginPage";
// import TaskForm from "./taskform";
import AdminDashboard from "./components/dashboard";
// import Viewtask from "./components/viewtask";

function App() {
  // const [taskTime, setTaskTime] = useState(null);
  // const [sessionstorage, setsessionstorage] = useState(false);
  // useEffect(() => {
  //   const session = localStorage.getItem("islogin");
  //   if (session) {
  //     setsessionstorage(true);
  //   }
  // });
  return (
    <Router>
      <Routes>
        {/* <Route
          exact
          path="/"
          element={
            sessionstorage ? <Navigate to="/admindashboard" /> : <LoginPage />
          }
        />
        <Route
          exact
          path="/admindashboard"
          element={sessionstorage ? <AdminDashboard /> : <Navigate to="/" />}
        /> */}
         <Route
          exact
          path="*"
          element={<AdminDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
