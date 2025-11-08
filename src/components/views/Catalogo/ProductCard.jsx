import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth'; 
import { useCart } from '../../../context/CartContext';
import { useBusquedas } from '../../../hooks/useBusquedas';

const ProductCard = ({ product, onSelect }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { crearBusqueda } = useBusquedas(user?.id);

  // Función para manejar el cambio en el input, asegurando solo números
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) > 0) {
      setQuantity(value);
    }
  };

  // Función para registrar la búsqueda con GraphQL
  const registerSearch = async (productId, productName) => {
    if (!user?.id) {
      console.warn("⚠️ Usuario no autenticado, no se registrará la búsqueda.");
      return;
    }
    try {
      await crearBusqueda(productId, productName);
      console.log("✅ Búsqueda registrada:", productName);
    } catch (error) {
      console.error("❌ Error al registrar búsqueda:", error);
    }
  };

  const handleViewDetails = () => {
    registerSearch(product.id, product.name);
    onSelect(product);
  };

  const handleAddToCart = () => {
    addToCart(product, Number(quantity));
    console.log(`Producto: ${product.name}, Cantidad: ${quantity}`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
      <h3 className="text-xl font-semibold">{product.name}</h3>

      {product.discount && <p className="text-red-500">{product.discount}</p>}
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      {product.price !== product.originalPrice && (
        <p className="line-through text-gray-400">${product.originalPrice.toFixed(2)}</p>
      )}

      <p className="text-gray-500">Talla: {product.size}</p>
      <p className="text-gray-500">Marca: {product.brand}</p>
      <p className="text-gray-500">Color: {product.color}</p>

      {product.inventory > 0 ? (
        <p className="text-green-500">En stock: {product.inventory}</p>
      ) : (
        <p className="text-red-500">Agotado</p>
      )}

      <button
        className="bg-blue text-white py-2 px-4 rounded mt-4 mr-4"
        onClick={handleViewDetails} // Usar la nueva función
      >
        Ver Detalles
      </button>

      <div className="mt-4 flex items-center">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 p-2 border rounded mr-4"
        />
        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          onClick={handleAddToCart}
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;