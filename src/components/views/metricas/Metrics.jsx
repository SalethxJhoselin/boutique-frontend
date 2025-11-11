// components/Dashboard.jsx
import { useEffect, useState } from 'react';
import kpisService from '../../../services/kpis.service';
import './Metrics.css';

const Metrics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ventasRango, setVentasRango] = useState('mes');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await kpisService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError('Error cargando los datos del dashboard');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-PE').format(number);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button onClick={loadDashboard} className="retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-error">
        <p>No se pudieron cargar los datos</p>
      </div>
    );
  }

  const { ventas, productos, usuarios, avanzadas } = dashboardData;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard de Métricas</h1>
        <div className="header-actions">
          <button onClick={loadDashboard} className="refresh-btn">
            🔄 Actualizar
          </button>
          <span className="last-update">
            Última actualización: {new Date(dashboardData.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Resumen
        </button>
        <button 
          className={`tab ${activeTab === 'ventas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ventas')}
        >
          💰 Ventas
        </button>
        <button 
          className={`tab ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Productos
        </button>
        <button 
          className={`tab ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuarios
        </button>
        <button 
          className={`tab ${activeTab === 'analiticas' ? 'active' : ''}`}
          onClick={() => setActiveTab('analiticas')}
        >
          🤖 Analíticas ML
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="tab-content">
          {/* KPIs Principales */}
          <div className="kpis-grid">
            <div className="kpi-card primary">
              <div className="kpi-icon">💰</div>
              <div className="kpi-content">
                <h3>Ventas Totales</h3>
                <div className="kpi-value">{formatCurrency(ventas.ventasTotales)}</div>
                <div className={`kpi-trend ${ventas.crecimiento >= 0 ? 'positive' : 'negative'}`}>
                  {ventas.crecimiento >= 0 ? '↗' : '↘'} {Math.abs(ventas.crecimiento)}%
                </div>
              </div>
            </div>

            <div className="kpi-card success">
              <div className="kpi-icon">📦</div>
              <div className="kpi-content">
                <h3>Total Productos</h3>
                <div className="kpi-value">{formatNumber(productos.totalProductos)}</div>
                <div className="kpi-subtitle">{productos.stockBajo} con stock bajo</div>
              </div>
            </div>

            <div className="kpi-card info">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <h3>Total Usuarios</h3>
                <div className="kpi-value">{formatNumber(usuarios.totalUsuarios)}</div>
                <div className="kpi-subtitle">{usuarios.nuevosUsuarios} nuevos este mes</div>
              </div>
            </div>

            <div className="kpi-card warning">
              <div className="kpi-icon">🛒</div>
              <div className="kpi-content">
                <h3>Ticket Promedio</h3>
                <div className="kpi-value">{formatCurrency(ventas.ticketPromedio)}</div>
                <div className="kpi-subtitle">{ventas.ordenesCount} órdenes</div>
              </div>
            </div>
          </div>

          {/* Sección de Ventas y Productos */}
          <div className="content-grid">
            <div className="content-card">
              <h3>📈 Resumen de Ventas</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Órdenes Totales:</span>
                  <span className="metric-value">{formatNumber(ventas.ordenesCount)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Productos Vendidos:</span>
                  <span className="metric-value">{formatNumber(ventas.productosVendidos)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Crecimiento:</span>
                  <span className={`metric-value ${ventas.crecimiento >= 0 ? 'positive' : 'negative'}`}>
                    {ventas.crecimiento}%
                  </span>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>📊 Estado de Inventario</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Stock Bajo:</span>
                  <span className="metric-value warning">{productos.stockBajo}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Sin Stock:</span>
                  <span className="metric-value danger">{productos.sinStock}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Valor Inventario:</span>
                  <span className="metric-value">{formatCurrency(productos.valorInventario)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ventas Tab */}
      {activeTab === 'ventas' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Métricas de Ventas</h2>
            <div className="range-selector">
              <select 
                value={ventasRango} 
                onChange={(e) => setVentasRango(e.target.value)}
                className="range-select"
              >
                <option value="dia">Hoy</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mes</option>
                <option value="anio">Este Año</option>
              </select>
            </div>
          </div>

          <div className="kpis-grid">
            <div className="kpi-card">
              <h4>Ventas Totales</h4>
              <div className="kpi-value large">{formatCurrency(ventas.ventasTotales)}</div>
              <div className="kpi-subtitle">Período: {ventas.rango}</div>
            </div>

            <div className="kpi-card">
              <h4>Órdenes Procesadas</h4>
              <div className="kpi-value large">{formatNumber(ventas.ordenesCount)}</div>
              <div className="kpi-subtitle">Órdenes completadas</div>
            </div>

            <div className="kpi-card">
              <h4>Ticket Promedio</h4>
              <div className="kpi-value large">{formatCurrency(ventas.ticketPromedio)}</div>
              <div className="kpi-subtitle">Por orden</div>
            </div>

            <div className="kpi-card">
              <h4>Crecimiento</h4>
              <div className={`kpi-value large ${ventas.crecimiento >= 0 ? 'positive' : 'negative'}`}>
                {ventas.crecimiento}%
              </div>
              <div className="kpi-subtitle">vs período anterior</div>
            </div>
          </div>

          {/* Estados de Ventas */}
          <div className="content-card">
            <h3>📋 Órdenes por Estado</h3>
            <div className="status-grid">
              {ventas.ventasPorEstado?.map((estado) => (
                <div key={estado.estado} className="status-item">
                  <span className="status-badge">{estado.estado}</span>
                  <span className="status-count">{estado.cantidad} órdenes</span>
                  <span className="status-amount">{formatCurrency(estado.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Productos Tab */}
      {activeTab === 'productos' && (
        <div className="tab-content">
          <h2>Métricas de Productos</h2>
          
          <div className="kpis-grid">
            <div className="kpi-card">
              <h4>Total Productos</h4>
              <div className="kpi-value large">{formatNumber(productos.totalProductos)}</div>
              <div className="kpi-subtitle">En catálogo</div>
            </div>

            <div className="kpi-card warning">
              <h4>Stock Bajo</h4>
              <div className="kpi-value large">{formatNumber(productos.stockBajo)}</div>
              <div className="kpi-subtitle">Necesitan reposición</div>
            </div>

            <div className="kpi-card danger">
              <h4>Sin Stock</h4>
              <div className="kpi-value large">{formatNumber(productos.sinStock)}</div>
              <div className="kpi-subtitle">Agotados</div>
            </div>

            <div className="kpi-card success">
              <h4>Valor Inventario</h4>
              <div className="kpi-value large">{formatCurrency(productos.valorInventario)}</div>
              <div className="kpi-subtitle">Valor total</div>
            </div>
          </div>

          <div className="content-card">
            <h3>🔥 Productos Más Vendidos</h3>
            <div className="products-list">
              {productos.productosPopulares?.slice(0, 5).map((producto, index) => (
                <div key={producto.productoId} className="product-item">
                  <span className="product-rank">#{index + 1}</span>
                  <span className="product-id">ID: {producto.productoId}</span>
                  <span className="product-sales">{formatNumber(producto.totalVendido)} unidades</span>
                  <span className="product-revenue">{formatCurrency(producto.ingresosTotales)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Usuarios Tab */}
      {activeTab === 'usuarios' && (
        <div className="tab-content">
          <h2>Métricas de Usuarios</h2>
          
          <div className="kpis-grid">
            <div className="kpi-card">
              <h4>Total Usuarios</h4>
              <div className="kpi-value large">{formatNumber(usuarios.totalUsuarios)}</div>
              <div className="kpi-subtitle">Registrados</div>
            </div>

            <div className="kpi-card success">
              <h4>Nuevos Usuarios</h4>
              <div className="kpi-value large">{formatNumber(usuarios.nuevosUsuarios)}</div>
              <div className="kpi-subtitle">Este mes</div>
            </div>

            <div className="kpi-card info">
              <h4>Usuarios Activos</h4>
              <div className="kpi-value large">{formatNumber(usuarios.usuariosActivos)}</div>
              <div className="kpi-subtitle">Últimos 30 días</div>
            </div>

            <div className="kpi-card primary">
              <h4>Tasa Conversión</h4>
              <div className="kpi-value large">{usuarios.tasaConversion}%</div>
              <div className="kpi-subtitle">De registro a compra</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="content-card">
              <h3>🛒 Carritos Activos</h3>
              <div className="metric-large">
                <div className="metric-value">{formatNumber(usuarios.carritosActivos)}</div>
                <div className="metric-label">En las últimas 24 horas</div>
              </div>
            </div>

            <div className="content-card">
              <h3>🔍 Búsquedas</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Total Búsquedas:</span>
                  <span className="metric-value">{formatNumber(usuarios.busquedas?.totalBusquedas)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Tasa de Éxito:</span>
                  <span className="metric-value">{usuarios.busquedas?.tasaExito?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analíticas ML Tab */}
      {activeTab === 'analiticas' && (
        <div className="tab-content">
          <h2>Analíticas de Machine Learning</h2>
          
          <div className="content-grid">
            <div className="content-card">
              <h3>🎯 Clasificación ML</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Productos Clasificados:</span>
                  <span className="metric-value">
                    {formatNumber(avanzadas.metricaML?.totalClasificados)}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Confianza Promedio:</span>
                  <span className="metric-value">
                    {avanzadas.metricaML?.confianzaPromedio}%
                  </span>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>📈 Eficiencia de Inventario</h3>
              <div className="metric-large">
                <div className="metric-value">{avanzadas.eficienciaInventario}%</div>
                <div className="metric-label">Productos con stock disponible</div>
              </div>
            </div>
          </div>

          {/* Tipos de Prenda más Comunes */}
          <div className="content-card">
            <h3>👕 Tipos de Prenda Más Comunes</h3>
            <div className="items-list">
              {avanzadas.metricaML?.tiposPrenda?.slice(0, 5).map((tipo) => (
                <div key={tipo.tipoPrenda} className="list-item">
                  <span className="item-name">{tipo.tipoPrenda || 'Sin clasificar'}</span>
                  <span className="item-count">{tipo.total} productos</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;