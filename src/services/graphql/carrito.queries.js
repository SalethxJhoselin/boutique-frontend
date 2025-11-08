import { gql } from '@apollo/client';

// ============================================
// QUERIES
// ============================================

export const MI_CARRITO = gql`
  query MiCarrito($usuarioId: ID!) {
    miCarrito(usuarioId: $usuarioId) {
      id
      subtotal
      descuento
      total
      codigoDescuento
      createdAt
      updatedAt
      items {
        id
        cantidad
        precioUnitario
        subtotal
        producto {
          id
          nombre
          precio
          imagen_url
          stock
        }
      }
    }
  }
`;

export const CARRITO = gql`
  query Carrito($id: ID!) {
    carrito(id: $id) {
      id
      subtotal
      descuento
      total
      codigoDescuento
      items {
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

export const CONTAR_ITEMS_CARRITO = gql`
  query ContarItemsCarrito($usuarioId: ID!) {
    contarItemsCarrito(usuarioId: $usuarioId)
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const AGREGAR_AL_CARRITO = gql`
  mutation AgregarAlCarrito($input: AddToCartInput!) {
    agregarAlCarrito(input: $input) {
      id
      subtotal
      total
      items {
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

export const ACTUALIZAR_CANTIDAD_CARRITO = gql`
  mutation ActualizarCantidadCarrito($input: UpdateCartItemInput!) {
    actualizarCantidadCarrito(input: $input) {
      id
      subtotal
      descuento
      total
      items {
        id
        cantidad
        subtotal
      }
    }
  }
`;

export const ELIMINAR_DEL_CARRITO = gql`
  mutation EliminarDelCarrito($input: RemoveFromCartInput!) {
    eliminarDelCarrito(input: $input) {
      id
      subtotal
      descuento
      total
      items {
        id
      }
    }
  }
`;

export const LIMPIAR_CARRITO = gql`
  mutation LimpiarCarrito($usuarioId: ID!) {
    limpiarCarrito(usuarioId: $usuarioId) {
      id
      subtotal
      total
      items {
        id
      }
    }
  }
`;

export const APLICAR_DESCUENTO_CARRITO = gql`
  mutation AplicarDescuentoCarrito($input: ApplyDiscountInput!) {
    aplicarDescuentoCarrito(input: $input) {
      id
      subtotal
      descuento
      total
      codigoDescuento
    }
  }
`;

export const REMOVER_DESCUENTO_CARRITO = gql`
  mutation RemoverDescuentoCarrito($carritoId: ID!) {
    removerDescuentoCarrito(carritoId: $carritoId) {
      id
      subtotal
      descuento
      total
      codigoDescuento
    }
  }
`;
