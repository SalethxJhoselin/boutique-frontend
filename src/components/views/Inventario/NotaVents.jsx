import { Table, Button, Tag, Space, Modal, notification, Statistic, Row, Col, Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useNotasVenta, useEstadisticasVentas } from '../../../hooks/useNotasVenta';

const NotaVentas = () => {
    const { notasVenta, loading, procesarNotaVenta, cancelarNotaVenta, refetch } = useNotasVenta();
    const { estadisticas, loading: loadingStats } = useEstadisticasVentas();

    const handleProcesar = (notaId) => {
        Modal.confirm({
            title: '¿Procesar esta nota de venta?',
            content: 'Esta acción actualizará el inventario según los productos vendidos.',
            okText: 'Procesar',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await procesarNotaVenta(notaId);
                    notification.success({ message: 'Nota de venta procesada correctamente' });
                    refetch();
                } catch (error) {
                    notification.error({ 
                        message: 'Error al procesar nota de venta',
                        description: error.message 
                    });
                }
            }
        });
    };

    const handleCancelar = (notaId) => {
        Modal.confirm({
            title: '¿Cancelar esta nota de venta?',
            content: 'Esta acción marcará la nota como cancelada.',
            okText: 'Cancelar Nota',
            cancelText: 'Volver',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await cancelarNotaVenta(notaId);
                    notification.success({ message: 'Nota de venta cancelada' });
                    refetch();
                } catch (error) {
                    notification.error({ 
                        message: 'Error al cancelar nota de venta',
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
                    <p><strong>Cliente:</strong> {nota.usuario?.nombre || nota.usuario?.email}</p>
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
                                    <td style={{ padding: 8, textAlign: 'right' }}>${detalle.precioUnitario.toFixed(2)}</td>
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
            title: 'Fecha',
            dataIndex: 'fechaCreacion',
            key: 'fechaCreacion',
            render: (fecha) => new Date(fecha).toLocaleString(),
            width: 180,
        },
        {
            title: 'Cliente',
            dataIndex: 'usuario',
            key: 'usuario',
            render: (usuario) => usuario?.nombre || usuario?.email || 'N/A',
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
                </Space>
            ),
            width: 280,
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestión de Notas de Venta</h2>

            {estadisticas && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Card>
                            <Statistic 
                                title="Total Ventas" 
                                value={estadisticas.totalVentas || 0}
                                prefix="$"
                                precision={2}
                                loading={loadingStats}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic 
                                title="Ventas Procesadas" 
                                value={estadisticas.ventasProcesadas || 0}
                                loading={loadingStats}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic 
                                title="Ventas Pendientes" 
                                value={estadisticas.ventasPendientes || 0}
                                loading={loadingStats}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic 
                                title="Ventas Canceladas" 
                                value={estadisticas.ventasCanceladas || 0}
                                loading={loadingStats}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            <Table
                columns={columns}
                dataSource={notasVenta}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="mt-6"
                scroll={{ x: 1200, y: 400 }}
            />
        </div>
    );
};

export default NotaVentas;