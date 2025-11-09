import { gql } from '@apollo/client';

// ============================================
// QUERIES
// ============================================

export const NOTAS_VENTA = gql`
  query NotasVenta {
    notasVenta {
      id
      numero
      total
      estado
      observaciones
      createdAt
      updatedAt
      usuario {
        id
        nombre
        email
      }
      detalles {
        id
        cantidad
        precioUnitario
        subtotal
        producto {
          id
          nombre
          precio
        }
      }
    }
  }
`;

export const NOTA_VENTA = gql`
  query NotaVenta($id: ID!) {
    notaVenta(id: $id) {
      id
      numero
      total
      estadoS
      observaciones
      createdAt
      updatedAt
      usuario {
        id
        nombre
        email
      }
      orden {
        id
        total
      }
      detalles {
        id
        cantidad
        precioUnitario
        subtotal
        producto {
          id
          nombre
          precio
          imagen_url
        }
      }
    }
  }
`;

export const MIS_NOTAS_VENTA = gql`
  query MisNotasVenta($usuarioId: ID!) {
    misNotasVenta(usuarioId: $usuarioId) {
      id
      numero
      total
      estado
      observaciones
      createdAt
      detalles {
        id
        cantidad
        precioUnitario
        subtotal
        producto {
          id
          nombre
          imagen_url
        }
      }
    }
  }
`;

export const ESTADISTICAS_VENTAS = gql`
  query EstadisticasVentas {
    estadisticasVentas {
      totalVentas
      ventasProcesadas
      ventasPendientes
      ventasCanceladas
      montoTotal
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const CREAR_NOTA_VENTA = gql`
  mutation CrearNotaVenta($input: CreateNotaVentaInput!) {
    crearNotaVenta(input: $input) {
      id
      numero
      total
      estado
      observaciones
      createdAt
      detalles {
        id
        cantidad
        precioUnitario
        subtotal
        producto {
          id
          nombre
        }
      }
    }
  }
`;

export const ACTUALIZAR_ESTADO_NOTA_VENTA = gql`
  mutation ActualizarEstadoNotaVenta($id: ID!, $input: UpdateNotaVentaInput!) {
    actualizarEstadoNotaVenta(id: $id, input: $input) {
      id
      estado
      observaciones
    }
  }
`;

export const PROCESAR_NOTA_VENTA = gql`
  mutation ProcesarNotaVenta($id: ID!) {
    procesarNotaVenta(id: $id) {
      id
      numero
      estado
      updatedAt
    }
  }
`;

export const CANCELAR_NOTA_VENTA = gql`
  mutation CancelarNotaVenta($id: ID!) {
    cancelarNotaVenta(id: $id) {
      id
      estado
    }
  }
`;

export const ELIMINAR_NOTA_VENTA = gql`
  mutation EliminarNotaVenta($id: ID!) {
    eliminarNotaVenta(id: $id)
  }
`;
