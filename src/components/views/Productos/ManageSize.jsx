import { useState } from 'react';
import InputModal from './InputModal';
import { useTallas } from '../../../hooks/useCatalog';

const ManageSize = () => {
    const { tallas: data, loading, crear, actualizar, eliminar } = useTallas();
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editMedida, setEditMedida] = useState('');


    const handleNameSubmit = async (name) => {
        if (name.nombre && name.nombre.trim() !== "") {
            try {
                await crear({ 
                    nombre: name.nombre,
                    medida: name.medida || name.nombre 
                });
                console.log("Se creó");
            } catch (error) {
                console.error("No se creó", error);
            }
        } else {
            console.log("El nombre no es válido");
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditDescripcion(item.nombre);
        setEditMedida(item.medida || '');
    };

    const handleSave = async (id) => {
        try {
            await actualizar(id, { 
                nombre: editDescripcion,
                medida: editMedida || editDescripcion
            });
            setEditId(null);
            console.log('Actualización exitosa');
        } catch (error) {
            console.error('Error al actualizar la talla', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminar(id);
            setEditId(null);
            console.log('Eliminación exitosa');
        } catch (error) {
            console.error('Error al eliminar la talla', error);
        }
    };

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Tallas</h2>
            <InputModal initialValue="size" onSubmit={handleNameSubmit} />
            {loading ? (
                <p>Cargando tallas...</p>
            ) : (
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Talla</th>
                        <th>Medida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
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
                                        type="text"
                                        value={editMedida}
                                        onChange={(e) => setEditMedida(e.target.value)}
                                    />
                                ) : (
                                    item.medida
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <>
                                        <button onClick={() => handleSave(item.id)}>Guardar</button>
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
            )}
        </div>
    );
};

export default ManageSize;