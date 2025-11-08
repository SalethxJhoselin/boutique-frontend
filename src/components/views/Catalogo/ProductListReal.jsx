import React, { useState } from 'react';
import { Card, Button, Space, Spin, Empty, Pagination, Tag, Row, Col } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useProducts } from '../../../hooks/useProducts';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const { products, loading } = useProducts();
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  if (loading) return <Spin size="large" />;
  if (!products.length) return <Empty description="No hay productos disponibles" />;

  // Paginación
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Catálogo de Productos</h1>

      <Row gutter={[16, 16]}>
        {paginatedProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <div className="relative h-64 overflow-hidden bg-gray-100 group">
                  <img
                    alt={product.nombre}
                    src={product.imagen_url || 'https://via.placeholder.com/250x300?text=Sin+Imagen'}
                    style={{ 
                      height: '250px', 
                      objectFit: 'cover',
                      width: '100%',
                      transition: 'transform 0.3s',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      type="primary" 
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/producto/${product.id}`)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              }
              className="h-full"
            >
              <Card.Meta
                title={
                  <div className="truncate text-sm font-bold">
                    {product.nombre}
                  </div>
                }
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {product.descripcion}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-pink-600">
                        ${product.precio.toFixed(2)}
                      </span>
                      <Tag color={product.stock > 0 ? 'green' : 'red'}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                      </Tag>
                    </div>
                  </Space>
                }
              />
              <Button
                type="primary"
                block
                className="mt-2"
                icon={<ShoppingCartOutlined />}
                disabled={product.stock === 0}
              >
                Agregar al Carrito
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Paginación */}
      {products.length > itemsPerPage && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={page}
            total={products.length}
            pageSize={itemsPerPage}
            onChange={(newPage) => setPage(newPage)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
