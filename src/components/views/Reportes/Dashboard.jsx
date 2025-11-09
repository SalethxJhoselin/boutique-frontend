import { Row, Col, Card, Statistic, Table, Spin, Alert } from 'antd';
import { 
  DollarOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  InboxOutlined,
  RiseOutlined,
  FallOutlined 
} from '@ant-design/icons';
import { useReporteGeneral } from '../../../hooks/useReportes';

const Dashboard = () => {
  const { reporte, loading, error } = useReporteGeneral();

  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

  const productosColumns = [
    {
      title: 'Producto',
      dataIndex: ['producto', 'nombre'],
      key: 'nombre',
    },
    {
      title: 'Cantidad Vendida',
      dataIndex: 'cantidadVendida',
      key: 'cantidadVendida',
      align: 'center',
    },
    {
      title: 'Monto Total',
      dataIndex: 'montoTotal',
      key: 'montoTotal',
      render: (monto) => `$${monto.toFixed(2)}`,
      align: 'right',
    },
  ];

  const usuariosColumns = [
    {
      title: 'Cliente',
      dataIndex: ['usuario', 'nombre'],
      key: 'nombre',
    },
    {
      title: 'Email',
      dataIndex: ['usuario', 'email'],
      key: 'email',
    },
    {
      title: 'Total Compras',
      dataIndex: 'totalCompras',
      key: 'totalCompras',
      align: 'center',
    },
    {
      title: 'Monto Total',
      dataIndex: 'montoTotal',
      key: 'montoTotal',
      render: (monto) => `$${monto.toFixed(2)}`,
      align: 'right',
    },
  ];

  const stockColumns = [
    {
      title: 'Producto',
      dataIndex: ['producto', 'nombre'],
      key: 'nombre',
    },
    {
      title: 'Stock Actual',
      dataIndex: 'stockActual',
      key: 'stockActual',
      align: 'center',
      render: (stock) => (
        <span style={{ color: stock === 0 ? 'red' : stock < 10 ? 'orange' : 'green' }}>
          {stock}
        </span>
      ),
    },
    {
      title: 'Stock Mínimo',
      dataIndex: 'stockMinimo',
      key: 'stockMinimo',
      align: 'center',
    },
    {
      title: 'Precio',
      dataIndex: ['producto', 'precio'],
      key: 'precio',
      render: (precio) => `$${precio.toFixed(2)}`,
      align: 'right',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard General</h1>

      {/* Estadísticas de Ventas */}
      <h2 className="text-xl font-semibold mb-4">Estadísticas de Ventas</h2>
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Ventas"
              value={reporte?.ventas?.totalVentas || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Monto Total"
              value={reporte?.ventas?.montoTotal || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Promedio por Venta"
              value={reporte?.ventas?.promedioVenta || 0}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ventas Procesadas"
              value={reporte?.ventas?.ventasProcesadas || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-8">
        <Col span={8}>
          <Card>
            <Statistic
              title="Ventas Pendientes"
              value={reporte?.ventas?.ventasPendientes || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Ventas Canceladas"
              value={reporte?.ventas?.ventasCanceladas || 0}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Estadísticas de Inventario */}
      <h2 className="text-xl font-semibold mb-4">Estadísticas de Inventario</h2>
      <Row gutter={16} className="mb-8">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Productos"
              value={reporte?.inventario?.totalProductos || 0}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Productos Activos"
              value={reporte?.inventario?.productosActivos || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sin Stock"
              value={reporte?.inventario?.productosSinStock || 0}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Valor Total Inventario"
              value={reporte?.inventario?.valorTotalInventario || 0}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Productos Más Vendidos */}
      <h2 className="text-xl font-semibold mb-4">Top 5 Productos Más Vendidos</h2>
      <Card className="mb-6">
        <Table
          columns={productosColumns}
          dataSource={reporte?.productosMasVendidos?.slice(0, 5) || []}
          rowKey={(record) => record.producto.id}
          pagination={false}
        />
      </Card>

      {/* Clientes Más Activos */}
      <h2 className="text-xl font-semibold mb-4">Top 5 Clientes Más Activos</h2>
      <Card className="mb-6">
        <Table
          columns={usuariosColumns}
          dataSource={reporte?.usuariosMasActivos?.slice(0, 5) || []}
          rowKey={(record) => record.usuario.id}
          pagination={false}
        />
      </Card>

      {/* Productos Bajo Stock */}
      <h2 className="text-xl font-semibold mb-4">Productos con Bajo Stock</h2>
      <Card>
        <Table
          columns={stockColumns}
          dataSource={reporte?.productosBajoStock || []}
          rowKey={(record) => record.producto.id}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
