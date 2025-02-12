import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import StudentForm from "./StudentForm";
import { DataGrid } from "@mui/x-data-grid";

const queryParameters = new URLSearchParams(window.location.search);

const Dashboard = () => {
  //eslint-disable-next-line
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // eslint-disable-next-line
  const [sessionList, setSessionList] = useState([]);
  const [isSessionDisplay, setSessionDisplay] = useState(false);
  const navigate = useNavigate();

  function getStudentSessions() {
    axios
      .post(
        "https://knvkl6rw-5000.inc1.devtunnels.ms/sessions/getStudentSessions",
        {
          token: token,
        }
      )
      .then((response) => {
        setSessionList(response.data.sessions);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  console.log("🚀 ~ Dashboard ~ sessionList:", sessionList);

  function toggleStudentForm(action) {
    if (action === "open") {
      setSessionDisplay(true);
    } else {
      localStorage.removeItem("session_id");
      localStorage.removeItem("teacher_email");
      setSessionDisplay(false);
      navigate("/student-dashboard");
    }
  }

  const getDistance = (distance, radius) => {
    return {
      distance: `${distance} km`,
      color: parseFloat(distance) > parseFloat(radius) ? "red" : "green",
    };
  };

  useEffect(() => {
    if (token === "" || token === undefined) {
      navigate("/login");
    } else {
      getStudentSessions();
      document.querySelector(".logout").style.display = "block";
      try {
        if (
          queryParameters.get("session_id") !== null &&
          queryParameters.get("email") !== null
        ) {
          localStorage.setItem("session_id", queryParameters.get("session_id"));
          localStorage.setItem("teacher_email", queryParameters.get("email"));
        }
        if (
          localStorage.getItem("session_id") == null &&
          localStorage.getItem("teacher_email") == null
        ) {
          toggleStudentForm("close");
        } else {
          toggleStudentForm("open");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [token]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => new Date(params).toISOString().split("T")[0],
    },
    { field: "time", headerName: "Time", flex: 1, minWidth: 150 },
    { field: "duration", headerName: "Duration", flex: 1, minWidth: 150 },
    {
      field: "distance",
      headerName: "Distance",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const { distance, radius } = params.row;
        const distanceInfo = getDistance(distance, radius);
        return (
          <span style={{ color: distanceInfo.color }}>
            {distanceInfo.distance}
          </span>
        );
      },
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <img src={params.value} alt="session" width={100} />
      ),
    },
  ];

  // Dummy getDistance function (adjust as needed)

  return (
    <div className="dashboard-main">
      {!isSessionDisplay && (
        <div className="session-list">
          <h2>Your Sessions</h2>
          {/* <table >
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Distance</th>
                <th>Image</th>
              </tr>
            </thead>
            {sessionList.length > 0 ? (
              sessionList.map((session, index) => {
                return (
                  <tbody key={index}>
                    <tr key={index + "0"} className="session">
                      <th key={index + "2"}>{session.name}</th>
                      <th key={index + "3"}>{session.date.split("T")[0]}</th>
                      <th key={index + "4"}>{session.time}</th>
                      <th key={index + "5"}>{session.duration}</th>
                      <th
                        key={index + "6"}
                        className="distance"
                        style={{
                          color: getDistance(session.distance, session.radius)
                            .color,
                        }}
                      >
                        {getDistance(session.distance, session.radius).distance}
                      </th>
                      <th key={index + "7"}>
                        <img src={session.image} alt="session" width={200} />
                      </th>
                    </tr>
                  </tbody>
                );
              })
            ) : (
              <tbody>
                <tr>
                  <td>No sessions found</td>
                </tr>
              </tbody>
            )}
            <tfoot></tfoot>
          </table> */}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <DataGrid
          rows={sessionList}
          columns={columns}
          getRowId={(row) => row._id} // Ensure unique row IDs
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          noRowsOverlay={<div>No sessions found</div>}
        />
      </div>
      {isSessionDisplay && (
        <div className="popup-overlay">
          <StudentForm togglePopup={toggleStudentForm} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
