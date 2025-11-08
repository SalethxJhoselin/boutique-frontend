import { useState } from 'react';
import ProductDetail from '../views/Catalogo/ProductDetail';
import ProductList from '../views/Catalogo/ProductList';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { Spin } from 'antd';

const Catalog = () => {
  const { userId, isLoggedIn } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // GraphQL Hook - DATOS REALES DEL BACKEND
  const { products: productosBackend, loading, error } = useProducts();

  // Mapear productos del backend al formato esperado por ProductList
  const products = productosBackend.map(item => ({
    id: item.id,
    name: item.nombre,
    price: parseFloat(item.precio),
    originalPrice: parseFloat(item.precio),
    image: item.imagen_url || 'https://via.placeholder.com/300?text=Sin+Imagen',
    description: item.descripcion || 'Sin descripción',
    category: item.categoriaRelacion?.nombre || 'Sin categoría',
    brand: item.marca?.nombre || 'Sin marca',
    colors: item.colores?.map(c => c.nombre) || [],
    sizes: item.tallas?.map(t => t.nombre) || [],
    stock: item.stock,
    dateAdded: item.fecha_agregado,
    // Información adicional para ProductDetail
    discount: item.descuento,
    popularidad: item.popularidad,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
        <p className="ml-4 text-lg">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg">Error al cargar productos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {isLoggedIn && userId 
          ? "Catálogo de Productos" 
          : "Catálogo de Productos"}
      </h1>

      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No hay productos disponibles</p>
            <p className="text-gray-400 text-sm mt-2">Los productos aparecerán aquí cuando estén disponibles</p>
          </div>
        </div>
      ) : (
        <>
          {/* Lista de productos */}
          <ProductList products={products} onSelect={setSelectedProduct} />

          {/* Detalle del producto seleccionado */}
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Catalog;