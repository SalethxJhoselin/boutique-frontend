import { useState } from 'react';
import InputModal from './InputModal';
import { useMarcas } from '../../../hooks/useCatalog';

const ManageBrand = () => {
    const { marcas: data, loading, crear, actualizar, eliminar } = useMarcas();
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');

    const handleNameSubmit = async (name) => {
        if (name.nombre && name.nombre.trim() !== "") {
            try {
                await crear({ nombre: name.nombre });
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
    };

    const handleSave = async (id) => {
        try {
            await actualizar(id, { nombre: editDescripcion });
            setEditId(null);
            console.log('Actualización exitosa');
        } catch (error) {
            console.error('Error al actualizar la marca', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminar(id);
            setEditId(null);
            console.log('Eliminación exitosa');
        } catch (error) {
            console.error('Error al eliminar la marca', error);
        }
    };

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Marcas</h2>
            <InputModal initialValue="brand" onSubmit={handleNameSubmit} />
            {loading ? (
                <p>Cargando marcas...</p>
            ) : (
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Marca</th>
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

export default ManageBrand;