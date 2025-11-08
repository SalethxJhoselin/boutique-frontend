import { useState } from 'react';
import { Table, Button, Input, Space, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import InputModal from './InputModal';
import { useDescuentos } from '../../../hooks/useCatalog';

const ManageDiscount = () => {
    const { descuentos, loading, crear, actualizar, eliminar } = useDescuentos();
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editPorcentaje, setEditPorcentaje] = useState('');


    const handleNameSubmit = async (formData) => {
        if (formData.nombre && formData.nombre.trim() !== "") {
            try {
                await crear({
                    nombre: formData.nombre,
                    porcentaje: parseFloat(formData.porcentaje) || 0,
                    fechaInicio: new Date().toISOString(),
                    fechaFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                    activo: true,
                });
                message.success('Descuento creado exitosamente');
            } catch (error) {
                message.error('Error al crear el descuento');
                console.error(error);
            }
        } else {
            message.warning('El nombre no es válido');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);  // Establece el ID del elemento que está siendo editado
        setEditDescripcion(item.nombre);
        setEditPorcentaje(item.porcentaje);
    };

    const handleSave = async (id) => {
        try {
            await actualizar(id, {
                nombre: editDescripcion,
                porcentaje: parseFloat(editPorcentaje),
            });
            setEditId(null);
            message.success('Descuento actualizado exitosamente');
        } catch (error) {
            message.error('Error al actualizar el descuento');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminar(id);
            message.success('Descuento eliminado exitosamente');
        } catch (error) {
            message.error('Error al eliminar el descuento');
            console.error(error);
        }
    };

    if (loading) return <Spin size="large" />;

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Descuentos</h2>
            <InputModal initialValue="descuento" onSubmit={handleNameSubmit} />
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Porcentaje</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {descuentos.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id.substring(0, 8)}</td>
                            <td>
                                {editId === item.id ? (
                                    <input
                                        type="text"
                                        value={editDescripcion}
                                        onChange={(e) => setEditDescripcion(e.target.value)}
                                    />
                                ) : (
                                    item.nombre
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <input
                                        type="number"
                                        value={editPorcentaje}
                                        onChange={(e) => setEditPorcentaje(e.target.value)}
                                    />
                                ) : (
                                    `${item.porcentaje}%`
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <>
                                        <button onClick={() => handleSave(item.id)}>Guardar</button>
                                        <button onClick={() => setEditId(null)}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="edit-btn" onClick={() => handleEdit(item)}>Editar</button>
                                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageDiscount;