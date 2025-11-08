import jsPDF from 'jspdf'; // Importa la librería para generar PDFs
import 'jspdf-autotable'; // Plugin para tablas en jsPDF
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; // Para obtener el userId
import { useCart } from '../../../context/CartContext';
import { useMisOrdenes } from '../../../hooks/useOrders';

const CartModal = ({ onClose }) => {
    const { cart, clearCart } = useCart(); 
    const { userId } = useAuth(); 
    const { crearOrden } = useMisOrdenes(); 
    const navigate = useNavigate();

    const handlePurchase = async () => {
        if (cart.length === 0) {
            console.warn("El carrito está vacío. No se puede realizar la compra.");
            return;
        }

        
        const items = cart.map(product => ({
            productId: product.id,
            cantidad: product.quantity,
            precioUnitario: product.price,
        }));

        try {
            
            const orden = await crearOrden(items);
            
            console.log("✅ Orden creada exitosamente:", orden);

            // Generar el PDF con los detalles de la orden
            generatePDF(orden);

            
            const stripeURL = "https://buy.stripe.com/test_9AQbKF5h9gaO1Qk5ko";
            window.open(stripeURL, '_blank');

            // Redirige a una página de recibo de compra
            navigate('/purchase-receipt');

            // Limpia el carrito después de la compra
            clearCart();
        } catch (error) {
            console.error("❌ Error al crear la orden:", error);
            alert("Error al procesar la compra. Por favor intenta de nuevo.");
        }
    };

    const generatePDF = (orden) => {
        const doc = new jsPDF();

        // Título del documento
        doc.setFontSize(18);
        doc.text('Recibo de Compra', 105, 15, { align: 'center' });

        // Información de la orden
        doc.setFontSize(12);
        doc.text(`Orden ID: ${orden.id}`, 10, 30);
        doc.text(`Fecha: ${new Date(orden.createdAt).toLocaleDateString()}`, 10, 40);
        doc.text(`Estado: ${orden.estado}`, 10, 50);

        // Tabla con detalles de los productos
        const tableColumn = ['Producto', 'Cantidad', 'Precio Unitario ($)', 'Subtotal ($)'];
        const tableRows = orden.items.map(item => [
            item.product.nombre,
            item.cantidad,
            item.precioUnitario.toFixed(2),
            item.subtotal.toFixed(2),
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        // Totales
        const finalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Subtotal: $${orden.subtotal.toFixed(2)}`, 10, finalY);
        doc.text(`Impuestos: $${orden.impuestos.toFixed(2)}`, 10, finalY + 10);
        doc.text(`Envío: $${orden.envio.toFixed(2)}`, 10, finalY + 20);
        doc.setFontSize(14);
        doc.text(`TOTAL: $${orden.total.toFixed(2)}`, 10, finalY + 35);

        // Guardar el archivo
        doc.save(`orden_${orden.id}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/2 relative">
                <button className="absolute top-2 right-2" onClick={onClose}>
                    X
                </button>
                <h2 className="text-2xl font-semibold mb-4">Carrito de Compras</h2>

                {cart.length === 0 ? (
                    <p className="text-center">Tu carrito está vacío.</p>
                ) : (
                    <div>
                        {/* Mapeamos los productos en el carrito */}
                        {cart.map(product => (
                            <div key={product.id} className="border-b py-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p>Cantidad: {product.quantity}</p>
                                    <p>Precio (con descuento): ${product.price.toFixed(2)}</p>
                                    {product.discount && (
                                        <p className="text-red-500">
                                            Descuento: {product.discount}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Botón de Comprar al final de la lista */}
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                onClick={handlePurchase}
                            >
                                Comprar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;