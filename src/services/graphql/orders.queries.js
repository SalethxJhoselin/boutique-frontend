import { gql } from '@apollo/client';

export const CREAR_ORDEN = gql`
  mutation CrearOrden($input: CrearOrdenInput!) {
    crearOrden(input: $input) {
      id
      subtotal
      impuestos
      envio
      total
      estado
      createdAt
      items {
        id
        cantidad
        precioUnitario
        subtotal
        product {
          id
          nombre
          precio
        }
      }
    }
  }
`;

export const MIS_ORDENES = gql`
  query MisOrdenes {
    misOrdenes {
      id
      subtotal
      impuestos
      envio
      total
      estado
      numeroSeguimiento
      createdAt
      items {
        cantidad
        precioUnitario
        subtotal
        product {
          nombre
          precio
        }
      }
    }
  }
`;

export const OBTENER_ORDEN = gql`
  query ObtenerOrden($id: String!) {
    orden(id: $id) {
      id
      subtotal
      impuestos
      envio
      total
      estado
      numeroSeguimiento
      createdAt
      user {
        nombre
        email
      }
      items {
        cantidad
        precioUnitario
        subtotal
        product {
          nombre
          precio
        }
      }
    }
  }
`;

export const ACTUALIZAR_ORDEN = gql`
  mutation ActualizarOrden($id: String!, $input: ActualizarOrdenInput!) {
    actualizarOrden(id: $id, input: $input) {
      id
      estado
      numeroSeguimiento
    }
  }
`;
