import React from "react";
import { Button, Card, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";


const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await registerUser(values); 
      message.success("Usuario registrado. Ahora inicie sesión.");
      navigate("/login");
    } catch (error) {
      message.error(error.msg || "Error al registrar.");
    }
  };

  return (
    <div style={styles.container}>
      <Card title="Registrarse" style={styles.card}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Ingrese un email válido" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Usuario" rules={[{ required: true, message: "Ingrese un usuario" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: "Ingrese una contraseña" }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Registrarse
          </Button>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  card: { width: 300 },
};

export default RegisterPage;
