import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useCarrito } from '../../../hooks/useCarrito';
import { useMisOrdenes } from '../../../hooks/useOrders';
import { Modal, Button, Empty, Image, InputNumber, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const CartModal = ({ onClose }) => {
    const { user } = useAuth();
    const { carrito, loading, actualizarCantidad, eliminarDelCarrito, limpiarCarrito } = useCarrito(user?.id);
    const { crearOrden } = useMisOrdenes();
    const navigate = useNavigate();

    const handlePurchase = async () => {
        if (!carrito?.items || carrito.items.length === 0) {
            console.warn("El carrito está vacío. No se puede realizar la compra.");
            return;
        }

        const items = carrito.items.map(item => ({
            productId: item.producto.id,
            cantidad: item.cantidad,
        }));

        console.log('🛒 Creando orden con items:', items);

        try {
            const orden = await crearOrden(items);
            console.log("✅ Orden creada exitosamente:", orden);

            // Generar PDF del recibo
            generatePDF(orden);

            // TODO: Integración con Stripe Checkout
            // Para implementar Stripe correctamente, necesitas:
            // 1. Crear una sesión de checkout en el backend con el monto de la orden
            // 2. Redirigir al usuario a la URL de checkout que devuelve Stripe
            // Ejemplo de implementación:
            /*
            const checkoutSession = await crearStripeCheckout({
              ordenId: orden.id,
              total: orden.total,
              items: orden.items,
            });
            window.location.href = checkoutSession.url;
            */

            // Por ahora, mostrar un mensaje de éxito y el recibo
            alert(`✅ Orden creada exitosamente!\n\nTotal: $${orden.total.toFixed(2)}\nOrden ID: ${orden.id}\n\nSe ha generado el PDF del recibo.`);

            // Navegar a la página de recibo
            navigate('/purchase-receipt', { state: { orden } });

            // Limpiar el carrito
            await limpiarCarrito();
            onClose();
        } catch (error) {
            console.error("❌ Error al crear la orden:", error);
            console.error("Error completo:", JSON.stringify(error, null, 2));
            console.error("GraphQL errors:", error.graphQLErrors);
            console.error("Network error:", error.networkError);
            alert("Error al procesar la compra. Por favor intenta de nuevo.");
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        console.log('🔄 Actualizando cantidad:', { itemId, newQuantity });
        try {
            await actualizarCantidad(itemId, newQuantity);
            console.log('✅ Cantidad actualizada exitosamente');
        } catch (error) {
            console.error("❌ Error al actualizar cantidad:", error);
            console.error("Error completo:", JSON.stringify(error, null, 2));
        }
    };

    const handleRemoveItem = async (itemId) => {
        console.log('🗑️ Eliminando item:', itemId);
        try {
            await eliminarDelCarrito(itemId);
            console.log('✅ Item eliminado exitosamente');
        } catch (error) {
            console.error("❌ Error al eliminar item:", error);
            console.error("Error completo:", JSON.stringify(error, null, 2));
        }
    };

    const generatePDF = (orden) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Recibo de Compra', 105, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Orden ID: ${orden.id}`, 10, 30);
        doc.text(`Fecha: ${new Date(orden.createdAt).toLocaleDateString()}`, 10, 40);
        doc.text(`Estado: ${orden.estado}`, 10, 50);

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

        const finalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Subtotal: $${orden.subtotal.toFixed(2)}`, 10, finalY);
        doc.text(`Impuestos: $${orden.impuestos.toFixed(2)}`, 10, finalY + 10);
        doc.text(`Envío: $${orden.envio.toFixed(2)}`, 10, finalY + 20);
        doc.setFontSize(14);
        doc.text(`TOTAL: $${orden.total.toFixed(2)}`, 10, finalY + 35);

        doc.save(`orden_${orden.id}.pdf`);
    };

    if (loading) {
        return (
            <Modal open={true} onCancel={onClose} footer={null} width={800}>
                <div className="flex justify-center py-8">
                    <Spin size="large" />
                </div>
            </Modal>
        );
    }

    const items = carrito?.items || [];
    const isEmpty = items.length === 0;

    return (
        <Modal
            open={true}
            onCancel={onClose}
            title="Carrito de Compras"
            width={800}
            footer={[
                <div key="footer" className="flex justify-between items-center w-full">
                    <div className="text-lg font-bold">
                        Total: ${carrito?.total?.toFixed(2) || '0.00'}
                    </div>
                    <div>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancelar
                        </Button>
                        <Button 
                            type="primary" 
                            onClick={handlePurchase}
                            disabled={isEmpty}
                        >
                            Procesar Compra
                        </Button>
                    </div>
                </div>
            ]}
        >
            {isEmpty ? (
                <Empty description="Tu carrito está vacío" />
            ) : (
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                            <Image
                                src={item.producto.imagen_url || 'https://via.placeholder.com/80'}
                                alt={item.producto.nombre}
                                width={80}
                                height={80}
                                style={{ objectFit: 'cover', borderRadius: 8 }}
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.producto.nombre}</h3>
                                <p className="text-gray-600">
                                    ${item.precioUnitario.toFixed(2)} c/u
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span>Cantidad:</span>
                                    <InputNumber
                                        min={1}
                                        max={item.producto.stock}
                                        value={item.cantidad}
                                        onChange={(value) => handleUpdateQuantity(item.id, value)}
                                        size="small"
                                    />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">
                                    ${item.subtotal.toFixed(2)}
                                </div>
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveItem(item.id)}
                                    size="small"
                                    className="mt-2"
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))}
                    
                    {carrito.descuento > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Descuento ({carrito.codigoDescuento}):</span>
                            <span>-${carrito.descuento.toFixed(2)}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-between text-lg">
                        <span>Subtotal:</span>
                        <span>${carrito.subtotal.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </Modal>
    );
};



export default CartModal;