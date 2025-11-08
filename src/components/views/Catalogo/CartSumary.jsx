import React, { useState } from 'react';
import { useCarrito } from '../../../hooks/useCarrito';
import { useAuth } from '../../../hooks/useAuth';
import CartModal from './CartModal';
import { FaShoppingCart } from 'react-icons/fa';
import { Badge } from 'antd';

const CartSummary = () => {
  const { user } = useAuth();
  const { carrito } = useCarrito(user?.id);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  const totalItems = carrito?.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;

  return (
    <div>
      <Badge count={totalItems} offset={[0, 0]}>
        <p onClick={toggleModal} className="cursor-pointer text-2xl">
          <FaShoppingCart />
        </p>
      </Badge>

      {isModalOpen && <CartModal onClose={toggleModal} />}
    </div>
  );
};

export default CartSummary;
