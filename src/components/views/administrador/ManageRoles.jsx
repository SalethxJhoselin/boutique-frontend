import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography, notification, Modal } from 'antd';
import { useCallback, useState } from 'react';
import RoleModal from './RoleModal';
import { useRoles } from '../../../hooks/useRoles';

const { Title } = Typography;
const { confirm } = Modal;

const ManageRoles = () => {
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const { roles, loading, eliminarRol, actualizarRol, refetch } = useRoles();

  const handleEditRole = useCallback((roleId) => {
    setEditingRoleId(roleId);
    const role = roles.find(role => role.id === roleId);
    setEditedData({ 
      [roleId]: { 
        nombre: role.nombre,
        descripcion: role.descripcion 
      } 
    });
  }, [roles]);

  const handleSaveRole = useCallback(async (roleId) => {
    try {
      const role = roles.find(r => r.id === roleId);
      const permisoIds = role.permisos?.map(p => p.id) || [];
      
      await actualizarRol(
        roleId,
        editedData[roleId]?.nombre || role.nombre,
        editedData[roleId]?.descripcion || role.descripcion,
        permisoIds
      );

      setEditingRoleId(null);
      setEditedData({});
      notification.success({ message: '✅ Rol actualizado correctamente' });
    } catch (error) {
      console.error('❌ Error al guardar el rol:', error);
      notification.error({ 
        message: 'Error al guardar el rol', 
        description: error.message 
      });
    }
  }, [editedData, roles, actualizarRol]);

  const handleCancelEdit = useCallback(() => {
    setEditingRoleId(null);
    setEditedData({});
  }, []);

  const handleDeleteRole = useCallback(async (roleId, roleName) => {
    confirm({
      title: '¿Estás seguro de eliminar este rol?',
      content: `Rol: ${roleName}`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await eliminarRol(roleId);
          notification.success({ message: '✅ Rol eliminado correctamente' });
        } catch (error) {
          console.error('❌ Error al eliminar:', error);
          notification.error({ 
            message: 'Error al eliminar el rol', 
            description: error.message 
          });
        }
      },
    });
  }, [eliminarRol]);

  const handleInputChange = useCallback((value, roleId, field) => {
    setEditedData(prevState => ({
      ...prevState,
      [roleId]: {
        ...prevState[roleId],
        [field]: value
      }
    }));
  }, []);

  const renderEditableInput = useCallback((text, record, dataIndex) => {
    if (record.id === editingRoleId && dataIndex === 'nombre') {
      return (
        <Input
          value={editedData[record.id]?.[dataIndex] || text}
          onChange={(e) => handleInputChange(e.target.value, record.id, dataIndex)}
          onPressEnter={() => handleSaveRole(record.id)}
        />
      );
    }
    return text;
  }, [editingRoleId, editedData, handleInputChange, handleSaveRole]);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text, record) => renderEditableInput(text, record, 'nombre'),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => renderEditableInput(text, record, 'descripcion'),
    },
    {
      title: 'Permisos',
      dataIndex: 'permisos',
      key: 'permisos',
      render: (permisos) => (
        <span className="text-gray-600">
          {permisos?.length || 0} permisos
        </span>
      ),
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {editingRoleId === record.id ? (
            <>
              <Button type="primary" onClick={() => handleSaveRole(record.id)} size="small">
                Guardar
              </Button>
              <Button onClick={handleCancelEdit} size="small">
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button 
                type="primary" 
                onClick={() => handleEditRole(record.id)}
                icon={<EditOutlined />}
                size="small"
              />
              <Button 
                danger
                onClick={() => handleDeleteRole(record.id, record.nombre)}
                icon={<DeleteOutlined />}
                size="small"
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
      <Title level={3} className="text-center">Gestionar Roles</Title>
      <div className="flex justify-end mb-6">
        <RoleModal getDatos={refetch} />
      </div>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, size: 'small' }}
        bordered
      />
    </div>
  );
};

export default ManageRoles;