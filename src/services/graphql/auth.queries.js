import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        nombre
        email
        rol
        createdAt
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        nombre
        email
        rol
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      nombre
      email
      rol
      createdAt
    }
  }
`;

export const ACTUALIZAR_PERFIL = gql`
  mutation ActualizarPerfil($input: ActualizarPerfilInput!) {
    actualizarPerfil(input: $input) {
      id
      nombre
      email
    }
  }
`;
