import { Button, Input, Modal, Table } from 'antd';
import { useState } from 'react';
import { useColores } from '../../../hooks/useCatalog';

const ManageColor = () => {
    const { colores: data, loading, crear, actualizar, eliminar } = useColores();
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editCodigoHex, setEditCodigoHex] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleNameSubmit = async () => {
        if (editDescripcion.trim() !== "" && editCodigoHex.trim() !== "") {
            try {
                await crear({ 
                    nombre: editDescripcion,
                    codigoHex: editCodigoHex
                });
                setIsModalVisible(false);
                setEditDescripcion('');
                setEditCodigoHex('');
            } catch (error) {
                console.error("No se creó", error);
            }
        } else {
            console.log("El nombre y código hex son requeridos");
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditDescripcion(item.nombre);
        setEditCodigoHex(item.codigoHex || '');
    };

    const handleSave = async (id) => {
        try {
            await actualizar(id, { 
                nombre: editDescripcion,
                codigoHex: editCodigoHex
            });
            setEditId(null);
            setEditDescripcion('');
            setEditCodigoHex('');
            console.log('Actualización exitosa');
        } catch (error) {
            console.error('Error al actualizar el color', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminar(id);
            setEditId(null);
            console.log('Eliminación exitosa');
        } catch (error) {
            console.error('Error al eliminar el color', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Color',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text, record) => (
                editId === record.id ? (
                    <Input
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                    />
                ) : (
                    text
                )
            ),
        },
        {
            title: 'Código Hex',
            dataIndex: 'codigoHex',
            key: 'codigoHex',
            render: (text, record) => (
                editId === record.id ? (
                    <Input
                        value={editCodigoHex}
                        onChange={(e) => setEditCodigoHex(e.target.value)}
                        placeholder="#000000"
                    />
                ) : (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                            width: 20, 
                            height: 20, 
                            backgroundColor: text, 
                            marginRight: 8,
                            border: '1px solid #ccc'
                        }}></div>
                        {text}
                    </span>
                )
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                editId === record.id ? (
                    <Button type="primary" onClick={() => handleSave(record.id)}>
                        Guardar
                    </Button>
                ) : (
                    <>
                        <Button type="link" onClick={() => handleEdit(record)}>
                            Editar
                        </Button>
                        <Button type="link" danger onClick={() => handleDelete(record.id)}>
                            Eliminar
                        </Button>
                    </>
                )
            ),
        },
    ];

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Colores</h2>
            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 20 }}>
                Añadir Color
            </Button>
            {loading ? (
                <p>Cargando colores...</p>
            ) : (
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={false}
            />
            )}
            <Modal
                title="Crear Nuevo Color"
                visible={isModalVisible}
                onOk={handleNameSubmit}
                onCancel={() => setIsModalVisible(false)}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Input
                    placeholder="Nombre del color"
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Input
                    placeholder="Código Hex (ej: #FF5733)"
                    value={editCodigoHex}
                    onChange={(e) => setEditCodigoHex(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default ManageColor;