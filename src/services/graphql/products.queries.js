import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      nombre
      descripcion
      precio
      stock
      popularidad
      imagen_url
      activo
      fecha_agregado
      createdAt
      categoriaRelacion {
        id
        nombre
      }
      marca {
        id
        nombre
      }
      descuento {
        id
        nombre
        porcentaje
      }
      colores {
        id
        nombre
        codigoHex
      }
      tallas {
        id
        nombre
        medida
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    getProduct(id: $id) {
      id
      nombre
      descripcion
      precio
      stock
      popularidad
      imagen_url
      activo
      fecha_agregado
      createdAt
      categoriaRelacion {
        id
        nombre
      }
      marca {
        id
        nombre
      }
      descuento {
        id
        nombre
        porcentaje
      }
      colores {
        id
        nombre
        codigoHex
      }
      tallas {
        id
        nombre
        medida
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      nombre
      descripcion
      precio
      stock
      popularidad
      imagen_url
      activo
      categoriaRelacion {
        id
        nombre
      }
      marca {
        id
        nombre
      }
      colores {
        id
        nombre
      }
      tallas {
        id
        nombre
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      nombre
      descripcion
      precio
      stock
      popularidad
      imagen_url
      activo
      categoriaRelacion {
        id
        nombre
      }
      marca {
        id
        nombre
      }
      descuento {
        id
        nombre
        porcentaje
      }
      colores {
        id
        nombre
      }
      tallas {
        id
        nombre
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;
