import { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Button, Table, Input, notification, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProducts } from '../../../hooks/useProducts';
import { useUsuarios } from '../../../hooks/useUsuarios';

const { Option } = Select;
const { TextArea } = Input;

const CreateNotaVentaModal = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [detalles, setDetalles] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  
  const { products, loading: loadingProducts } = useProducts();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();

  const handleAddDetalle = () => {
    if (!selectedProduct) {
      notification.warning({ message: 'Selecciona un producto' });
      return;
    }
    
    if (cantidad <= 0) {
      notification.warning({ message: 'La cantidad debe ser mayor a 0' });
      return;
    }

    const producto = products.find(p => p.id === selectedProduct);
    
    if (!producto) {
      notification.error({ message: 'Producto no encontrado' });
      return;
    }

    const precio = precioUnitario || producto.precio;
    const subtotal = cantidad * precio;

    const nuevoDetalle = {
      productoId: producto.id,
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock
      },
      cantidad,
      precioUnitario: precio,
      subtotal
    };

    setDetalles([...detalles, nuevoDetalle]);
    
    // Reset
    setSelectedProduct(null);
    setCantidad(1);
    setPrecioUnitario(0);
  };

  const handleRemoveDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  const handleProductChange = (productId) => {
    setSelectedProduct(productId);
    const producto = products.find(p => p.id === productId);
    if (producto) {
      setPrecioUnitario(producto.precio);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (detalles.length === 0) {
        notification.warning({ message: 'Agrega al menos un producto' });
        return;
      }

      const detallesInput = detalles.map(detalle => ({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario
      }));

      const input = {
        usuarioId: values.usuarioId,
        detalles: detallesInput,
        observaciones: values.observaciones || ''
      };

      await onCreate(input);
      
      // Reset form
      form.resetFields();
      setDetalles([]);
      setSelectedProduct(null);
      setCantidad(1);
      setPrecioUnitario(0);
      
    } catch (error) {
      console.error('Error en validación:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDetalles([]);
    setSelectedProduct(null);
    setCantidad(1);
    setPrecioUnitario(0);
    onCancel();
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);
  };

  const columns = [
    {
      title: 'Producto',
      dataIndex: ['producto', 'nombre'],
      key: 'producto',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      align: 'center',
      width: 100,
    },
    {
      title: 'Precio Unit.',
      dataIndex: 'precioUnitario',
      key: 'precioUnitario',
      render: (precio) => `$${precio.toFixed(2)}`,
      align: 'right',
      width: 120,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal) => `$${subtotal.toFixed(2)}`,
      align: 'right',
      width: 120,
    },
    {
      title: 'Acción',
      key: 'accion',
      render: (_, __, index) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveDetalle(index)}
        >
          Eliminar
        </Button>
      ),
      width: 100,
    },
  ];

  return (
    <Modal
      title="Crear Nota de Venta"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={900}
      okText="Crear Nota"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="usuarioId"
          label="Cliente"
          rules={[{ required: true, message: 'Selecciona un cliente' }]}
        >
          <Select
            placeholder="Selecciona un cliente"
            loading={loadingUsuarios}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {usuarios?.map(usuario => (
              <Option key={usuario.id} value={usuario.id}>
                {usuario.nombre} - {usuario.email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Productos">
          <Space.Compact style={{ width: '100%' }}>
            <Select
              placeholder="Selecciona producto"
              value={selectedProduct}
              onChange={handleProductChange}
              loading={loadingProducts}
              style={{ width: '40%' }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {products?.map(producto => (
                <Option key={producto.id} value={producto.id}>
                  {producto.nombre} (Stock: {producto.stock})
                </Option>
              ))}
            </Select>
            
            <InputNumber
              placeholder="Cantidad"
              value={cantidad}
              onChange={setCantidad}
              min={1}
              style={{ width: '20%' }}
            />
            
            <InputNumber
              placeholder="Precio unitario"
              value={precioUnitario}
              onChange={setPrecioUnitario}
              min={0}
              step={0.01}
              prefix="$"
              style={{ width: '25%' }}
            />
            
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddDetalle}
              style={{ width: '15%' }}
            >
              Agregar
            </Button>
          </Space.Compact>
        </Form.Item>

        <Table
          columns={columns}
          dataSource={detalles}
          rowKey={(record, index) => index}
          pagination={false}
          size="small"
          style={{ marginBottom: 16 }}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} align="right">
                  <strong>Total:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <strong>${calcularTotal().toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        <Form.Item name="observaciones" label="Observaciones">
          <TextArea rows={3} placeholder="Observaciones adicionales (opcional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateNotaVentaModal;
