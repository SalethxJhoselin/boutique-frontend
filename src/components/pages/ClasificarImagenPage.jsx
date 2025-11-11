// src/pages/ClasificarImagenPage.jsx
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  RobotOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  message,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Upload
} from 'antd';
import { useState } from 'react';
import { CLASIFICAR_IMAGEN_MUTATION } from '../../api/graphql/mlQueries';

const { Dragger } = Upload;

const ClasificarImagenPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [classifyImage] = useMutation(CLASIFICAR_IMAGEN_MUTATION);

  const handleUpload = async (file) => {
    // Validar tipo de archivo
    const isValidType = file.type.startsWith('image/');
    if (!isValidType) {
      message.error('Solo se permiten archivos de imagen!');
      return false;
    }

    // Validar tamaño (max 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('La imagen debe ser menor a 5MB!');
      return false;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Procesar imagen
    await processImage(file);
    return false; // Prevenir upload automático
  };
  // src/pages/ClasificarImagenPage.jsx
  const processImage = async (file) => {
    setIsProcessing(true);
    setClassificationResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1];

        console.log('📤 ENVIANDO IMAGEN AL BACKEND...');
        console.log('📏 Tamaño del base64:', base64.length, 'caracteres');
        console.log('🆔 Product ID:', `temp-${Date.now()}`);

        try {
          const { data, errors } = await classifyImage({
            variables: {
              productId: `temp-${Date.now()}`,
              imageBase64: base64
            }
          });

          console.log('📥 RESPUESTA DEL BACKEND:', data);

          if (errors) {
            console.error('❌ ERRORES GraphQL:', errors);
            message.error('Error en la consulta GraphQL');
            return;
          }

          if (data?.clasificarImagen?.success) {
            console.log('✅ CLASIFICACIÓN EXITOSA');
            console.log('📊 Datos recibidos:', data.clasificarImagen);
            setClassificationResult(data.clasificarImagen);
            message.success('¡Imagen clasificada exitosamente!');
          } else {
            console.log('❌ Clasificación no exitosa');
            message.error('Error en la clasificación de la imagen');
          }
        } catch (graphqlError) {
          console.error('🚨 ERROR en mutation GraphQL:', graphqlError);
          message.error('Error al comunicarse con el servidor');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('💥 ERROR general:', error);
      message.error('Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setClassificationResult(null);
    setIsProcessing(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'green';
    if (confidence >= 0.6) return 'orange';
    return 'red';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <RobotOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <h1 style={{ margin: '8px 0', color: '#1890ff' }}>Clasificación de Imágenes con IA</h1>
              <p style={{ color: '#666', fontSize: '16px' }}>
                Sube una imagen de prenda de vestir y nuestro sistema de inteligencia artificial
                analizará sus características automáticamente.
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileImageOutlined />
                Subir Imagen
              </Space>
            }
            loading={isProcessing}
          >
            <Dragger
              name="file"
              multiple={false}
              accept="image/*"
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={isProcessing}
            >
              <div style={{ padding: '40px 0' }}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">
                  Haz clic o arrastra una imagen aquí
                </p>
                <p className="ant-upload-hint">
                  Soporte para formatos JPG, PNG, WEBP. Tamaño máximo: 5MB
                </p>
              </div>
            </Dragger>

            {uploadedImage && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <h4>Vista previa:</h4>
                <img
                  src={uploadedImage}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    borderRadius: 8,
                    border: '2px solid #f0f0f0'
                  }}
                />
                <Button
                  onClick={resetAnalysis}
                  style={{ marginTop: 8 }}
                  danger
                >
                  Cambiar Imagen
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RobotOutlined />
                Resultados del Análisis
                {classificationResult && (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                )}
              </Space>
            }
            loading={isProcessing}
          >
            {!classificationResult && !isProcessing && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <FileImageOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>Sube una imagen para ver los resultados del análisis</p>
              </div>
            )}

            {isProcessing && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Progress type="circle" percent={75} />
                <p style={{ marginTop: 16 }}>Analizando imagen con IA...</p>
              </div>
            )}
 {classificationResult && (
              <div>
                {/* Información general - ACTUALIZADA */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <Statistic 
                      title="Tiempo de Procesamiento" 
                      value={classificationResult.processing_time_ms} 
                      suffix="ms"
                      prefix={<ClockCircleOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="ID de Producto" 
                      value={classificationResult.product_id} 
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Versión del Modelo" 
                      value={classificationResult.model_version} 
                    />
                  </Col>
                </Row>

                <Divider>Características Detectadas</Divider>
  {classificationResult.predictions?.tipo_prenda && (
                  <div style={{ marginBottom: 16 }}>
                    <h4>👕 Tipo de Prenda</h4>
                    <Space wrap>
                      <Tag color={getConfidenceColor(classificationResult.predictions.tipo_prenda.confidence)}>
                        {classificationResult.predictions.tipo_prenda.label}
                      </Tag>
                      <Progress 
                        percent={Math.round(classificationResult.predictions.tipo_prenda.confidence * 100)} 
                        size="small" 
                        style={{ width: 100 }}
                      />
                      <span>{Math.round(classificationResult.predictions.tipo_prenda.confidence * 100)}%</span>
                    </Space>
                  </div>
                )}

                {/* Tipo de Cuello - NUEVO */}
                {classificationResult.predictions?.tipo_cuello && (
                  <div style={{ marginBottom: 16 }}>
                    <h4>👔 Tipo de Cuello</h4>
                    <Space wrap>
                      <Tag color={getConfidenceColor(classificationResult.predictions.tipo_cuello.confidence)}>
                        {classificationResult.predictions.tipo_cuello.label}
                      </Tag>
                      <Progress 
                        percent={Math.round(classificationResult.predictions.tipo_cuello.confidence * 100)} 
                        size="small" 
                        style={{ width: 100 }}
                      />
                      <span>{Math.round(classificationResult.predictions.tipo_cuello.confidence * 100)}%</span>
                    </Space>
                  </div>
                )}

                {/* Tipo de Manga - NUEVO */}
                {classificationResult.predictions?.tipo_manga && (
                  <div style={{ marginBottom: 16 }}>
                    <h4>👚 Tipo de Manga</h4>
                    <Space wrap>
                      <Tag color={getConfidenceColor(classificationResult.predictions.tipo_manga.confidence)}>
                        {classificationResult.predictions.tipo_manga.label}
                      </Tag>
                      <Progress 
                        percent={Math.round(classificationResult.predictions.tipo_manga.confidence * 100)} 
                        size="small" 
                        style={{ width: 100 }}
                      />
                      <span>{Math.round(classificationResult.predictions.tipo_manga.confidence * 100)}%</span>
                    </Space>
                  </div>
                )}

                {/* Patrón - NUEVO */}
                {classificationResult.predictions?.patron && (
                  <div style={{ marginBottom: 16 }}>
                    <h4>🎨 Patrón</h4>
                    <Space wrap>
                      <Tag color={getConfidenceColor(classificationResult.predictions.patron.confidence)}>
                        {classificationResult.predictions.patron.label}
                      </Tag>
                      <Progress 
                        percent={Math.round(classificationResult.predictions.patron.confidence * 100)} 
                        size="small" 
                        style={{ width: 100 }}
                      />
                      <span>{Math.round(classificationResult.predictions.patron.confidence * 100)}%</span>
                    </Space>
                  </div>
                )}

                {/* Color Principal */}
                {classificationResult.predictions?.color_principal && (
                  <div style={{ marginBottom: 16 }}>
                    <h4>🌈 Color Principal</h4>
                    <Space wrap>
                      <Tag color={getConfidenceColor(classificationResult.predictions.color_principal.confidence)}>
                        {classificationResult.predictions.color_principal.label}
                      </Tag>
                      <Progress 
                        percent={Math.round(classificationResult.predictions.color_principal.confidence * 100)} 
                        size="small" 
                        style={{ width: 100 }}
                      />
                      <span>{Math.round(classificationResult.predictions.color_principal.confidence * 100)}%</span>
                    </Space>
                  </div>
                )}

                {/* Estilo */}
                {classificationResult.predictions?.estilo && (
                  <div style={{ marginBottom: 16 }}>
                    <h4>🌟 Estilo</h4>
                    <Space wrap>
                      <Tag color={getConfidenceColor(classificationResult.predictions.estilo.confidence)}>
                        {classificationResult.predictions.estilo.label}
                      </Tag>
                      <Progress 
                        percent={Math.round(classificationResult.predictions.estilo.confidence * 100)} 
                        size="small" 
                        style={{ width: 100 }}
                      />
                      <span>{Math.round(classificationResult.predictions.estilo.confidence * 100)}%</span>
                    </Space>
                  </div>
                )}

                {/* Resumen - ACTUALIZADO */}
                <Card 
                  size="small" 
                  type="inner" 
                  title="Resumen del Análisis"
                  style={{ marginTop: 16 }}
                >
                  <List>
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<CheckCircleOutlined />} />}
                        title="Análisis Completado"
                        description={`Modelo: ${classificationResult.model_version} | Tiempo: ${classificationResult.processing_time_ms}ms`}
                      />
                    </List.Item>
                  </List>
                </Card>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClasificarImagenPage;