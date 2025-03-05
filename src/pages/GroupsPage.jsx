import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Card, Select, message } from "antd";
import { API_URL } from "../config";


const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/groups`;
const USERS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/groups/users`;


const GroupsPage = () => {
  const [visible, setVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersMap, setUsersMap] = useState({}); 
  const [form] = Form.useForm();
  const [editingGroup, setEditingGroup] = useState(null);
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se encontraron grupos");
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      message.error("Error al obtener los grupos");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_API_URL); 
      if (!response.ok) throw new Error("No se encontraron usuarios");
      const data = await response.json();
      setUsers(data);


      const userMap = data.reduce((acc, user) => {
        acc[user.id] = user.username || user.email; 
        return acc;
      }, {});
      setUsersMap(userMap);
    } catch (error) {
      message.error("Error al obtener usuarios");
    }
  };

 

  const handleSubmit = async (values) => {
    try {
      const uniqueMembers = Array.from(new Set([userId, ...values.members]));

      const newGroup = {
        name: values.name,
        description: values.description,
        members: uniqueMembers,
        createdBy: userId,
        estatus: values.estatus,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) throw new Error("Error al crear el grupo");

      message.success("Grupo creado");
      form.resetFields();
      setVisible(false);
      fetchGroups();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEdit = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    if (group.createdBy !== userId) {
      message.error("Solo el creador del grupo puede editarlo");
      return;
    }

    setEditingGroup(group);
    form.setFieldsValue({
      name: group.name,
      description: group.description,
      members: group.members,
      estatus: group.estatus,
    });
    setVisible(true);
  };
   
  

  const estatusOrder = {
    "En Progreso": 1,
    "Pausado": 2,
    "En Revisión": 3,
    "Completado": 4,
  };

  const sortedGroups = [...groups].sort((a, b) => estatusOrder[a.estatus] - estatusOrder[b.estatus]);


  const filteredGroups = sortedGroups.filter(group =>
    group.members.some(member => member.id === userId) 
  );

  const groupedByStatus = {
    "En Progreso": [],
    "Pausado": [],
    "En Revisión": [],
    "Completado": [],
  };

  filteredGroups.forEach(group => {
    groupedByStatus[group.estatus].push(group);
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Grupos</h1>

      {Object.keys(groupedByStatus).map(status => (
        <div key={status} style={{ marginBottom: "30px" }}>
          <h2>{status}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {groupedByStatus[status].length > 0 ? (
              groupedByStatus[status].map((group) => (
                <Card
                  key={group.id}
                  title={group.name}
                  style={{ backgroundColor: "#f0f2f5" }}
                >
                  <p><strong>Descripción:</strong> {group.description}</p>
                  <p><strong>Creado por:</strong> {usersMap[group.createdBy] || "Cargando nombre..."}</p>
                  <p><strong>Miembros:</strong></p>
                  <ul>
                    {group.members.map((member) => (
                      <li key={member.id}>{member.username || "Usuario desconocido"}</li>
                    ))}
                  </ul>
                  {group.createdBy === userId && (
                    <Button onClick={() => handleEdit(group.id)} type="primary">Editar</Button>
                  )}
                </Card>
              ))
            ) : (
              <div>No hay grupos en este estatus</div>
            )}
          </div>
        </div>
      ))}

      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setVisible(true)}
      >
        +
      </Button>

      <Modal title="Nuevo Grupo" open={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nombre del Grupo" name="name" rules={[{ required: true, message: "Campo obligatorio" }]} >
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="description" rules={[{ required: true, message: "Campo obligatorio" }]} >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Miembros" name="members">
            <Select mode="multiple" placeholder="Selecciona miembros">
              {users.filter(user => user.id !== userId).map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.username || user.email}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Estatus" name="estatus" rules={[{ required: true, message: "Campo obligatorio" }]} >
            <Select placeholder="Selecciona un estatus">
              <Select.Option value="En Progreso">En Progreso</Select.Option>
              <Select.Option value="Pausado">Pausado</Select.Option>
              <Select.Option value="En Revisión">En Revisión</Select.Option>
              <Select.Option value="Completado">Completado</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupsPage;
