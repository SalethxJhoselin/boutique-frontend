import { Button, Modal, Spin, message } from 'antd';
import { useState } from 'react';
import CreateProduct from './CreateProduct';
import { useProducts } from '../../../hooks/useProducts';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const ManageProduct = () => {
    const [productDetails, setProductDetails] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    // GraphQL Hook - DATOS REALES DEL BACKEND
    const { products, loading, error, deleteProduct, refetch } = useProducts();

    const placeholderImage = 'https://via.placeholder.com/300x300.png?text=Sin+Imagen';

    // Función para eliminar producto
    const handleDelete = async (id, nombre) => {
        Modal.confirm({
            title: '¿Estás seguro de eliminar este producto?',
            content: `Se eliminará permanentemente "${nombre}"`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await deleteProduct(id);
                    message.success('Producto eliminado exitosamente');
                    refetch(); // Actualizar lista
                } catch (error) {
                    console.error("Error al eliminar el producto", error);
                    message.error('Error al eliminar el producto');
                }
            }
        });
    };

    // Mostrar los detalles del producto en el modal
    const showProductDetails = (item) => {
        setProductDetails(item);
        setIsModalVisible(true); // Mostrar el modal
    };

    // Cerrar el modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setProductDetails(null);
    };

    // Callback cuando se crea un producto exitosamente
    const handleProductCreated = () => {
        refetch(); // Actualizar lista de productos
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
                <p className="ml-4">Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error al cargar productos: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Productos</h2>
            <div className="mb-4">
                <CreateProduct onSubmit={handleProductCreated} />
            </div>
            
            {products.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No hay productos registrados</p>
                    <p className="text-sm text-gray-400">Haz clic en "Agregar Producto" para crear uno nuevo</p>
                </div>
            ) : (
                <table className="product-table w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Categoría</th>
                            <th className="border px-4 py-2">Marca</th>
                            <th className="border px-4 py-2">Precio</th>
                            <th className="border px-4 py-2">Stock</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.nombre}</td>
                                <td className="border px-4 py-2">{item.categoriaRelacion?.nombre || 'N/A'}</td>
                                <td className="border px-4 py-2">{item.marca?.nombre || 'N/A'}</td>
                                <td className="border px-4 py-2">${item.precio.toFixed(2)}</td>
                                <td className="border px-4 py-2">{item.stock}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <Button 
                                        type="primary" 
                                        icon={<EyeOutlined />}
                                        onClick={() => showProductDetails(item)}
                                    >
                                        Ver
                                    </Button>
                                    <Button 
                                        danger 
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(item.id, item.nombre)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal de detalles del producto */}
            <Modal
                title="Detalles del Producto"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>Cerrar</Button>
                ]}
                width={700}
            >
                {productDetails && (
                    <div className="space-y-4">
                        <div className="flex gap-6">
                            {/* Imagen del producto */}
                            <div className="flex-shrink-0">
                                <img
                                    src={productDetails.imagen_url || placeholderImage}
                                    alt={productDetails.nombre}
                                    className="w-64 h-64 object-cover rounded-lg border"
                                />
                            </div>

                            {/* Información del producto */}
                            <div className="flex-1 space-y-2">
                                <h3 className="text-2xl font-bold">{productDetails.nombre}</h3>
                                <p className="text-gray-600">{productDetails.descripcion || 'Sin descripción'}</p>
                                
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Precio</p>
                                        <p className="text-xl font-bold text-green-600">${productDetails.precio.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Stock</p>
                                        <p className="text-lg font-semibold">{productDetails.stock} unidades</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Categoría</p>
                                        <p className="font-medium">{productDetails.categoriaRelacion?.nombre || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Marca</p>
                                        <p className="font-medium">{productDetails.marca?.nombre || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Descuento (si existe) */}
                                {productDetails.descuento && (
                                    <div className="bg-red-50 p-3 rounded">
                                        <p className="text-sm text-gray-500">Descuento</p>
                                        <p className="text-lg font-bold text-red-600">
                                            {productDetails.descuento.nombre} - {productDetails.descuento.porcentaje}%
                                        </p>
                                    </div>
                                )}

                                {/* Colores */}
                                {productDetails.colores && productDetails.colores.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Colores disponibles</p>
                                        <div className="flex flex-wrap gap-2">
                                            {productDetails.colores.map((color) => (
                                                <div 
                                                    key={color.id} 
                                                    className="flex items-center gap-2 border px-3 py-1 rounded"
                                                >
                                                    {color.codigoHex && (
                                                        <div 
                                                            style={{ backgroundColor: color.codigoHex }}
                                                            className="w-5 h-5 rounded-full border border-gray-300"
                                                        />
                                                    )}
                                                    <span>{color.nombre}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tallas */}
                                {productDetails.tallas && productDetails.tallas.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Tallas disponibles</p>
                                        <div className="flex flex-wrap gap-2">
                                            {productDetails.tallas.map((talla) => (
                                                <span 
                                                    key={talla.id} 
                                                    className="border border-gray-300 px-3 py-1 rounded font-medium"
                                                >
                                                    {talla.nombre} {talla.medida && `(${talla.medida})`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Información adicional */}
                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Popularidad</p>
                                            <p>{productDetails.popularidad || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Estado</p>
                                            <p className={productDetails.activo ? 'text-green-600' : 'text-red-600'}>
                                                {productDetails.activo ? 'Activo' : 'Inactivo'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Fecha Agregado</p>
                                            <p>{new Date(productDetails.fecha_agregado).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Última Actualización</p>
                                            <p>{new Date(productDetails.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageProduct;