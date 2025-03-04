import React, { useState, useContext } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Usamos la variable de entorno para la URL
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Error al iniciar sesión");

      // Usamos la función login del contexto para actualizar el estado y guardar el usuario
      login(data.token, { userId: data.userId, email: values.email, role: data.role });

      message.success("Inicio de sesión exitoso!");

      // Redirigir al dashboard o panel de administración dependiendo del rol
      if (data.role === "admin") {
        navigate("/admin"); // Redirige al panel de administración
      } else {
        navigate("/dashboard"); // Redirige al dashboard
      }
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <Card title="Iniciar Sesión" style={styles.card}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[{ required: true, message: "Ingrese su correo!" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Ingrese su contraseña!" }]}>
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Ingresar
          </Button>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    width: 300,
  },
};

export default LoginPage;
