import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Card, message, Row, Col, DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "../config";


// Usamos una variable de entorno para la URL de la API
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tasks`; 

const DashboardPage = () => {
  const [visible, setVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState(null);
  const userId = localStorage.getItem("userId");

  // Obtener tareas desde la API
  const fetchTasks = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      setTasks(response.data.tasks);
    } catch (error) {
      message.error("Error al obtener tareas");
    }
  };

  // Usamos useEffect para cargar las tareas cuando el componente se monta
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // Función para manejar el envío de las tareas
  const handleSubmit = async (values) => {
    if (!userId) {
      message.error("Usuario no autenticado");
      return;
    }

    try {
      if (editingTask) {
        // Actualizamos una tarea existente
        await axios.put(`${API_URL}/${userId}/${editingTask.id}`, {
          userId,
          ...values,
          timeUntilFinish: values.timeUntilFinish.format("YYYY-MM-DD"),
        });
        message.success("Tarea actualizada");
      } else {
        // Creamos una nueva tarea
        await axios.post(API_URL, {
          userId,
          ...values,
          timeUntilFinish: values.timeUntilFinish.format("YYYY-MM-DD"),
        });
        message.success("Tarea guardada");
      }

      // Restablecer el formulario y actualizar la lista de tareas
      form.resetFields();
      setVisible(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      message.error("Error al guardar la tarea");
    }
  };

  // Función para editar una tarea
  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      timeUntilFinish: dayjs(task.timeUntilFinish),
    });
    setVisible(true);
  };

  // Función para eliminar una tarea
  const handleDelete = async (taskId) => {
    const userId = localStorage.getItem("userId"); 
  
    try {
      const response = await axios.delete(`${API_URL}/${userId}/${taskId}`);

      fetchTasks(); // Actualizamos las tareas después de la eliminación
    } catch (error) {
      message.error("Error al eliminar la tarea");
    }
  };

  // Agrupamos las tareas por estado
  const groupedTasks = {
    "En Progreso": [],
    "Pausado": [],
    "En Revisión": [],
    "Completado": [],
  };

  tasks.forEach((task) => {
    const statusMap = {
      "In Progress": "En Progreso",
      "Paused": "Pausado",
      "Revision": "En Revisión",
      "Done": "Completado",
    };
    const mappedStatus = statusMap[task.status] || "Otros";
    if (groupedTasks[mappedStatus]) {
      groupedTasks[mappedStatus].push(task);
    }
  });

  return (
    <div style={{ padding: "20px" }}>
      <Card title="Panel de Tareas" style={{ width: "100%" }} />

      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => {
          setEditingTask(null);
          form.resetFields();
          setVisible(true);
        }}
      >
        +
      </Button>

      <Modal title={editingTask ? "Editar Tarea" : "Nueva Tarea"} open={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: "Campo obligatorio" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="description" rules={[{ required: true, message: "Campo obligatorio" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Fecha límite" name="timeUntilFinish" rules={[{ required: true, message: "Campo obligatorio" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Categoría" name="category" rules={[{ required: true, message: "Campo obligatorio" }]}>
            <Select>
              <Select.Option value="Trabajo">Trabajo</Select.Option>
              <Select.Option value="Estudio">Estudio</Select.Option>
              <Select.Option value="Personal">Personal</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Estado" name="status" rules={[{ required: true, message: "Campo obligatorio" }]}>
            <Select>
              <Select.Option value="In Progress">En Progreso</Select.Option>
              <Select.Option value="Paused">Pausado</Select.Option>
              <Select.Option value="Revision">En Revisión</Select.Option>
              <Select.Option value="Done">Completado</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">{editingTask ? "Actualizar" : "Guardar"}</Button>
        </Form>
      </Modal>

      <Row gutter={16} style={{ marginTop: "20px" }}>
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <Col key={status} span={6}>
            <Card title={status} style={{ minHeight: "300px", backgroundColor: "#f0f2f5" }}>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <Card key={task.id} style={{ marginBottom: "10px", backgroundColor: "#fff" }}>
                    <p><strong>{task.name}</strong></p>
                    <p>{task.description}</p>
                    <p><strong>Fecha:</strong> {task.timeUntilFinish}</p>
                    <p><strong>Categoría:</strong> {task.category}</p>
                    <Button type="link" onClick={() => handleEdit(task)}>Editar</Button>
                    <Button type="link" danger onClick={() => handleDelete(task.id)}>Eliminar</Button>
                  </Card>
                ))
              ) : (
                <p>No hay tareas</p>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardPage;
