import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Select, Checkbox } from 'antd';
import { useState } from 'react';
import { useRoles, usePermisos } from '../../../hooks/useRoles';

const RoleModal = ({ getDatos }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const { crearRol } = useRoles();
    const { permisos, loading: loadingPermisos } = usePermisos();

    const handleOk = async () => {
        if (!roleName.trim()) {
            messageApi.warning('Por favor ingresa un nombre para el rol');
            return;
        }

        try {
            await crearRol(roleName, roleDescription, selectedPermisos);
            
            setIsModalOpen(false);
            setRoleName('');
            setRoleDescription('');
            setSelectedPermisos([]);
            getDatos();
            messageApi.success('✅ Rol creado exitosamente');
        } catch (error) {
            console.error('❌ Error al crear el rol:', error);
            messageApi.error('Error al guardar el rol');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setRoleName('');
        setRoleDescription('');
        setSelectedPermisos([]);
    };

    return (
        <>
            <Button
                type="primary"
                style={{
                    backgroundColor: '#4CAF50',
                    borderRadius: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
            >
                Crear Rol
            </Button>
            <Modal
                title="Agregar Nuevo Rol"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Guardar"
                cancelText="Cerrar"
                okButtonProps={{ disabled: !roleName }}
                width={600}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Nombre del Rol *</label>
                        <Input
                            placeholder="Ej: Vendedor, Cajero, etc."
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Descripción</label>
                        <Input.TextArea
                            placeholder="Descripción del rol (opcional)"
                            value={roleDescription}
                            onChange={(e) => setRoleDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Permisos</label>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Selecciona permisos"
                            value={selectedPermisos}
                            onChange={setSelectedPermisos}
                            loading={loadingPermisos}
                            optionFilterProp="children"
                        >
                            {permisos.map((permiso) => (
                                <Select.Option key={permiso.id} value={permiso.id}>
                                    {permiso.nombre} - {permiso.descripcion}
                                </Select.Option>
                            ))}
                        </Select>
                        <small className="text-gray-500">
                            {selectedPermisos.length} permisos seleccionados
                        </small>
                    </div>
                </div>
                {contextHolder}
            </Modal>
        </>
    );
};

export default RoleModal;