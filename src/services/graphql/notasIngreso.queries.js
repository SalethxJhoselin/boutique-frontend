import { gql } from '@apollo/client';

// ============================================
// QUERIES
// ============================================

export const NOTAS_INGRESO = gql`
  query NotasIngreso {
    obtenerNotasIngreso {
      id
      numero_nota
      proveedor
      total
      estado
      observaciones
      fecha_creacion
      fecha_actualizacion
      detalles {
        id
        cantidad
        precio_unitario
        subtotal
        producto {
          id
          nombre
          precio
        }
      }
    }
  }
`;export const NOTA_INGRESO = gql`
  query NotaIngreso($id: ID!) {
    obtenerNotaIngresoPorId(id: $id) {
      id
      numero_nota
      proveedor
      total
      estado
      observaciones
      fecha_creacion
      fecha_actualizacion
      detalles {
        id
        cantidad
        precio_unitario
        subtotal
        producto {
          id
          nombre
          precio
          stock
        }
      }
    }
  }
`;

export const NOTAS_INGRESO_POR_PROVEEDOR = gql`
  query NotasIngresoPorProveedor($proveedor: String!) {
    notasIngresoPorProveedor(proveedor: $proveedor) {
      id
      numero_nota
      proveedor
      total
      estado
      fecha_creacion
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const CREAR_NOTA_INGRESO = gql`
  mutation CrearNotaIngreso($input: CreateNotaIngresoInput!) {
    crearNotaIngreso(createNotaIngresoInput: $input) {
      id
      numero_nota
      proveedor
      total
      estado
      observaciones
      detalles {
        id
        cantidad
        precio_unitario
        subtotal
        producto {
          id
          nombre
        }
      }
    }
  }
`;

export const ACTUALIZAR_ESTADO_NOTA_INGRESO = gql`
  mutation ActualizarEstadoNotaIngreso($id: ID!, $input: UpdateEstadoNotaIngresoInput!) {
    actualizarEstadoNotaIngreso(id: $id, updateEstadoInput: $input) {
      id
      numero_nota
      estado
      observaciones
    }
  }
`;

export const ELIMINAR_NOTA_INGRESO = gql`
  mutation EliminarNotaIngreso($id: ID!) {
    eliminarNotaIngreso(id: $id)
  }
`;
