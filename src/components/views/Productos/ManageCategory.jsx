import { useState } from 'react';
import { Spin, message } from 'antd';
import InputModal from './InputModal';
import { useCategorias } from '../../../hooks/useCatalog';

const ManageCategory = () => {
    const { categorias, loading, crear, actualizar, eliminar } = useCategorias();
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');

    const handleNameSubmit = async (formData) => {
        if (formData.nombre && formData.nombre.trim() !== "") {
            try {
                await crear({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion || '',
                    activo: true,
                });
                message.success('Categoría creada exitosamente');
            } catch (error) {
                message.error('Error al crear la categoría');
                console.error(error);
            }
        } else {
            message.warning('El nombre no es válido');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditDescripcion(item.nombre);
    };

    const handleSave = async (id) => {
        try {
            await actualizar(id, { nombre: editDescripcion });
            setEditId(null);
            message.success('Categoría actualizada exitosamente');
        } catch (error) {
            message.error('Error al actualizar la categoría');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminar(id);
            message.success('Categoría eliminada exitosamente');
        } catch (error) {
            message.error('Error al eliminar la categoría');
            console.error(error);
        }
    };

    if (loading) return <Spin size="large" />;

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Categorías</h2>
            <InputModal initialValue="category" onSubmit={handleNameSubmit} />
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((item) => (
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

export default ManageCategory;
