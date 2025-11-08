import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin, Tabs, Row, Col } from 'antd';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, register, loginLoading, registerLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values) => {
    console.log('📝 Formulario enviado:', values); // Debug
    
    try {
      await login(values.email, values.password);
      message.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } catch (error) {
      console.error('❌ Error capturado en handleLogin:', error); // Debug
      
      const errorMsg = error.graphQLErrors?.[0]?.message 
        || error.networkError?.message 
        || error.message 
        || 'Error al iniciar sesión';
      
      message.error(errorMsg);
    }
  };

  const handleRegister = async (values) => {
    try {
      if (values.password !== values.passwordConfirm) {
        message.error('Las contraseñas no coinciden');
        return;
      }
      await register(values.nombre, values.email, values.password, values.passwordConfirm);
      message.success('¡Registro exitoso! Iniciando sesión...');
      navigate('/');
    } catch (error) {
      message.error(error.message || 'Error en el registro');
    }
  };

  const items = [
    {
      key: 'login',
      label: 'Iniciar Sesión',
      children: (
        <Spin spinning={loginLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo' },
                { type: 'email', message: 'Correo inválido' },
              ]}
            >
              <Input 
                placeholder="usuario@ejemplo.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: true, message: 'Por favor ingresa tu contraseña' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
              ]}
            >
              <Input.Password 
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loginLoading}
              >
                Iniciar Sesión
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      ),
    },
    {
      key: 'register',
      label: 'Crear Cuenta',
      children: (
        <Spin spinning={registerLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            autoComplete="off"
          >
            <Form.Item
              name="nombre"
              label="Nombre Completo"
              rules={[
                { required: true, message: 'Por favor ingresa tu nombre' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
              ]}
            >
              <Input 
                placeholder="Tu nombre completo"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo' },
                { type: 'email', message: 'Correo inválido' },
              ]}
            >
              <Input 
                placeholder="usuario@ejemplo.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: true, message: 'Por favor ingresa una contraseña' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
              ]}
            >
              <Input.Password 
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="passwordConfirm"
              label="Confirmar Contraseña"
              rules={[
                { required: true, message: 'Por favor confirma tu contraseña' },
              ]}
            >
              <Input.Password 
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={registerLoading}
              >
                Crear Cuenta
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-blue-100 p-4">
      <Card 
        title={
          <div className="text-center text-2xl font-bold text-pink-600">
            Bienvenido a Boutique
          </div>
        }
        bordered={false}
        className="shadow-xl w-full max-w-md"
      >
        <Tabs 
          items={items}
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
        />
      </Card>
    </div>
  );
};

export default Login;