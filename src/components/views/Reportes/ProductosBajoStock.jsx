import { Table, Card, Tag, Spin, Alert } from 'antd';
import { WarningOutlined, StopOutlined } from '@ant-design/icons';
import { useProductosBajoStock } from '../../../hooks/useReportes';

const ProductosBajoStock = () => {
  const { productosBajoStock, loading, error } = useProductosBajoStock(10);

  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

  const columns = [
    {
      title: 'Producto',
      dataIndex: ['producto', 'nombre'],
      key: 'nombre',
      width: '30%',
    },
    {
      title: 'Categoría',
      dataIndex: ['producto', 'categoria'],
      key: 'categoria',
      width: '15%',
    },
    {
      title: 'Stock Actual',
      dataIndex: 'stockActual',
      key: 'stockActual',
      align: 'center',
      width: '12%',
      render: (stock) => {
        let color = 'green';
        let icon = null;
        if (stock === 0) {
          color = 'red';
          icon = <StopOutlined />;
        } else if (stock < 5) {
          color = 'red';
          icon = <WarningOutlined />;
        } else if (stock < 10) {
          color = 'orange';
          icon = <WarningOutlined />;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {stock}
          </Tag>
        );
      },
    },
    {
      title: 'Stock Mínimo',
      dataIndex: 'stockMinimo',
      key: 'stockMinimo',
      align: 'center',
      width: '12%',
    },
    {
      title: 'Precio',
      dataIndex: ['producto', 'precio'],
      key: 'precio',
      render: (precio) => `$${precio.toFixed(2)}`,
      align: 'right',
      width: '12%',
    },
    {
      title: 'Estado',
      key: 'estado',
      align: 'center',
      width: '15%',
      render: (_, record) => {
        if (record.stockActual === 0) {
          return <Tag color="red">SIN STOCK</Tag>;
        } else if (record.stockActual < 5) {
          return <Tag color="red">CRÍTICO</Tag>;
        } else if (record.stockActual < 10) {
          return <Tag color="orange">BAJO</Tag>;
        }
        return <Tag color="green">NORMAL</Tag>;
      },
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Productos con Bajo Stock</h1>
      
      <Card>
        <div className="mb-4">
          <Alert
            message="Alerta de Inventario"
            description={`Se encontraron ${productosBajoStock?.length || 0} productos con stock bajo o agotados. Considera realizar reabastecimiento.`}
            type={productosBajoStock?.length > 0 ? 'warning' : 'success'}
            showIcon
          />
        </div>

        <Table
          columns={columns}
          dataSource={productosBajoStock || []}
          rowKey={(record) => record.producto.id}
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => `Total ${total} productos`
          }}
          rowClassName={(record) => {
            if (record.stockActual === 0) return 'bg-red-50';
            if (record.stockActual < 5) return 'bg-red-50';
            if (record.stockActual < 10) return 'bg-orange-50';
            return '';
          }}
        />
      </Card>
    </div>
  );
};

export default ProductosBajoStock;
