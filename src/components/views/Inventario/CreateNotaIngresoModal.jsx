import { Button, Input, Modal, Select, Space, message } from 'antd';
import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';

const { Option } = Select;

function CreateNotaIngresoModal({ visible, closeModal, refreshNotas }) {
    const [nota, setNota] = useState({
        observacion: '',
        detalles: [], // Detalles de los productos seleccionados
    });

    // GraphQL Hook - DATOS REALES DEL BACKEND
    const { products: productos, loading: loadingProductos } = useProducts();

    // Función para manejar la selección de producto
    const handleAddProducto = (productoId) => {
        // Verificar si el producto ya está seleccionado
        if (!nota.detalles.some((detalle) => detalle.producto === productoId)) {
            setNota((prevNota) => ({
                ...prevNota,
                detalles: [
                    ...prevNota.detalles,
                    { producto: productoId, cantidad: 1 }, // Valor inicial de cantidad
                ],
            }));
        }
    };

    // Función para manejar la actualización de la cantidad
    const handleCantidadChange = (productoId, cantidad) => {
        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.map((detalle) =>
                detalle.producto === productoId
                    ? { ...detalle, cantidad: parseInt(cantidad) }
                    : detalle
            ),
        }));
    };

    // Función para manejar la eliminación de un producto
    const handleRemoveProducto = (productoId) => {
        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.filter((detalle) => detalle.producto !== productoId),
        }));
    };

    // Función para crear la nota de ingreso
    const handleCreateNota = async () => {
        // Validación básica
        if (!nota.observacion.trim()) {
            message.warning('Por favor ingresa una observación');
            return;
        }

        if (nota.detalles.length === 0) {
            message.warning('Por favor selecciona al menos un producto');
            return;
        }

        try {
            const data = {
                observacion: nota.observacion,
                detalles: nota.detalles,
            };

            // ⚠️ BACKEND PENDIENTE: Necesitas implementar el módulo de Inventario/NotaIngreso
            // Cuando esté listo, descomenta estas líneas y crea la mutation:
            // 
            // import { useMutation } from '@apollo/client';
            // import { CREATE_NOTA_INGRESO } from '../../../services/graphql/inventory.queries';
            // 
            // const [crearNotaIngreso] = useMutation(CREATE_NOTA_INGRESO);
            // await crearNotaIngreso({ variables: { input: data } });

            console.log("⚠️ MOCK: Nota de ingreso a crear:", data);
            message.info('⚠️ Función pendiente: Necesitas implementar backend de Inventario');

            // Una vez implementado el backend, descomenta esto:
            // message.success('Nota de ingreso creada exitosamente');
            // refreshNotas();
            // closeModal();
            // setNota({ observacion: '', detalles: [] });

        } catch (error) {
            console.error('Error al crear la nota de ingreso:', error);
            message.error('Error al crear la nota de ingreso');
        }
    };

    return (
        <Modal
            title="Crear Nota de Ingreso"
            visible={visible}
            onCancel={closeModal}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateNota}>
                    Guardar Nota de Ingreso
                </Button>,
            ]}
        >
            <div>
                <h3>Observación:</h3>
                <Input
                    value={nota.observacion}
                    onChange={(e) => setNota({ ...nota, observacion: e.target.value })}
                    placeholder="Ingrese una observación"
                />

                <div className="mt-4">
                    <h3>Seleccione Productos:</h3>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Selecciona un producto"
                        onChange={handleAddProducto}
                        loading={loadingProductos}
                        disabled={loadingProductos}
                    >
                        {productos.map((producto) => (
                            <Option key={producto.id} value={producto.id}>
                                {producto.nombre} - ${producto.precio.toFixed(2)} (Stock: {producto.stock})
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="mt-4">
                    <h3>Productos Seleccionados:</h3>
                    {nota.detalles.length === 0 ? (
                        <p className="text-gray-400 text-sm">No hay productos seleccionados</p>
                    ) : (
                        nota.detalles.map((detalle) => {
                            const producto = productos.find((p) => p.id === detalle.producto);
                            return (
                                <div key={detalle.producto} className="mb-4">
                                    <Space style={{ width: '100%' }} align="baseline">
                                        <span className="font-medium">{producto?.nombre || 'Producto no encontrado'}</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={detalle.cantidad}
                                            onChange={(e) =>
                                                handleCantidadChange(detalle.producto, e.target.value)
                                            }
                                            style={{ width: 80 }}
                                            placeholder="Cant."
                                        />
                                        <span className="text-gray-500">x ${producto?.precio.toFixed(2)}</span>
                                        <Button
                                            type="link"
                                            danger
                                            onClick={() => handleRemoveProducto(detalle.producto)}
                                        >
                                            Eliminar
                                        </Button>
                                    </Space>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CreateNotaIngresoModal;