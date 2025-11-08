import { Button, Input, Modal, Select, Space, message } from 'antd';
import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useNotasIngreso } from '../../../hooks/useNotasIngreso';

const { Option } = Select;

function CreateNotaIngresoModal({ visible, closeModal, refreshNotas }) {
    const [nota, setNota] = useState({
        proveedor: '',
        observaciones: '',
        detalles: [],
    });

    const { products: productos, loading: loadingProductos } = useProducts();
    const { crearNotaIngreso, loading: creando } = useNotasIngreso();

    const handleAddProducto = (productoId) => {
        if (!nota.detalles.some((detalle) => detalle.productoId === productoId)) {
            const producto = productos.find(p => p.id === productoId);
            setNota((prevNota) => ({
                ...prevNota,
                detalles: [
                    ...prevNota.detalles,
                    {
                        productoId,
                        cantidad: 1,
                        precioUnitario: producto?.precio || 0,
                    },
                ],
            }));
        }
    };

    const handleCantidadChange = (productoId, cantidad) => {
        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.map((detalle) =>
                detalle.productoId === productoId
                    ? { ...detalle, cantidad: parseInt(cantidad) }
                    : detalle
            ),
        }));
    };

    const handlePrecioChange = (productoId, precio) => {
        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.map((detalle) =>
                detalle.productoId === productoId
                    ? { ...detalle, precioUnitario: parseFloat(precio) }
                    : detalle
            ),
        }));
    };

    const handleRemoveProducto = (productoId) => {
        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.filter((detalle) => detalle.productoId !== productoId),
        }));
    };

    const handleCreateNota = async () => {
        if (!nota.proveedor.trim()) {
            message.warning('Por favor ingresa el proveedor');
            return;
        }

        if (nota.detalles.length === 0) {
            message.warning('Por favor selecciona al menos un producto');
            return;
        }

        try {
            await crearNotaIngreso(
                nota.proveedor,
                nota.observaciones,
                nota.detalles
            );

            message.success('✅ Nota de ingreso creada exitosamente');
            setNota({ proveedor: '', observaciones: '', detalles: [] });
            if (refreshNotas) refreshNotas();
            closeModal();

        } catch (error) {
            console.error('❌ Error al crear la nota de ingreso:', error);
            message.error('Error al crear la nota de ingreso');
        }
    };

    return (
        <Modal
            title="Crear Nota de Ingreso"
            open={visible}
            onCancel={closeModal}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateNota} loading={creando}>
                    Guardar Nota de Ingreso
                </Button>,
            ]}
        >
            <div>
                <h3>Proveedor:</h3>
                <Input
                    value={nota.proveedor}
                    onChange={(e) => setNota({ ...nota, proveedor: e.target.value })}
                    placeholder="Nombre del proveedor"
                    className="mb-3"
                />

                <h3>Observaciones:</h3>
                <Input.TextArea
                    value={nota.observaciones}
                    onChange={(e) => setNota({ ...nota, observaciones: e.target.value })}
                    placeholder="Ingrese observaciones (opcional)"
                    rows={3}
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
                            const producto = productos.find((p) => p.id === detalle.productoId);
                            return (
                                <div key={detalle.productoId} className="mb-4 p-3 border rounded">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <span className="font-medium">{producto?.nombre || 'Producto no encontrado'}</span>
                                        <Space>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={detalle.cantidad}
                                                onChange={(e) =>
                                                    handleCantidadChange(detalle.productoId, e.target.value)
                                                }
                                                style={{ width: 80 }}
                                                placeholder="Cant."
                                                addonBefore="Cant."
                                            />
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={detalle.precioUnitario}
                                                onChange={(e) =>
                                                    handlePrecioChange(detalle.productoId, e.target.value)
                                                }
                                                style={{ width: 120 }}
                                                placeholder="Precio"
                                                addonBefore="$"
                                            />
                                            <span className="text-gray-700 font-semibold">
                                                Subtotal: ${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}
                                            </span>
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() => handleRemoveProducto(detalle.productoId)}
                                            >
                                                Eliminar
                                            </Button>
                                        </Space>
                                    </Space>
                                </div>
                            );
                        })
                    )}
                    {nota.detalles.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-100 rounded">
                            <strong>Total: $
                                {nota.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0).toFixed(2)}
                            </strong>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CreateNotaIngresoModal;