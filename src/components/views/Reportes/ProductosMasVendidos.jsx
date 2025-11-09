import { useState } from 'react';
import { Table, Card, InputNumber, Button, Spin, Alert } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { useProductosMasVendidos } from '../../../hooks/useReportes';

const ProductosMasVendidos = () => {
  const [limite, setLimite] = useState(10);
  const [limiteActual, setLimiteActual] = useState(10);
  const { productosMasVendidos, loading, error } = useProductosMasVendidos(limiteActual);

  const handleBuscar = () => {
    setLimiteActual(limite);
  };

  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

  const columns = [
    {
      title: 'Ranking',
      key: 'ranking',
      width: '10%',
      align: 'center',
      render: (_, __, index) => {
        let color = '#1890ff';
        let icon = null;
        if (index === 0) {
          color = '#FFD700';
          icon = <TrophyOutlined style={{ color: '#FFD700', fontSize: 20 }} />;
        } else if (index === 1) {
          color = '#C0C0C0';
          icon = <TrophyOutlined style={{ color: '#C0C0C0', fontSize: 18 }} />;
        } else if (index === 2) {
          color = '#CD7F32';
          icon = <TrophyOutlined style={{ color: '#CD7F32', fontSize: 16 }} />;
        }
        
        return (
          <div className="flex items-center justify-center gap-2">
            {icon}
            <span style={{ fontWeight: index < 3 ? 'bold' : 'normal', color }}>
              {index + 1}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Producto',
      dataIndex: ['producto', 'nombre'],
      key: 'nombre',
      width: '35%',
    },
    {
      title: 'Categoría',
      dataIndex: ['producto', 'categoria'],
      key: 'categoria',
      width: '15%',
    },
    {
      title: 'Cantidad Vendida',
      dataIndex: 'cantidadVendida',
      key: 'cantidadVendida',
      align: 'center',
      width: '15%',
      sorter: (a, b) => a.cantidadVendida - b.cantidadVendida,
    },
    {
      title: 'Monto Total',
      dataIndex: 'montoTotal',
      key: 'montoTotal',
      render: (monto) => `$${monto.toFixed(2)}`,
      align: 'right',
      width: '15%',
      sorter: (a, b) => a.montoTotal - b.montoTotal,
    },
    {
      title: 'Precio Unitario',
      dataIndex: ['producto', 'precio'],
      key: 'precio',
      render: (precio) => `$${precio.toFixed(2)}`,
      align: 'right',
      width: '10%',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Productos Más Vendidos</h1>

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Mostrar top:</span>
          <InputNumber
            min={1}
            max={100}
            value={limite}
            onChange={setLimite}
            style={{ width: 100 }}
          />
          <Button type="primary" onClick={handleBuscar}>
            Buscar
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={productosMasVendidos || []}
          rowKey={(record) => record.producto.id}
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => `Total ${total} productos`
          }}
          rowClassName={(_, index) => {
            if (index === 0) return 'bg-yellow-50';
            if (index === 1) return 'bg-gray-50';
            if (index === 2) return 'bg-orange-50';
            return '';
          }}
        />
      </Card>

      {productosMasVendidos && productosMasVendidos.length > 0 && (
        <Alert
          message="Análisis"
          description={`El producto más vendido es "${productosMasVendidos[0]?.producto?.nombre}" con ${productosMasVendidos[0]?.cantidadVendida} unidades vendidas, generando $${productosMasVendidos[0]?.montoTotal?.toFixed(2)} en ventas.`}
          type="success"
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );
};

export default ProductosMasVendidos;
