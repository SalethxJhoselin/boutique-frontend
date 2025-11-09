import { gql } from '@apollo/client';

// ============================================
// QUERIES
// ============================================

export const MIS_BUSQUEDAS = gql`
  query MisBusquedas($usuarioId: ID!) {
    misBusquedas(usuarioId: $usuarioId) {
      id
      terminoBusqueda
      createdAt
      producto {
        id
        nombre
        precio
        imagen_url
      }
    }
  }
`;

export const PRODUCTOS_POPULARES = gql`
  query ProductosPopulares($limite: Int) {
    productosPopulares(limite: $limite) {
      id
      nombre
      precio
      imagen_url
      stock
    }
  }
`;

export const HISTORIAL_BUSQUEDAS = gql`
  query HistorialBusquedas($usuarioId: ID!, $limite: Int) {
    historialBusquedas(usuarioId: $usuarioId, limite: $limite) {
      id
      terminoBusqueda
      createdAt
      producto {
        id
        nombre
      }
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const CREAR_BUSQUEDA = gql`
  mutation CrearBusqueda($input: CreateBusquedaInput!) {
    crearBusqueda(input: $input) {
      id
      terminoBusqueda
      createdAt
    }
  }
`;
