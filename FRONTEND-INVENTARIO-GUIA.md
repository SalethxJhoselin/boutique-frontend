# 📦 GUÍA COMPLETA: MÓDULO DE INVENTARIO PARA FRONTEND REACT

**Fecha:** 8 de Noviembre 2025  
**Backend:** NestJS GraphQL (localhost:3001/graphql)  
**Módulo:** Notas de Ingreso (Inventario)

---

## 📋 ÍNDICE

1. [GraphQL Schema y Operaciones](#1-graphql-schema-y-operaciones)
2. [Apollo Client Setup](#2-apollo-client-setup)
3. [Estructura de Carpetas Frontend](#3-estructura-de-carpetas-frontend)
4. [Queries GraphQL](#4-queries-graphql)
5. [Mutations GraphQL](#5-mutations-graphql)
6. [Componentes React](#6-componentes-react)
7. [Hooks Personalizados](#7-hooks-personalizados)
8. [Formularios](#8-formularios)
9. [Tablas y Listas](#9-tablas-y-listas)
10. [Estados y Validaciones](#10-estados-y-validaciones)
11. [Permisos y Roles](#11-permisos-y-roles)
12. [Código Completo](#12-código-completo)

---

## 1. GRAPHQL SCHEMA Y OPERACIONES

### 🔹 Types del Backend

```graphql
type NotaIngreso {
  id: ID!
  numero_nota: String!          # Formato: NI-2025-0001
  usuario: User!
  proveedor: String!
  observaciones: String
  total: Float!
  estado: String!               # 'pendiente' | 'procesada' | 'cancelada'
  detalles: [DetalleNotaIngreso!]!
  fecha_creacion: DateTime!
  fecha_actualizacion: DateTime!
}

type DetalleNotaIngreso {
  id: ID!
  notaIngreso: NotaIngreso!
  producto: Product!
  cantidad: Int!
  precio_unitario: Float!
  subtotal: Float!
  observacion: String
}

type User {
  id: ID!
  email: String!
  nombre: String!
  rolNombre: String
}

type Product {
  id: ID!
  nombre: String!
  descripcion: String
  precio: Float!
  stock: Int!
  imagen_url: String
  activo: Boolean!
}
```

### 🔹 Queries Disponibles

```graphql
type Query {
  # Obtener todas las notas de ingreso (admin)
  obtenerNotasIngreso: [NotaIngreso!]!
  
  # Obtener una nota de ingreso por ID
  obtenerNotaIngresoPorId(id: ID!): NotaIngreso!
  
  # Obtener notas de ingreso del usuario autenticado
  misNotasIngreso: [NotaIngreso!]!
  
  # Obtener todos los productos (para seleccionar en formulario)
  getProducts: [Product!]!
}
```

### 🔹 Mutations Disponibles

```graphql
type Mutation {
  # Crear nueva nota de ingreso
  crearNotaIngreso(createNotaIngresoInput: CreateNotaIngresoInput!): NotaIngreso!
  
  # Actualizar estado de nota de ingreso
  actualizarEstadoNotaIngreso(
    id: ID!
    updateEstadoInput: UpdateEstadoNotaIngresoInput!
  ): NotaIngreso!
}

input CreateNotaIngresoInput {
  proveedor: String!
  observaciones: String
  detalles: [CreateDetalleNotaIngresoInput!]!
}

input CreateDetalleNotaIngresoInput {
  productoId: String!
  cantidad: Int!
  precio_unitario: Float!
  observacion: String
}

input UpdateEstadoNotaIngresoInput {
  estado: String!  # 'pendiente' | 'procesada' | 'cancelada'
}
```

---

## 2. APOLLO CLIENT SETUP

### 📦 Instalación

```bash
npm install @apollo/client graphql
```

### ⚙️ apolloClient.js

```javascript
// src/graphql/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
```

### 🔌 Integración en App.js

```javascript
// src/App.js
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventarioPage from './pages/InventarioPage';
import CrearNotaIngresoPage from './pages/CrearNotaIngresoPage';
import DetalleNotaIngresoPage from './pages/DetalleNotaIngresoPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/inventario/nuevo" element={<CrearNotaIngresoPage />} />
          <Route path="/inventario/:id" element={<DetalleNotaIngresoPage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
```

---

## 3. ESTRUCTURA DE CARPETAS FRONTEND

```
src/
├── components/
│   ├── inventario/
│   │   ├── NotaIngresoCard.jsx
│   │   ├── NotaIngresoTable.jsx
│   │   ├── NotaIngresoForm.jsx
│   │   ├── DetalleNotaIngresoTable.jsx
│   │   ├── EstadoBadge.jsx
│   │   ├── ProductSelector.jsx
│   │   └── InventarioStats.jsx
│   │
│   └── common/
│       ├── Loading.jsx
│       ├── ErrorMessage.jsx
│       └── ConfirmDialog.jsx
│
├── pages/
│   ├── InventarioPage.jsx
│   ├── CrearNotaIngresoPage.jsx
│   └── DetalleNotaIngresoPage.jsx
│
├── graphql/
│   ├── apolloClient.js
│   ├── queries/
│   │   └── inventario.queries.js
│   └── mutations/
│       └── inventario.mutations.js
│
├── hooks/
│   ├── useNotasIngreso.js
│   ├── useCrearNotaIngreso.js
│   └── useActualizarEstado.js
│
├── utils/
│   ├── formatters.js
│   └── validators.js
│
└── styles/
    └── inventario.css
```

---

## 4. QUERIES GRAPHQL

### 📄 src/graphql/queries/inventario.queries.js

```javascript
import { gql } from '@apollo/client';

// Query: Obtener todas las notas de ingreso
export const GET_NOTAS_INGRESO = gql`
  query ObtenerNotasIngreso {
    obtenerNotasIngreso {
      id
      numero_nota
      usuario {
        id
        nombre
        email
      }
      proveedor
      observaciones
      total
      estado
      fecha_creacion
      fecha_actualizacion
      detalles {
        id
        producto {
          id
          nombre
          imagen_url
          stock
        }
        cantidad
        precio_unitario
        subtotal
        observacion
      }
    }
  }
`;

// Query: Obtener una nota de ingreso por ID
export const GET_NOTA_INGRESO_BY_ID = gql`
  query ObtenerNotaIngresoPorId($id: ID!) {
    obtenerNotaIngresoPorId(id: $id) {
      id
      numero_nota
      usuario {
        id
        nombre
        email
      }
      proveedor
      observaciones
      total
      estado
      fecha_creacion
      fecha_actualizacion
      detalles {
        id
        producto {
          id
          nombre
          descripcion
          imagen_url
          precio
          stock
        }
        cantidad
        precio_unitario
        subtotal
        observacion
      }
    }
  }
`;

// Query: Obtener mis notas de ingreso
export const GET_MIS_NOTAS_INGRESO = gql`
  query MisNotasIngreso {
    misNotasIngreso {
      id
      numero_nota
      proveedor
      total
      estado
      fecha_creacion
      detalles {
        id
        cantidad
        subtotal
      }
    }
  }
`;

// Query: Obtener productos para selector
export const GET_PRODUCTOS = gql`
  query GetProducts {
    getProducts {
      id
      nombre
      descripcion
      precio
      stock
      imagen_url
      activo
    }
  }
`;
```

---

## 5. MUTATIONS GRAPHQL

### 📄 src/graphql/mutations/inventario.mutations.js

```javascript
import { gql } from '@apollo/client';

// Mutation: Crear nota de ingreso
export const CREAR_NOTA_INGRESO = gql`
  mutation CrearNotaIngreso($createNotaIngresoInput: CreateNotaIngresoInput!) {
    crearNotaIngreso(createNotaIngresoInput: $createNotaIngresoInput) {
      id
      numero_nota
      proveedor
      observaciones
      total
      estado
      fecha_creacion
      detalles {
        id
        producto {
          id
          nombre
        }
        cantidad
        precio_unitario
        subtotal
        observacion
      }
    }
  }
`;

// Mutation: Actualizar estado de nota de ingreso
export const ACTUALIZAR_ESTADO_NOTA_INGRESO = gql`
  mutation ActualizarEstadoNotaIngreso(
    $id: ID!
    $updateEstadoInput: UpdateEstadoNotaIngresoInput!
  ) {
    actualizarEstadoNotaIngreso(
      id: $id
      updateEstadoInput: $updateEstadoInput
    ) {
      id
      numero_nota
      estado
      fecha_actualizacion
    }
  }
`;
```

---

## 6. COMPONENTES REACT

### 📄 src/components/inventario/NotaIngresoTable.jsx

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EstadoBadge from './EstadoBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const NotaIngresoTable = ({ notas, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">Cargando notas de ingreso...</div>;
  }

  if (!notas || notas.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay notas de ingreso registradas</p>
        <button onClick={() => navigate('/inventario/nuevo')}>
          Crear primera nota
        </button>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="tabla-notas-ingreso">
        <thead>
          <tr>
            <th>Número</th>
            <th>Proveedor</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td className="numero-nota">{nota.numero_nota}</td>
              <td>{nota.proveedor}</td>
              <td>{nota.usuario.nombre}</td>
              <td className="total">{formatCurrency(nota.total)}</td>
              <td>
                <EstadoBadge estado={nota.estado} />
              </td>
              <td>{formatDate(nota.fecha_creacion)}</td>
              <td>
                <button
                  onClick={() => navigate(`/inventario/${nota.id}`)}
                  className="btn-ver-detalle"
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotaIngresoTable;
```

### 📄 src/components/inventario/EstadoBadge.jsx

```javascript
import React from 'react';

const EstadoBadge = ({ estado }) => {
  const getEstadoClass = () => {
    switch (estado) {
      case 'pendiente':
        return 'badge badge-warning';
      case 'procesada':
        return 'badge badge-success';
      case 'cancelada':
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  };

  const getEstadoText = () => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'procesada':
        return 'Procesada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  return <span className={getEstadoClass()}>{getEstadoText()}</span>;
};

export default EstadoBadge;
```

### 📄 src/components/inventario/NotaIngresoForm.jsx

```javascript
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTOS } from '../../graphql/queries/inventario.queries';
import ProductSelector from './ProductSelector';

const NotaIngresoForm = ({ onSubmit, loading }) => {
  const [proveedor, setProveedor] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [detalles, setDetalles] = useState([]);

  const { data: productosData } = useQuery(GET_PRODUCTOS);

  const agregarDetalle = () => {
    setDetalles([
      ...detalles,
      {
        id: Date.now(), // ID temporal
        productoId: '',
        cantidad: 1,
        precio_unitario: 0,
        observacion: '',
      },
    ]);
  };

  const eliminarDetalle = (id) => {
    setDetalles(detalles.filter((d) => d.id !== id));
  };

  const actualizarDetalle = (id, campo, valor) => {
    setDetalles(
      detalles.map((d) =>
        d.id === id ? { ...d, [campo]: valor } : d
      )
    );
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, d) => {
      return sum + (d.cantidad * d.precio_unitario);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!proveedor.trim()) {
      alert('El proveedor es obligatorio');
      return;
    }

    if (detalles.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    const detallesValidos = detalles.every(
      (d) => d.productoId && d.cantidad > 0 && d.precio_unitario > 0
    );

    if (!detallesValidos) {
      alert('Complete todos los datos de los productos');
      return;
    }

    // Preparar datos para mutation
    const input = {
      proveedor: proveedor.trim(),
      observaciones: observaciones.trim() || undefined,
      detalles: detalles.map((d) => ({
        productoId: d.productoId,
        cantidad: parseInt(d.cantidad),
        precio_unitario: parseFloat(d.precio_unitario),
        observacion: d.observacion || undefined,
      })),
    };

    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="nota-ingreso-form">
      {/* Información General */}
      <div className="form-section">
        <h3>Información General</h3>
        
        <div className="form-group">
          <label htmlFor="proveedor">Proveedor *</label>
          <input
            type="text"
            id="proveedor"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            placeholder="Nombre del proveedor"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones generales (opcional)"
            rows={3}
          />
        </div>
      </div>

      {/* Detalles de Productos */}
      <div className="form-section">
        <div className="section-header">
          <h3>Productos</h3>
          <button
            type="button"
            onClick={agregarDetalle}
            className="btn-agregar"
          >
            + Agregar Producto
          </button>
        </div>

        {detalles.length === 0 ? (
          <div className="empty-detalles">
            <p>No hay productos agregados</p>
          </div>
        ) : (
          <div className="detalles-lista">
            {detalles.map((detalle, index) => (
              <div key={detalle.id} className="detalle-item">
                <div className="detalle-numero">#{index + 1}</div>
                
                <div className="detalle-form">
                  <div className="form-row">
                    <div className="form-group flex-2">
                      <label>Producto *</label>
                      <select
                        value={detalle.productoId}
                        onChange={(e) =>
                          actualizarDetalle(detalle.id, 'productoId', e.target.value)
                        }
                        required
                      >
                        <option value="">Seleccionar producto...</option>
                        {productosData?.getProducts
                          .filter((p) => p.activo)
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre} (Stock: {p.stock})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cantidad *</label>
                      <input
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) =>
                          actualizarDetalle(detalle.id, 'cantidad', e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Precio Unitario *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={detalle.precio_unitario}
                        onChange={(e) =>
                          actualizarDetalle(detalle.id, 'precio_unitario', e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Subtotal</label>
                      <input
                        type="text"
                        value={(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                        disabled
                        className="input-readonly"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-3">
                      <label>Observación</label>
                      <input
                        type="text"
                        value={detalle.observacion}
                        onChange={(e) =>
                          actualizarDetalle(detalle.id, 'observacion', e.target.value)
                        }
                        placeholder="Observación del producto (opcional)"
                      />
                    </div>

                    <div className="form-group align-end">
                      <button
                        type="button"
                        onClick={() => eliminarDetalle(detalle.id)}
                        className="btn-eliminar"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="form-total">
        <div className="total-label">Total:</div>
        <div className="total-amount">Bs. {calcularTotal().toFixed(2)}</div>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Crear Nota de Ingreso'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NotaIngresoForm;
```

### 📄 src/components/inventario/DetalleNotaIngresoTable.jsx

```javascript
import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const DetalleNotaIngresoTable = ({ detalles }) => {
  if (!detalles || detalles.length === 0) {
    return <p>No hay detalles para mostrar</p>;
  }

  return (
    <div className="table-container">
      <table className="tabla-detalles">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle, index) => (
            <tr key={detalle.id}>
              <td>{index + 1}</td>
              <td>
                <div className="producto-info">
                  {detalle.producto.imagen_url && (
                    <img
                      src={detalle.producto.imagen_url}
                      alt={detalle.producto.nombre}
                      className="producto-imagen-small"
                    />
                  )}
                  <span>{detalle.producto.nombre}</span>
                </div>
              </td>
              <td className="text-center">{detalle.cantidad}</td>
              <td className="text-right">{formatCurrency(detalle.precio_unitario)}</td>
              <td className="text-right font-bold">{formatCurrency(detalle.subtotal)}</td>
              <td className="observacion">{detalle.observacion || '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-right font-bold">TOTAL:</td>
            <td className="text-right font-bold total">
              {formatCurrency(
                detalles.reduce((sum, d) => sum + d.subtotal, 0)
              )}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DetalleNotaIngresoTable;
```

### 📄 src/components/inventario/InventarioStats.jsx

```javascript
import React from 'react';

const InventarioStats = ({ notas }) => {
  const stats = {
    total: notas?.length || 0,
    pendientes: notas?.filter((n) => n.estado === 'pendiente').length || 0,
    procesadas: notas?.filter((n) => n.estado === 'procesada').length || 0,
    canceladas: notas?.filter((n) => n.estado === 'cancelada').length || 0,
    montoTotal: notas?.reduce((sum, n) => sum + n.total, 0) || 0,
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-content">
          <div className="stat-label">Total Notas</div>
          <div className="stat-value">{stats.total}</div>
        </div>
      </div>

      <div className="stat-card warning">
        <div className="stat-icon">⏳</div>
        <div className="stat-content">
          <div className="stat-label">Pendientes</div>
          <div className="stat-value">{stats.pendientes}</div>
        </div>
      </div>

      <div className="stat-card success">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-label">Procesadas</div>
          <div className="stat-value">{stats.procesadas}</div>
        </div>
      </div>

      <div className="stat-card danger">
        <div className="stat-icon">❌</div>
        <div className="stat-content">
          <div className="stat-label">Canceladas</div>
          <div className="stat-value">{stats.canceladas}</div>
        </div>
      </div>

      <div className="stat-card primary">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <div className="stat-label">Monto Total</div>
          <div className="stat-value">Bs. {stats.montoTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default InventarioStats;
```

---

## 7. HOOKS PERSONALIZADOS

### 📄 src/hooks/useNotasIngreso.js

```javascript
import { useQuery } from '@apollo/client';
import { GET_NOTAS_INGRESO } from '../graphql/queries/inventario.queries';

const useNotasIngreso = () => {
  const { data, loading, error, refetch } = useQuery(GET_NOTAS_INGRESO, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    notas: data?.obtenerNotasIngreso || [],
    loading,
    error,
    refetch,
  };
};

export default useNotasIngreso;
```

### 📄 src/hooks/useCrearNotaIngreso.js

```javascript
import { useMutation } from '@apollo/client';
import { CREAR_NOTA_INGRESO } from '../graphql/mutations/inventario.mutations';
import { GET_NOTAS_INGRESO } from '../graphql/queries/inventario.queries';

const useCrearNotaIngreso = () => {
  const [crearNotaIngreso, { loading, error }] = useMutation(CREAR_NOTA_INGRESO, {
    refetchQueries: [{ query: GET_NOTAS_INGRESO }],
    awaitRefetchQueries: true,
  });

  const crear = async (input) => {
    try {
      const { data } = await crearNotaIngreso({
        variables: {
          createNotaIngresoInput: input,
        },
      });
      return { success: true, data: data.crearNotaIngreso };
    } catch (err) {
      console.error('Error al crear nota de ingreso:', err);
      return { success: false, error: err.message };
    }
  };

  return { crear, loading, error };
};

export default useCrearNotaIngreso;
```

### 📄 src/hooks/useActualizarEstado.js

```javascript
import { useMutation } from '@apollo/client';
import { ACTUALIZAR_ESTADO_NOTA_INGRESO } from '../graphql/mutations/inventario.mutations';
import { GET_NOTAS_INGRESO } from '../graphql/queries/inventario.queries';

const useActualizarEstado = () => {
  const [actualizarEstado, { loading, error }] = useMutation(
    ACTUALIZAR_ESTADO_NOTA_INGRESO,
    {
      refetchQueries: [{ query: GET_NOTAS_INGRESO }],
    }
  );

  const actualizar = async (id, estado) => {
    try {
      const { data } = await actualizarEstado({
        variables: {
          id,
          updateEstadoInput: { estado },
        },
      });
      return { success: true, data: data.actualizarEstadoNotaIngreso };
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      return { success: false, error: err.message };
    }
  };

  return { actualizar, loading, error };
};

export default useActualizarEstado;
```

---

## 8. PÁGINAS COMPLETAS

### 📄 src/pages/InventarioPage.jsx

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotasIngreso from '../hooks/useNotasIngreso';
import NotaIngresoTable from '../components/inventario/NotaIngresoTable';
import InventarioStats from '../components/inventario/InventarioStats';
import ErrorMessage from '../components/common/ErrorMessage';

const InventarioPage = () => {
  const navigate = useNavigate();
  const { notas, loading, error, refetch } = useNotasIngreso();
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const notasFiltradas = filtroEstado === 'todos'
    ? notas
    : notas.filter((n) => n.estado === filtroEstado);

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <div className="inventario-page">
      <div className="page-header">
        <h1>📦 Gestión de Inventario</h1>
        <button
          onClick={() => navigate('/inventario/nuevo')}
          className="btn-primary"
        >
          + Nueva Nota de Ingreso
        </button>
      </div>

      <InventarioStats notas={notas} />

      <div className="page-filters">
        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="procesada">Procesada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div className="filter-actions">
          <button onClick={refetch} className="btn-secondary">
            🔄 Refrescar
          </button>
        </div>
      </div>

      <NotaIngresoTable notas={notasFiltradas} loading={loading} />
    </div>
  );
};

export default InventarioPage;
```

### 📄 src/pages/CrearNotaIngresoPage.jsx

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotaIngresoForm from '../components/inventario/NotaIngresoForm';
import useCrearNotaIngreso from '../hooks/useCrearNotaIngreso';

const CrearNotaIngresoPage = () => {
  const navigate = useNavigate();
  const { crear, loading } = useCrearNotaIngreso();

  const handleSubmit = async (input) => {
    const result = await crear(input);

    if (result.success) {
      alert(`✅ Nota de ingreso creada: ${result.data.numero_nota}`);
      navigate('/inventario');
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  };

  return (
    <div className="crear-nota-page">
      <div className="page-header">
        <h1>Nueva Nota de Ingreso</h1>
      </div>

      <NotaIngresoForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CrearNotaIngresoPage;
```

### 📄 src/pages/DetalleNotaIngresoPage.jsx

```javascript
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_NOTA_INGRESO_BY_ID } from '../graphql/queries/inventario.queries';
import DetalleNotaIngresoTable from '../components/inventario/DetalleNotaIngresoTable';
import EstadoBadge from '../components/inventario/EstadoBadge';
import useActualizarEstado from '../hooks/useActualizarEstado';
import { formatDate, formatCurrency } from '../utils/formatters';

const DetalleNotaIngresoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actualizar, loading: actualizando } = useActualizarEstado();

  const { data, loading, error } = useQuery(GET_NOTA_INGRESO_BY_ID, {
    variables: { id },
  });

  const handleCambiarEstado = async (nuevoEstado) => {
    const confirmacion = window.confirm(
      `¿Está seguro de cambiar el estado a "${nuevoEstado}"?`
    );

    if (confirmacion) {
      const result = await actualizar(id, nuevoEstado);
      if (result.success) {
        alert('✅ Estado actualizado correctamente');
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const nota = data.obtenerNotaIngresoPorId;

  return (
    <div className="detalle-nota-page">
      <div className="page-header">
        <button onClick={() => navigate('/inventario')} className="btn-back">
          ← Volver
        </button>
        <h1>Nota de Ingreso</h1>
      </div>

      <div className="nota-info-card">
        <div className="info-grid">
          <div className="info-item">
            <label>Número:</label>
            <span className="numero-nota">{nota.numero_nota}</span>
          </div>

          <div className="info-item">
            <label>Estado:</label>
            <EstadoBadge estado={nota.estado} />
          </div>

          <div className="info-item">
            <label>Proveedor:</label>
            <span>{nota.proveedor}</span>
          </div>

          <div className="info-item">
            <label>Usuario:</label>
            <span>{nota.usuario.nombre}</span>
          </div>

          <div className="info-item">
            <label>Fecha Creación:</label>
            <span>{formatDate(nota.fecha_creacion)}</span>
          </div>

          <div className="info-item">
            <label>Total:</label>
            <span className="total">{formatCurrency(nota.total)}</span>
          </div>
        </div>

        {nota.observaciones && (
          <div className="observaciones-section">
            <label>Observaciones:</label>
            <p>{nota.observaciones}</p>
          </div>
        )}
      </div>

      <div className="detalles-section">
        <h2>Productos</h2>
        <DetalleNotaIngresoTable detalles={nota.detalles} />
      </div>

      {nota.estado === 'pendiente' && (
        <div className="acciones-estado">
          <h3>Cambiar Estado</h3>
          <div className="btn-group">
            <button
              onClick={() => handleCambiarEstado('procesada')}
              disabled={actualizando}
              className="btn-success"
            >
              ✅ Procesar
            </button>
            <button
              onClick={() => handleCambiarEstado('cancelada')}
              disabled={actualizando}
              className="btn-danger"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleNotaIngresoPage;
```

---

## 9. UTILIDADES

### 📄 src/utils/formatters.js

```javascript
// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Formatear fecha
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Formatear fecha corta
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
```

---

## 10. ESTILOS CSS

### 📄 src/styles/inventario.css

```css
/* Página Principal */
.inventario-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1a202c;
}

/* Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3182ce;
}

.stat-card.warning { border-left-color: #ed8936; }
.stat-card.success { border-left-color: #48bb78; }
.stat-card.danger { border-left-color: #f56565; }
.stat-card.primary { border-left-color: #3182ce; }

.stat-icon {
  font-size: 2rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a202c;
}

/* Filtros */
.page-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
}

/* Tabla */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabla-notas-ingreso {
  width: 100%;
  border-collapse: collapse;
}

.tabla-notas-ingreso thead {
  background: #2d3748;
  color: white;
}

.tabla-notas-ingreso th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.tabla-notas-ingreso td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.tabla-notas-ingreso tbody tr:hover {
  background: #f7fafc;
}

.numero-nota {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #2d3748;
}

.total {
  font-weight: bold;
  color: #2c5282;
}

/* Badges */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-warning {
  background: #fef5e7;
  color: #d68910;
}

.badge-success {
  background: #e6fffa;
  color: #047857;
}

.badge-danger {
  background: #fee;
  color: #c53030;
}

/* Formulario */
.nota-ingreso-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.flex-2 { grid-column: span 2; }
.flex-3 { grid-column: span 3; }

/* Detalles */
.detalle-item {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  position: relative;
}

.detalle-numero {
  position: absolute;
  top: 1rem;
  left: -2rem;
  background: #3182ce;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Botones */
.btn-primary {
  background: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2c5282;
}

.btn-primary:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-success {
  background: #48bb78;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background: #f56565;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-eliminar {
  background: #fc8181;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Total */
.form-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #edf2f7;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.total-label {
  font-size: 1.25rem;
  font-weight: 600;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c5282;
}

/* Acciones */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .flex-2, .flex-3 {
    grid-column: span 1;
  }
}
```

---

## 11. PERMISOS Y ROLES

### 📄 Protección de Rutas

```javascript
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.rolNombre !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### Uso en App.js:

```javascript
<Route
  path="/inventario"
  element={
    <ProtectedRoute requiredRole="admin">
      <InventarioPage />
    </ProtectedRoute>
  }
/>
```

---

## 12. RESUMEN EJECUTIVO

### ✅ Checklist de Implementación

**1. Instalación:**
- [ ] `npm install @apollo/client graphql`
- [ ] `npm install react-router-dom`

**2. Configuración:**
- [ ] Crear `apolloClient.js`
- [ ] Configurar `ApolloProvider` en `App.js`

**3. GraphQL:**
- [ ] Crear `queries/inventario.queries.js`
- [ ] Crear `mutations/inventario.mutations.js`

**4. Hooks:**
- [ ] `useNotasIngreso.js`
- [ ] `useCrearNotaIngreso.js`
- [ ] `useActualizarEstado.js`

**5. Componentes:**
- [ ] `NotaIngresoTable.jsx`
- [ ] `NotaIngresoForm.jsx`
- [ ] `DetalleNotaIngresoTable.jsx`
- [ ] `EstadoBadge.jsx`
- [ ] `InventarioStats.jsx`

**6. Páginas:**
- [ ] `InventarioPage.jsx`
- [ ] `CrearNotaIngresoPage.jsx`
- [ ] `DetalleNotaIngresoPage.jsx`

**7. Utilidades:**
- [ ] `formatters.js`
- [ ] `validators.js`

**8. Estilos:**
- [ ] `inventario.css`

**9. Rutas:**
- [ ] Configurar rutas en `App.js`
- [ ] Protección de rutas por rol

---

**¿Necesitas algún componente específico o tienes dudas sobre alguna parte?** 🚀
