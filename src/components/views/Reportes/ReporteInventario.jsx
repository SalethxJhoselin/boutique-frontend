import { Row, Col, Card, Statistic, Spin, Alert } from 'antd';
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { useReporteInventario } from '../../../hooks/useReportes';

const ReporteInventario = () => {
  const { reporteInventario, loading, error } = useReporteInventario();

  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

  const porcentajeActivos = reporteInventario?.totalProductos 
    ? ((reporteInventario.productosActivos / reporteInventario.totalProductos) * 100).toFixed(1)
    : 0;

  const porcentajeSinStock = reporteInventario?.totalProductos 
    ? ((reporteInventario.productosSinStock / reporteInventario.totalProductos) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reporte Completo de Inventario</h1>

      {/* Resumen General */}
      <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Productos"
              value={reporteInventario?.totalProductos || 0}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Productos Activos"
              value={reporteInventario?.productosActivos || 0}
              suffix={`(${porcentajeActivos}%)`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Productos Inactivos"
              value={reporteInventario?.productosInactivos || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Valor Total Inventario"
              value={reporteInventario?.valorTotalInventario || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alertas de Stock */}
      <h2 className="text-xl font-semibold mb-4">Alertas de Stock</h2>
      <Row gutter={16} className="mb-6">
        <Col span={12}>
          <Card>
            <Statistic
              title="Productos Sin Stock"
              value={reporteInventario?.productosSinStock || 0}
              suffix={`(${porcentajeSinStock}%)`}
              valueStyle={{ color: '#f5222d' }}
            />
            <div className="mt-2 text-sm text-gray-500">
              Productos que requieren reabastecimiento urgente
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Productos con Bajo Stock"
              value={reporteInventario?.productosBajoStock || 0}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div className="mt-2 text-sm text-gray-500">
              Productos por debajo del stock mínimo recomendado
            </div>
          </Card>
        </Col>
      </Row>

      {/* Información Adicional */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Análisis de Inventario" className="mb-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-semibold">Tasa de Disponibilidad:</span>
                <span className="text-lg font-bold text-blue-600">
                  {reporteInventario?.totalProductos 
                    ? ((reporteInventario.productosActivos - reporteInventario.productosSinStock) / reporteInventario.totalProductos * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-semibold">Productos Disponibles para Venta:</span>
                <span className="text-lg font-bold text-green-600">
                  {(reporteInventario?.productosActivos || 0) - (reporteInventario?.productosSinStock || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="font-semibold">Valor Promedio por Producto:</span>
                <span className="text-lg font-bold text-purple-600">
                  ${reporteInventario?.totalProductos 
                    ? (reporteInventario.valorTotalInventario / reporteInventario.totalProductos).toFixed(2)
                    : 0}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recomendaciones */}
      {(reporteInventario?.productosSinStock > 0 || reporteInventario?.productosBajoStock > 0) && (
        <Alert
          message="Recomendaciones"
          description={
            <ul className="list-disc ml-4 mt-2">
              {reporteInventario.productosSinStock > 0 && (
                <li>Se recomienda crear notas de ingreso para {reporteInventario.productosSinStock} producto(s) sin stock.</li>
              )}
              {reporteInventario.productosBajoStock > 0 && (
                <li>Revisar {reporteInventario.productosBajoStock} producto(s) con bajo stock para planificar reabastecimiento.</li>
              )}
              <li>Considerar ajustar precios o promociones para productos con exceso de inventario.</li>
            </ul>
          }
          type="warning"
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );
};

export default ReporteInventario;
