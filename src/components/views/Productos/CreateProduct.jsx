import { Button, Input, Modal, Select, Spin, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaPlus } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT } from '../../../services/graphql/products.queries';
import { useCategorias, useMarcas, useColores, useTallas } from '../../../hooks/useCatalog';

const { Option } = Select;

const CreateProduct = ({ onSubmit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productData, setProductData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen_url: '',
        categoria: null,
        marca: null,
        colores: [],
        tallas: [],
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    // GraphQL Hooks - DATOS REALES DEL BACKEND
    const { data: categoriasData, loading: loadingCategorias } = useCategorias();
    const { data: marcasData, loading: loadingMarcas } = useMarcas();
    const { data: coloresData, loading: loadingColores } = useColores();
    const { data: tallasData, loading: loadingTallas } = useTallas();
    const [crearProducto, { loading: creatingProduct }] = useMutation(CREATE_PRODUCT);

    const categorias = categoriasData?.categorias || [];
    const marcas = marcasData?.marcas || [];
    const colores = coloresData?.colores || [];
    const tallas = tallasData?.tallas || [];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const present_name = "clothing";
    const CLOUDINARY_CLOUD_NAME = "dxtic2eyg"; // ⚠️ Reemplaza con tu Cloud Name real

    // Función para subir la imagen a Cloudinary
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', present_name);
            setUploadingImage(true);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();

                const imageUrl = data.secure_url;
                setProductData((prevData) => ({
                    ...prevData,
                    imagen_url: imageUrl,
                }));
                setUploadingImage(false);
                message.success('Imagen subida exitosamente');
            } catch (error) {
                console.error('Error subiendo la imagen a Cloudinary:', error);
                setUploadingImage(false);
                message.error('Error al subir la imagen');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

    const handleSubmit = async () => {
        // Validaciones básicas
        if (!productData.nombre || !productData.precio || !productData.categoria || !productData.marca) {
            message.error('Por favor completa todos los campos obligatorios');
            return;
        }

        const formattedData = {
            nombre: productData.nombre,
            descripcion: productData.descripcion || null,
            precio: parseFloat(productData.precio),
            categoriaId: productData.categoria, // UUID string
            marcaId: productData.marca, // UUID string
            coloresIds: productData.colores, // Array de UUID strings
            tallasIds: productData.tallas, // Array de UUID strings
            imagen_url: productData.imagen_url || null,
            stock: 0,  // Stock inicial
            popularidad: 0,  // Popularidad inicial
        };

        try {
            const result = await crearProducto({
                variables: { input: formattedData }
            });

            message.success('Producto creado exitosamente');
            if (onSubmit) onSubmit(result.data.createProduct);
            setIsModalOpen(false);

            // Limpiar formulario después de crear
            setProductData({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen_url: '',
                categoria: null,
                marca: null,
                colores: [],
                tallas: [],
            });
        } catch (error) {
            console.error('Error al crear el producto:', error);
            message.error(error.message || 'Error al crear el producto');
        }
    };

    return (
        <div>
            <Button type="primary" icon={<FaPlus />} onClick={showModal}>
                Agregar Producto
            </Button>

            <Modal
                title="Crear Producto"
                visible={isModalOpen}
                onCancel={handleClose}
                footer={null}
                width={800}
            >
                {(loadingCategorias || loadingMarcas || loadingColores || loadingTallas) ? (
                    <div className="text-center py-8">
                        <Spin size="large" />
                        <p className="mt-4">Cargando datos...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Input
                                    name="nombre"
                                    placeholder="Nombre del producto *"
                                    value={productData.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Input
                                    name="descripcion"
                                    placeholder="Descripción del producto"
                                    value={productData.descripcion}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Input
                                    name="precio"
                                    placeholder="Precio *"
                                    type="number"
                                    value={productData.precio}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Select
                                    name="categoria"
                                    value={productData.categoria}
                                    onChange={(value) => handleSelectChange('categoria', value)}
                                    placeholder="Selecciona una categoría *"
                                    style={{ width: '100%' }}
                                >
                                    {categorias.map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Select
                                    name="marca"
                                    value={productData.marca}
                                    onChange={(value) => handleSelectChange('marca', value)}
                                    placeholder="Selecciona una marca *"
                                    style={{ width: '100%' }}
                                >
                                    {marcas.map((brand) => (
                                        <Option key={brand.id} value={brand.id}>
                                            {brand.nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Select
                                    mode="multiple"
                                    name="colores"
                                    value={productData.colores}
                                    onChange={(value) => handleSelectChange('colores', value)}
                                    placeholder="Selecciona colores"
                                    style={{ width: '100%' }}
                                >
                                    {colores.map((color) => (
                                        <Option key={color.id} value={color.id}>
                                            {color.nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Select
                                    mode="multiple"
                                    name="tallas"
                                    value={productData.tallas}
                                    onChange={(value) => handleSelectChange('tallas', value)}
                                    placeholder="Selecciona tallas"
                                    style={{ width: '100%' }}
                                >
                                    {tallas.map((size) => (
                                        <Option key={size.id} value={size.id}>
                                            {size.nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <div {...getRootProps()} className="border-2 border-dashed p-4 mt-2">
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <p>Suelta la imagen aquí...</p>
                                    ) : (
                                        <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.</p>
                                    )}
                                </div>
                                {uploadingImage && <Spin />}
                                {productData.imagen_url && (
                                    <div className="mt-4">
                                        <h4>Vista previa de la imagen</h4>
                                        <img
                                            src={productData.imagen_url}
                                            alt="Vista previa"
                                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type="primary" onClick={handleSubmit} loading={creatingProduct}>
                                Crear Producto
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CreateProduct;