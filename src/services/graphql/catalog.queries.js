import { gql } from '@apollo/client';

// ==================== CATEGORÍAS ====================
export const GET_CATEGORIAS = gql`
  query GetCategorias {
    getCategorias {
      id
      nombre
      descripcion
    }
  }
`;

export const CREATE_CATEGORIA = gql`
  mutation CreateCategoria($input: CreateCategoriaInput!) {
    crearCategoria(input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

export const UPDATE_CATEGORIA = gql`
  mutation UpdateCategoria($id: String!, $input: UpdateCategoriaInput!) {
    actualizarCategoria(id: $id, input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

export const DELETE_CATEGORIA = gql`
  mutation DeleteCategoria($id: String!) {
    eliminarCategoria(id: $id)
  }
`;

// ==================== MARCAS ====================
export const GET_MARCAS = gql`
  query GetMarcas {
    getMarcas {
      id
      nombre
      descripcion
    }
  }
`;

export const CREATE_MARCA = gql`
  mutation CreateMarca($input: CreateMarcaInput!) {
    crearMarca(input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

export const UPDATE_MARCA = gql`
  mutation UpdateMarca($id: String!, $input: UpdateMarcaInput!) {
    actualizarMarca(id: $id, input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

export const DELETE_MARCA = gql`
  mutation DeleteMarca($id: String!) {
    eliminarMarca(id: $id)
  }
`;

// ==================== COLORES ====================
export const GET_COLORES = gql`
  query GetColores {
    getColores {
      id
      nombre
      codigoHex
    }
  }
`;

export const CREATE_COLOR = gql`
  mutation CreateColor($input: CreateColorInput!) {
    crearColor(input: $input) {
      id
      nombre
      codigoHex
    }
  }
`;

export const UPDATE_COLOR = gql`
  mutation UpdateColor($id: String!, $input: UpdateColorInput!) {
    actualizarColor(id: $id, input: $input) {
      id
      nombre
      codigoHex
    }
  }
`;

export const DELETE_COLOR = gql`
  mutation DeleteColor($id: String!) {
    eliminarColor(id: $id)
  }
`;

// ==================== TALLAS ====================
export const GET_TALLAS = gql`
  query GetTallas {
    getTallas {
      id
      nombre
      medida
    }
  }
`;

export const CREATE_TALLA = gql`
  mutation CreateTalla($input: CreateTallaInput!) {
    crearTalla(input: $input) {
      id
      nombre
      medida
    }
  }
`;

export const UPDATE_TALLA = gql`
  mutation UpdateTalla($id: String!, $input: UpdateTallaInput!) {
    actualizarTalla(id: $id, input: $input) {
      id
      nombre
      medida
    }
  }
`;

export const DELETE_TALLA = gql`
  mutation DeleteTalla($id: String!) {
    eliminarTalla(id: $id)
  }
`;

// ==================== DESCUENTOS ====================
export const GET_DESCUENTOS = gql`
  query GetDescuentos {
    getDescuentos {
      id
      nombre
      porcentaje
      fechaInicio
      fechaFin
      activo
    }
  }
`;

export const CREATE_DESCUENTO = gql`
  mutation CreateDescuento($input: CreateDescuentoInput!) {
    crearDescuento(input: $input) {
      id
      nombre
      porcentaje
      fechaInicio
      fechaFin
      activo
    }
  }
`;

export const UPDATE_DESCUENTO = gql`
  mutation UpdateDescuento($id: String!, $input: UpdateDescuentoInput!) {
    actualizarDescuento(id: $id, input: $input) {
      id
      nombre
      porcentaje
      fechaInicio
      fechaFin
      activo
    }
  }
`;

export const DELETE_DESCUENTO = gql`
  mutation DeleteDescuento($id: String!) {
    eliminarDescuento(id: $id)
  }
`;

// ==================== CATEGORÍAS DE COLORES ====================
export const GET_CATEGORIAS_COLORES = gql`
  query GetCategoriasColores {
    getCategoriasColores {
      id
      nombre
      descripcion
    }
  }
`;

export const CREATE_CATEGORIA_COLOR = gql`
  mutation CreateCategoriaColor($input: CreateCategoriaColorInput!) {
    crearCategoriaColor(input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

export const UPDATE_CATEGORIA_COLOR = gql`
  mutation UpdateCategoriaColor($id: String!, $input: UpdateCategoriaColorInput!) {
    actualizarCategoriaColor(id: $id, input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

export const DELETE_CATEGORIA_COLOR = gql`
  mutation DeleteCategoriaColor($id: String!) {
    eliminarCategoriaColor(id: $id)
  }
`;
