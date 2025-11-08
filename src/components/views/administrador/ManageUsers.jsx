import { Button, Select, Space, Table, Typography, notification, Modal, Tag } from 'antd';
import { useState } from 'react';
import { useUsuarios } from '../../../hooks/useUsuarios';
import { useRoles } from '../../../hooks/useRoles';

const { Title } = Typography;
const { confirm } = Modal;

const ManageUsers = () => {
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState(null);

    const { usuarios, loading: loadingUsuarios, asignarRoles, eliminarUsuario } = useUsuarios();
    const { roles, loading: loadingRoles } = useRoles();

    const handleSaveRole = async (userId) => {
        if (!selectedRoleId) {
            notification.warning({ message: 'Debe seleccionar un rol' });
            return;
        }

        try {
            await asignarRoles(userId, selectedRoleId);
            notification.success({ message: '✅ Rol asignado exitosamente' });
            setEditingUserId(null);
            setSelectedRoleId(null);
        } catch (error) {
            console.error('❌ Error al asignar rol:', error);
            notification.error({
                message: 'Error al asignar rol',
                description: error.message,
            });
        }
    };

    const handleDeleteUser = (userId, userName) => {
        confirm({
            title: '¿Estás seguro de eliminar este usuario?',
            content: `Usuario: ${userName}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            async onOk() {
                try {
                    await eliminarUsuario(userId);
                    notification.success({ message: '✅ Usuario eliminado' });
                } catch (error) {
                    notification.error({ message: 'Error al eliminar usuario' });
                }
            },
        });
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Rol Actual',
            dataIndex: 'rolNombre',
            key: 'rolNombre',
            render: (rolNombre, record) => (
                <Tag color={record.activo ? 'green' : 'red'}>
                    {rolNombre || 'Sin rol'}
                </Tag>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'activo',
            key: 'activo',
            render: (activo) => (
                <Tag color={activo ? 'success' : 'error'}>
                    {activo ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Editar Rol',
            key: 'editRol',
            render: (_, record) => {
                if (record.id === editingUserId) {
                    return (
                        <Select
                            style={{ width: 180 }}
                            placeholder="Selecciona un rol"
                            value={selectedRoleId}
                            onChange={setSelectedRoleId}
                            loading={loadingRoles}
                        >
                            {roles.map((rol) => (
                                <Select.Option key={rol.id} value={rol.id}>
                                    {rol.nombre}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
                return (
                    <span className="text-gray-400">
                        {record.rol?.descripcion || 'Sin descripción'}
                    </span>
                );
            },
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {record.id === editingUserId ? (
                        <>
                            <Button type="primary" onClick={() => handleSaveRole(record.id)} size="small">
                                Guardar
                            </Button>
                            <Button onClick={() => {
                                setEditingUserId(null);
                                setSelectedRoleId(null);
                            }} size="small">
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button type="primary" onClick={() => {
                                setEditingUserId(record.id);
                                setSelectedRoleId(record.rol?.id || null);
                            }} size="small">
                                Editar Rol
                            </Button>
                            <Button
                                danger
                                onClick={() => handleDeleteUser(record.id, record.nombre)}
                                size="small"
                            >
                                Eliminar
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
            <Title level={3} className="text-center">Usuarios Registrados</Title>
            <Table
                columns={columns}
                dataSource={usuarios}
                rowKey="id"
                loading={loadingUsuarios}
                pagination={{ pageSize: 10, size: 'small' }}
                bordered
            />
        </div>
    );
};

export default ManageUsers;