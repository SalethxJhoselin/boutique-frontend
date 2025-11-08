import { useQuery, useMutation } from '@apollo/client';
import {
  NOTAS_INGRESO,
  NOTA_INGRESO,
  NOTAS_INGRESO_POR_PROVEEDOR,
  CREAR_NOTA_INGRESO,
  ACTUALIZAR_ESTADO_NOTA_INGRESO,
  ELIMINAR_NOTA_INGRESO,
} from '../services/graphql/notasIngreso.queries';

export const useNotasIngreso = () => {
  const { data, loading, error, refetch } = useQuery(NOTAS_INGRESO);

  const [crearNotaIngresoMutation] = useMutation(CREAR_NOTA_INGRESO);
  const [actualizarEstadoMutation] = useMutation(ACTUALIZAR_ESTADO_NOTA_INGRESO);
  const [eliminarNotaIngresoMutation] = useMutation(ELIMINAR_NOTA_INGRESO);

  const crearNotaIngreso = async (proveedor, observaciones, detalles) => {
    // Convertir camelCase a snake_case para el backend
    const detallesBackend = detalles.map(detalle => ({
      productoId: detalle.productoId,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precioUnitario || detalle.precio_unitario,
    }));

    const result = await crearNotaIngresoMutation({
      variables: {
        input: {
          proveedor,
          observaciones,
          detalles: detallesBackend,
        },
      },
    });
    refetch();
    return result.data.crearNotaIngreso;
  };

  const actualizarEstado = async (id, estado) => {
    const result = await actualizarEstadoMutation({
      variables: {
        id,
        input: { estado },
      },
    });
    refetch();
    return result.data.actualizarEstadoNotaIngreso;
  };

  const eliminarNotaIngreso = async (id) => {
    await eliminarNotaIngresoMutation({
      variables: { id },
    });
    refetch();
    return true;
  };

  return {
    notasIngreso: data?.obtenerNotasIngreso || [],
    loading,
    error,
    refetch,
    crearNotaIngreso,
    actualizarEstado,
    eliminarNotaIngreso,
  };
};

export const useNotaIngreso = (id) => {
  const { data, loading, error } = useQuery(NOTA_INGRESO, {
    variables: { id },
    skip: !id,
  });

  return {
    notaIngreso: data?.obtenerNotaIngresoPorId,
    loading,
    error,
  };
};

export const useNotasIngresoPorProveedor = (proveedor) => {
  const { data, loading, error } = useQuery(NOTAS_INGRESO_POR_PROVEEDOR, {
    variables: { proveedor },
    skip: !proveedor,
  });

  return {
    notasIngreso: data?.notasIngresoPorProveedor || [],
    loading,
    error,
  };
};
