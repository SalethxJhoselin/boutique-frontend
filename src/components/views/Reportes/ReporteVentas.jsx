import { useState } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Button, Table, Spin, Alert } from 'antd';
import { DollarOutlined, ShoppingOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useReporteVentas, useVentasPorFecha } from '../../../hooks/useReportes';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ReporteVentas = () => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  
  const { reporteVentas, loading, error } = useReporteVentas(fechaInicio, fechaFin);
  const { ventasPorFecha, loading: loadingVentas } = useVentasPorFecha(fechaInicio, fechaFin);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setFechaInicio(dates[0].format('YYYY-MM-DD'));
      setFechaFin(dates[1].format('YYYY-MM-DD'));
    } else {
      setFechaInicio(null);
      setFechaFin(null);
    }
  };

  const handleResetDates = () => {
    setFechaInicio(null);
    setFechaFin(null);
  };

  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha) => dayjs(fecha).format('DD/MM/YYYY'),
    },
    {
      title: 'Cantidad de Ventas',
      dataIndex: 'cantidadVentas',
      key: 'cantidadVentas',
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reporte de Ventas</h1>
        <div className="flex gap-2">
          <RangePicker 
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            placeholder={['Fecha Inicio', 'Fecha Fin']}
          />
          <Button onClick={handleResetDates}>Limpiar</Button>
        </div>
      </div>

      {fechaInicio && fechaFin && (
        <Alert
          message={`Mostrando datos desde ${dayjs(fechaInicio).format('DD/MM/YYYY')} hasta ${dayjs(fechaFin).format('DD/MM/YYYY')}`}
          type="info"
          className="mb-4"
          closable
        />
      )}

      {/* Estadísticas Principales */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Ventas"
              value={reporteVentas?.totalVentas || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Monto Total"
              value={reporteVentas?.montoTotal || 0}
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
              value={reporteVentas?.promedioVenta || 0}
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
              value={reporteVentas?.ventasProcesadas || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Estados de Ventas */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Ventas Pendientes"
              value={reporteVentas?.ventasPendientes || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Ventas Canceladas"
              value={reporteVentas?.ventasCanceladas || 0}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tasa de Éxito"
              value={reporteVentas?.totalVentas 
                ? ((reporteVentas.ventasProcesadas / reporteVentas.totalVentas) * 100).toFixed(1)
                : 0}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabla de Ventas por Fecha */}
      {ventasPorFecha && ventasPorFecha.length > 0 && (
        <Card title="Ventas por Fecha" className="mt-6">
          <Table
            columns={columns}
            dataSource={ventasPorFecha}
            rowKey="fecha"
            loading={loadingVentas}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
};

export default ReporteVentas;
