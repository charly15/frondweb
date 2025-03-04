import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Task Manager</h1>
      <p>Organiza tus tareas de manera eficiente.</p>

      <Link to="/login">
        <Button type="primary" size="large" style={styles.button}>
          Iniciar Sesión
        </Button>
      </Link>


      <Link to="/register">
        <Button type="default" size="large" style={styles.button}>
          Registrarse
        </Button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
  },
  button: {
    margin: "10px",
  },
};

export default LandingPage;
