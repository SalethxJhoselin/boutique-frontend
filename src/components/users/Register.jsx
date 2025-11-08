import { useState } from 'react';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../services/graphql/auth.queries';
import { useAuth } from '../../hooks/useAuth';
import { message } from 'antd';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const [registerMutation, { loading }] = useMutation(REGISTER);

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const result = await registerMutation({
                variables: {
                    input: {
                        nombre,
                        email: correo,
                        password: contraseña
                    }
                }
            });

            const { token } = result.data.register;
            localStorage.setItem('token', token);
            login(token);
            message.success('¡Registro exitoso! Bienvenido');
            navigate('/');
        } catch (error) {
            console.error('Error en registro:', error);
            const errorMsg = error.message || 'Error al registrarse. Inténtalo de nuevo.';
            setErrorMessage(errorMsg);
            message.error(errorMsg);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8">
                <h2 className="text-3xl text-center mb-8">REGÍSTRATE</h2>
                <form className="space-y-8" onSubmit={onSubmit}>
                    <div className="relative border-b border-blue">
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="NOMBRE"
                            onChange={ev => setNombre(ev.target.value)}
                            required
                        />
                    </div>
                    <div className="relative border-b border-blue">
                        <input
                            type="email"
                            id="correo"
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CORREO"
                            onChange={ev => setCorreo(ev.target.value)}
                            required
                        />
                    </div>
                    <div className="relative border-b border-blue">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="block w-full appearance-none bg-transparent border-none placeholder:text-gray-500 text-lg focus:outline-none focus:ring-0 peer"
                            placeholder="CONTRASEÑA"
                            onChange={ev => setContraseña(ev.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl text-black"
                        >
                            {showPassword ? <MdLockOpen /> : <MdLock />}
                        </button>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue text-white text-lg py-4 tracking-wider hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        <p className="text-gray-500">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="hover:text-black transition-colors">
                                INICIA SESIÓN
                            </Link>
                        </p>
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;