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
                                <div key={detalle.productoId} className="mb-3 p-4 border rounded bg-gray-50">
                                    <div className="mb-2">
                                        <span className="font-medium text-base">{producto?.nombre || 'Producto no encontrado'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div style={{ minWidth: 120 }}>
                                            <label className="block text-sm text-gray-600 mb-1">Cantidad:</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={detalle.cantidad}
                                                onChange={(e) =>
                                                    handleCantidadChange(detalle.productoId, e.target.value)
                                                }
                                                style={{ width: 100 }}
                                                size="large"
                                            />
                                        </div>
                                        <div style={{ minWidth: 140 }}>
                                            <label className="block text-sm text-gray-600 mb-1">Precio Unit.:</label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={detalle.precioUnitario}
                                                onChange={(e) =>
                                                    handlePrecioChange(detalle.productoId, e.target.value)
                                                }
                                                addonBefore="$"
                                                style={{ width: 140 }}
                                                size="large"
                                            />
                                        </div>
                                        <div style={{ minWidth: 120 }}>
                                            <label className="block text-sm text-gray-600 mb-1">Subtotal:</label>
                                            <div className="text-lg font-bold text-green-600">
                                                ${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() => handleRemoveProducto(detalle.productoId)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {nota.detalles.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border-2 border-blue-200">
                            <div className="text-xl font-bold text-blue-800">
                                Total: ${nota.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0).toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CreateNotaIngresoModal;