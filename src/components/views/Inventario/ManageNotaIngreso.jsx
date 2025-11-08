import { Button, Table, Tag, Space, Modal, notification } from 'antd';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import CreateNotaIngresoModal from './CreateNotaIngresoModal';
import { useNotasIngreso } from '../../../hooks/useNotasIngreso';

const ManageNotaIngreso = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { notasIngreso, loading, actualizarEstado, eliminarNotaIngreso, refetch } = useNotasIngreso();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const refreshNotas = () => {
        refetch();
    };

    const handleProcesar = (notaId) => {
        Modal.confirm({
            title: '¿Procesar esta nota de ingreso?',
            content: 'Esta acción marcará la nota como procesada y actualizará el inventario.',
            okText: 'Procesar',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await actualizarEstado(notaId, 'procesada');
                    notification.success({ message: 'Nota de ingreso procesada correctamente' });
                    refetch();
                } catch (error) {
                    notification.error({ 
                        message: 'Error al procesar nota de ingreso',
                        description: error.message 
                    });
                }
            }
        });
    };

    const handleCancelar = (notaId) => {
        Modal.confirm({
            title: '¿Cancelar esta nota de ingreso?',
            content: 'Esta acción marcará la nota como cancelada.',
            okText: 'Cancelar Nota',
            cancelText: 'Volver',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await actualizarEstado(notaId, 'cancelada');
                    notification.success({ message: 'Nota de ingreso cancelada' });
                    refetch();
                } catch (error) {
                    notification.error({ 
                        message: 'Error al cancelar nota de ingreso',
                        description: error.message 
                    });
                }
            }
        });
    };

    const handleEliminar = (notaId) => {
        Modal.confirm({
            title: '¿Eliminar esta nota de ingreso?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            cancelText: 'Cancelar',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await eliminarNotaIngreso(notaId);
                    notification.success({ message: 'Nota de ingreso eliminada' });
                    refetch();
                } catch (error) {
                    notification.error({ 
                        message: 'Error al eliminar nota de ingreso',
                        description: error.message 
                    });
                }
            }
        });
    };

    const handleVerDetalles = (nota) => {
        Modal.info({
            title: `Detalles de ${nota.numero}`,
            width: 700,
            content: (
                <div>
                    <p><strong>Proveedor:</strong> {nota.proveedor || 'N/A'}</p>
                    <p><strong>Fecha:</strong> {new Date(nota.fechaCreacion).toLocaleString()}</p>
                    <p><strong>Estado:</strong> <Tag color={
                        nota.estado === 'procesada' ? 'green' : 
                        nota.estado === 'cancelada' ? 'red' : 'blue'
                    }>{nota.estado}</Tag></p>
                    {nota.observaciones && <p><strong>Observaciones:</strong> {nota.observaciones}</p>}
                    
                    <h4 style={{ marginTop: 16 }}>Productos:</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: 8, textAlign: 'left' }}>Producto</th>
                                <th style={{ padding: 8, textAlign: 'center' }}>Cantidad</th>
                                <th style={{ padding: 8, textAlign: 'right' }}>Precio Unit.</th>
                                <th style={{ padding: 8, textAlign: 'right' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nota.detalles?.map((detalle, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: 8 }}>{detalle.producto?.nombre || `Producto ${detalle.productoId}`}</td>
                                    <td style={{ padding: 8, textAlign: 'center' }}>{detalle.cantidad}</td>
                                    <td style={{ padding: 8, textAlign: 'right' }}>${detalle.precio_unitario.toFixed(2)}</td>
                                    <td style={{ padding: 8, textAlign: 'right' }}>${detalle.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{ marginTop: 16, textAlign: 'right', fontSize: '1.1em' }}>
                        <strong>Total: ${nota.total.toFixed(2)}</strong>
                    </p>
                </div>
            )
        });
    };

    const columns = [
        {
            title: 'Número',
            dataIndex: 'numero',
            key: 'numero',
            width: 150,
        },
        {
            title: 'Proveedor',
            dataIndex: 'proveedor',
            key: 'proveedor',
            width: 180,
            render: (proveedor) => proveedor || 'N/A',
        },
        {
            title: 'Fecha',
            dataIndex: 'fechaCreacion',
            key: 'fechaCreacion',
            render: (fecha) => new Date(fecha).toLocaleString(),
            width: 180,
        },
        {
            title: 'Items',
            dataIndex: 'detalles',
            key: 'items',
            render: (detalles) => detalles?.length || 0,
            align: 'center',
            width: 80,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `$${total.toFixed(2)}`,
            align: 'right',
            width: 120,
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (estado) => {
                const color = estado === 'procesada' ? 'green' : 
                             estado === 'cancelada' ? 'red' : 'blue';
                return <Tag color={color}>{estado?.toUpperCase()}</Tag>;
            },
            width: 120,
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={() => handleVerDetalles(record)}
                    >
                        Ver
                    </Button>
                    {record.estado === 'pendiente' && (
                        <>
                            <Button 
                                type="primary" 
                                size="small"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleProcesar(record.id)}
                            >
                                Procesar
                            </Button>
                            <Button 
                                danger 
                                size="small"
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleCancelar(record.id)}
                            >
                                Cancelar
                            </Button>
                        </>
                    )}
                    <Button 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleEliminar(record.id)}
                    >
                        Eliminar
                    </Button>
                </Space>
            ),
            width: 320,
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestión de Notas de Ingreso</h2>

            <Button
                type="primary"
                icon={<FaPlus />}
                onClick={showModal}
                style={{ marginBottom: 16 }}
            >
                Crear Nota de Ingreso
            </Button>

            <CreateNotaIngresoModal
                visible={isModalVisible}
                closeModal={closeModal}
                refreshNotas={refreshNotas}
            />

            <Table
                columns={columns}
                dataSource={notasIngreso}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="mt-6"
                scroll={{ x: 1200, y: 400 }}
            />
        </div>
    );
};

export default ManageNotaIngreso;