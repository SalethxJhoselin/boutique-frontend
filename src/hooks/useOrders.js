import { useQuery, useMutation } from '@apollo/client';
import {
  CREAR_ORDEN,
  MIS_ORDENES,
  OBTENER_ORDEN,
  ACTUALIZAR_ORDEN,
} from '../services/graphql/orders.queries';

export const useMisOrdenes = () => {
  const { data, loading, error, refetch } = useQuery(MIS_ORDENES);
  const [crearOrdenMutation] = useMutation(CREAR_ORDEN);
  const [actualizarOrdenMutation] = useMutation(ACTUALIZAR_ORDEN);

  const crearOrden = async (items) => {
    const result = await crearOrdenMutation({
      variables: { input: { items } },
    });
    refetch();
    return result.data.crearOrden;
  };

  const actualizarOrden = async (id, estado, numeroSeguimiento) => {
    const result = await actualizarOrdenMutation({
      variables: {
        id,
        input: { estado, numeroSeguimiento },
      },
    });
    refetch();
    return result.data.actualizarOrden;
  };

  return {
    ordenes: data?.misOrdenes || [],
    loading,
    error,
    refetch,
    crearOrden,
    actualizarOrden,
  };
};

export const useOrden = (id) => {
  const { data, loading, error } = useQuery(OBTENER_ORDEN, {
    variables: { id },
    skip: !id,
  });

  return {
    orden: data?.orden,
    loading,
    error,
  };
};
