import React, { useState, useContext } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/api"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await loginUser(values); 
      
     
      login(data.token, { userId: data.userId, email: values.email, role: data.role });
      
      message.success("Inicio de sesión exitoso!");

      
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      message.error(error.response?.data?.msg || "Error al iniciar sesión");
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
            rules={[{ required: true, message: "Ingrese su correo!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Ingrese su contraseña!" }]}
          >
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
