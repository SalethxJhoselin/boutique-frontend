import { Button, Checkbox, Select, Typography, notification, Tag, Space, Divider } from 'antd';
import { useState } from 'react';
import { useRoles, usePermisos } from '../../../hooks/useRoles';

const { Title } = Typography;

const ManagePermissions = () => {
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [rolePermissions, setRolePermissions] = useState([]);

    const { roles, loading: loadingRoles, actualizarRol } = useRoles();
    const { permisos, loading: loadingPermisos, inicializarPermisos } = usePermisos();

    const handleRoleChange = (value) => {
        setSelectedRoleId(value);
        const selectedRole = roles.find(role => role.id === value);
        const permisoIds = selectedRole?.permisos?.map(p => p.id) || [];
        setRolePermissions(permisoIds);
    };

    const handlePermissionChange = (permissionId) => {
        setRolePermissions(prevPermissions =>
            prevPermissions.includes(permissionId)
                ? prevPermissions.filter(id => id !== permissionId)
                : [...prevPermissions, permissionId]
        );
    };

    const handleSavePermissions = async () => {
        const selectedRole = roles.find(role => role.id === selectedRoleId);
        if (!selectedRole) {
            notification.error({ message: 'Rol seleccionado no válido' });
            return;
        }

        try {
            await actualizarRol(
                selectedRoleId,
                selectedRole.nombre,
                selectedRole.descripcion,
                rolePermissions
            );

            notification.success({ message: 'Permisos actualizados correctamente' });

            // Actualizar la vista local
            const updatedRole = roles.find(role => role.id === selectedRoleId);
            const updatedPermisoIds = updatedRole?.permisos?.map(p => p.id) || [];
            setRolePermissions(updatedPermisoIds);
        } catch (error) {
            console.error('❌ Error al actualizar permisos:', error);
            notification.error({
                message: 'Error al actualizar permisos',
                description: error.message
            });
        }
    };

    const handleInicializarPermisos = async () => {
        try {
            const permisosCreados = await inicializarPermisos();
            notification.success({ 
                message: 'Permisos inicializados correctamente', 
                description: `${permisosCreados.length} permisos básicos creados` 
            });
        } catch (error) {
            notification.error({ message: 'Error al inicializar permisos' });
        }
    };

    // Agrupar permisos por módulo
    const permisosPorModulo = permisos.reduce((acc, permiso) => {
        const modulo = permiso.modulo || 'General';
        if (!acc[modulo]) acc[modulo] = [];
        acc[modulo].push(permiso);
        return acc;
    }, {});

    return (
        <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
            <Title level={3} className="text-center">Gestionar Permisos</Title>
            
            <Space style={{ marginBottom: 16 }}>
                <Button 
                    onClick={handleInicializarPermisos}
                    loading={loadingPermisos}
                >
                    Inicializar Permisos Básicos
                </Button>
                <Tag color="blue">{permisos.length} permisos disponibles</Tag>
            </Space>

            <div className="mb-6">
                <h3 className="text-lg">Rol:</h3>
                <Select
                    style={{ width: '100%' }}
                    onChange={handleRoleChange}
                    value={selectedRoleId}
                    placeholder="Seleccionar Rol"
                    loading={loadingRoles}
                >
                    {roles.length > 0 ? (
                        roles.map(role => (
                            <Select.Option key={role.id} value={role.id}>
                                {role.nombre} {role.descripcion && `- ${role.descripcion}`}
                            </Select.Option>
                        ))
                    ) : (
                        <Select.Option disabled>No hay roles disponibles</Select.Option>
                    )}
                </Select>
            </div>

            {selectedRoleId && (
                <>
                    <div className="mb-6">
                        <h3 className="text-lg">Permisos:</h3>
                        
                        {loadingPermisos ? (
                            <p>Cargando permisos...</p>
                        ) : (
                            <div className="flex flex-col items-start">
                                {Object.entries(permisosPorModulo).map(([modulo, permisosDelModulo]) => (
                                    <div key={modulo} style={{ width: '100%', marginBottom: 16 }}>
                                        <Divider orientation="left">
                                            <Tag color="geekblue">{modulo}</Tag>
                                        </Divider>
                                        {permisosDelModulo.map(permission => (
                                            <div key={permission.id} className="mb-2">
                                                <Checkbox
                                                    checked={rolePermissions.includes(permission.id)}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                >
                                                    <strong>{permission.nombre}</strong>
                                                    {permission.descripcion && (
                                                        <span style={{ marginLeft: 8, color: '#666', fontSize: '0.9em' }}>
                                                            - {permission.descripcion}
                                                        </span>
                                                    )}
                                                </Checkbox>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <Button
                            type="primary"
                            className="w-full"
                            onClick={handleSavePermissions}
                        >
                            Guardar Permisos
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManagePermissions;