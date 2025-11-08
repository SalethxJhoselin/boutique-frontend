import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from '../services/graphql/products.queries';

export const useProducts = () => {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
  const [createProductMutation] = useMutation(CREATE_PRODUCT);
  const [updateProductMutation] = useMutation(UPDATE_PRODUCT);
  const [deleteProductMutation] = useMutation(DELETE_PRODUCT);

  const createProduct = async (input) => {
    const result = await createProductMutation({ variables: { input } });
    refetch();
    return result.data.createProduct;
  };

  const updateProduct = async (id, input) => {
    const result = await updateProductMutation({ variables: { id, input } });
    refetch();
    return result.data.updateProduct;
  };

  const deleteProduct = async (id) => {
    await deleteProductMutation({ variables: { id } });
    refetch();
  };

  return {
    products: data?.getProducts || [],
    loading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export const useProduct = (id) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  return {
    product: data?.getProduct,
    loading,
    error,
  };
};
