import React from "react";
import { useEffect } from "react";
import "../styles/Landing.css";
import { Link } from "react-router-dom";
import About from "./About";
import {Box,Typography} from '@mui/material'


const Landing = () => {
  const [Tutorial, setTutorial] = React.useState(
    localStorage.getItem("tutorial") ? false : true
  );

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  });

  function toggleDone() {
    setTutorial(false);
    localStorage.setItem("tutorial", false);
  }

  return (
    <div className="landing-main">
      {Tutorial ? (
        <About toggleDone={toggleDone} />
      ) : (
        <div className="landing-main">
          <Box textAlign="center" mt={4}>
  <Typography variant="h3" component="h1" gutterBottom>
    Landing Page
  </Typography>
  <Typography variant="body1" color="textSecondary">
    Hello and welcome!
  </Typography>
</Box>
          <Box display="flex" flexDirection="column" gap={2} alignItems="center">
  <Link style={{width:'120px'}} to="/login" className="landing-login-button">
    Login
  </Link>
  <Link style={{width:'120px'}} to="/register" className="landing-register-button">
    Register
  </Link>
</Box>
        </div>
      )}
    </div>
  );
};

export default Landing;
