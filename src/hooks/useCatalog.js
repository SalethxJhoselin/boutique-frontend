import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CATEGORIAS,
  CREATE_CATEGORIA,
  UPDATE_CATEGORIA,
  DELETE_CATEGORIA,
  GET_MARCAS,
  CREATE_MARCA,
  UPDATE_MARCA,
  DELETE_MARCA,
  GET_COLORES,
  CREATE_COLOR,
  UPDATE_COLOR,
  DELETE_COLOR,
  GET_TALLAS,
  CREATE_TALLA,
  UPDATE_TALLA,
  DELETE_TALLA,
  GET_DESCUENTOS,
  CREATE_DESCUENTO,
  UPDATE_DESCUENTO,
  DELETE_DESCUENTO,
  GET_CATEGORIAS_COLORES,
  CREATE_CATEGORIA_COLOR,
  UPDATE_CATEGORIA_COLOR,
  DELETE_CATEGORIA_COLOR,
} from '../services/graphql/catalog.queries';

// ==================== CATEGORÍAS ====================
export const useCategorias = () => {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIAS);
  const [createMutation] = useMutation(CREATE_CATEGORIA);
  const [updateMutation] = useMutation(UPDATE_CATEGORIA);
  const [deleteMutation] = useMutation(DELETE_CATEGORIA);

  const crear = async (input) => {
    const result = await createMutation({ variables: { input } });
    refetch();
    return result.data.crearCategoria;
  };

  const actualizar = async (id, input) => {
    const result = await updateMutation({ variables: { id, input } });
    refetch();
    return result.data.actualizarCategoria;
  };

  const eliminar = async (id) => {
    await deleteMutation({ variables: { id } });
    refetch();
  };

  return {
    categorias: data?.getCategorias || [],
    loading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
  };
};

// ==================== MARCAS ====================
export const useMarcas = () => {
  const { data, loading, error, refetch } = useQuery(GET_MARCAS);
  const [createMutation] = useMutation(CREATE_MARCA);
  const [updateMutation] = useMutation(UPDATE_MARCA);
  const [deleteMutation] = useMutation(DELETE_MARCA);

  const crear = async (input) => {
    const result = await createMutation({ variables: { input } });
    refetch();
    return result.data.crearMarca;
  };

  const actualizar = async (id, input) => {
    const result = await updateMutation({ variables: { id, input } });
    refetch();
    return result.data.actualizarMarca;
  };

  const eliminar = async (id) => {
    await deleteMutation({ variables: { id } });
    refetch();
  };

  return {
    marcas: data?.getMarcas || [],
    loading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
  };
};

// ==================== COLORES ====================
export const useColores = () => {
  const { data, loading, error, refetch } = useQuery(GET_COLORES);
  const [createMutation] = useMutation(CREATE_COLOR);
  const [updateMutation] = useMutation(UPDATE_COLOR);
  const [deleteMutation] = useMutation(DELETE_COLOR);

  const crear = async (input) => {
    const result = await createMutation({ variables: { input } });
    refetch();
    return result.data.crearColor;
  };

  const actualizar = async (id, input) => {
    const result = await updateMutation({ variables: { id, input } });
    refetch();
    return result.data.actualizarColor;
  };

  const eliminar = async (id) => {
    await deleteMutation({ variables: { id } });
    refetch();
  };

  return {
    colores: data?.getColores || [],
    loading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
  };
};

// ==================== TALLAS ====================
export const useTallas = () => {
  const { data, loading, error, refetch } = useQuery(GET_TALLAS);
  const [createMutation] = useMutation(CREATE_TALLA);
  const [updateMutation] = useMutation(UPDATE_TALLA);
  const [deleteMutation] = useMutation(DELETE_TALLA);

  const crear = async (input) => {
    const result = await createMutation({ variables: { input } });
    refetch();
    return result.data.crearTalla;
  };

  const actualizar = async (id, input) => {
    const result = await updateMutation({ variables: { id, input } });
    refetch();
    return result.data.actualizarTalla;
  };

  const eliminar = async (id) => {
    await deleteMutation({ variables: { id } });
    refetch();
  };

  return {
    tallas: data?.getTallas || [],
    loading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
  };
};

// ==================== DESCUENTOS ====================
export const useDescuentos = () => {
  const { data, loading, error, refetch } = useQuery(GET_DESCUENTOS);
  const [createMutation] = useMutation(CREATE_DESCUENTO);
  const [updateMutation] = useMutation(UPDATE_DESCUENTO);
  const [deleteMutation] = useMutation(DELETE_DESCUENTO);

  const crear = async (input) => {
    const result = await createMutation({ variables: { input } });
    refetch();
    return result.data.crearDescuento;
  };

  const actualizar = async (id, input) => {
    const result = await updateMutation({ variables: { id, input } });
    refetch();
    return result.data.actualizarDescuento;
  };

  const eliminar = async (id) => {
    await deleteMutation({ variables: { id } });
    refetch();
  };

  return {
    descuentos: data?.getDescuentos || [],
    loading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
  };
};

// ==================== CATEGORÍAS DE COLORES ====================
export const useCategoriasColores = () => {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIAS_COLORES);
  const [createMutation] = useMutation(CREATE_CATEGORIA_COLOR);
  const [updateMutation] = useMutation(UPDATE_CATEGORIA_COLOR);
  const [deleteMutation] = useMutation(DELETE_CATEGORIA_COLOR);

  const crear = async (input) => {
    const result = await createMutation({ variables: { input } });
    refetch();
    return result.data.crearCategoriaColor;
  };

  const actualizar = async (id, input) => {
    const result = await updateMutation({ variables: { id, input } });
    refetch();
    return result.data.actualizarCategoriaColor;
  };

  const eliminar = async (id) => {
    await deleteMutation({ variables: { id } });
    refetch();
  };

  return {
    categoriasColores: data?.getCategoriasColores || [],
    loading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
  };
};
