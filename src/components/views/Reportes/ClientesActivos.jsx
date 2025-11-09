import { useState } from 'react';
import { Table, Card, InputNumber, Button, Spin, Alert, Tag } from 'antd';
import { CrownOutlined, UserOutlined } from '@ant-design/icons';
import { useUsuariosMasActivos } from '../../../hooks/useReportes';

const ClientesActivos = () => {
  const [limite, setLimite] = useState(10);
  const [limiteActual, setLimiteActual] = useState(10);
  const { usuariosMasActivos, loading, error } = useUsuariosMasActivos(limiteActual);

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
        let icon = <UserOutlined />;
        let color = '#1890ff';
        
        if (index === 0) {
          icon = <CrownOutlined style={{ fontSize: 20 }} />;
          color = '#FFD700';
        } else if (index === 1) {
          color = '#C0C0C0';
        } else if (index === 2) {
          color = '#CD7F32';
        }
        
        return (
          <div className="flex items-center justify-center gap-2">
            <span style={{ color, fontSize: 18 }}>{icon}</span>
            <span style={{ fontWeight: index < 3 ? 'bold' : 'normal', color }}>
              {index + 1}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Cliente',
      dataIndex: ['usuario', 'nombre'],
      key: 'nombre',
      width: '25%',
    },
    {
      title: 'Email',
      dataIndex: ['usuario', 'email'],
      key: 'email',
      width: '25%',
    },
    {
      title: 'Total Compras',
      dataIndex: 'totalCompras',
      key: 'totalCompras',
      align: 'center',
      width: '15%',
      sorter: (a, b) => a.totalCompras - b.totalCompras,
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
      title: 'Promedio por Compra',
      key: 'promedio',
      render: (_, record) => {
        const promedio = record.totalCompras > 0 
          ? (record.montoTotal / record.totalCompras).toFixed(2)
          : 0;
        return `$${promedio}`;
      },
      align: 'right',
      width: '15%',
    },
    {
      title: 'Categoría',
      key: 'categoria',
      align: 'center',
      width: '10%',
      render: (_, record) => {
        let tag = { color: 'default', text: 'Regular' };
        
        if (record.montoTotal > 1000) {
          tag = { color: 'gold', text: 'VIP' };
        } else if (record.montoTotal > 500) {
          tag = { color: 'blue', text: 'Premium' };
        } else if (record.montoTotal > 200) {
          tag = { color: 'green', text: 'Frecuente' };
        }
        
        return <Tag color={tag.color}>{tag.text}</Tag>;
      },
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Clientes Más Activos</h1>

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
          dataSource={usuariosMasActivos || []}
          rowKey={(record) => record.usuario.id}
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => `Total ${total} clientes`
          }}
          rowClassName={(_, index) => {
            if (index === 0) return 'bg-yellow-50';
            if (index === 1) return 'bg-gray-50';
            if (index === 2) return 'bg-orange-50';
            return '';
          }}
        />
      </Card>

      {usuariosMasActivos && usuariosMasActivos.length > 0 && (
        <div className="mt-4 space-y-2">
          <Alert
            message="Cliente Top"
            description={`${usuariosMasActivos[0]?.usuario?.nombre} es el cliente más activo con ${usuariosMasActivos[0]?.totalCompras} compras, totalizando $${usuariosMasActivos[0]?.montoTotal?.toFixed(2)}.`}
            type="success"
            showIcon
          />
          
          <Card title="Categorías de Clientes" size="small">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span><Tag color="gold">VIP</Tag> Más de $1,000 en compras</span>
                <span className="font-semibold">
                  {usuariosMasActivos.filter(u => u.montoTotal > 1000).length} clientes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span><Tag color="blue">Premium</Tag> Entre $500 - $1,000</span>
                <span className="font-semibold">
                  {usuariosMasActivos.filter(u => u.montoTotal > 500 && u.montoTotal <= 1000).length} clientes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span><Tag color="green">Frecuente</Tag> Entre $200 - $500</span>
                <span className="font-semibold">
                  {usuariosMasActivos.filter(u => u.montoTotal > 200 && u.montoTotal <= 500).length} clientes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span><Tag>Regular</Tag> Menos de $200</span>
                <span className="font-semibold">
                  {usuariosMasActivos.filter(u => u.montoTotal <= 200).length} clientes
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientesActivos;
