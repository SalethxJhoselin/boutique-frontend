import { useState, useEffect, useContext, createContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN, REGISTER, GET_ME } from '../services/graphql/auth.queries';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Query para obtener usuario actual - con manejo de errores mejorado
  const { data: meData, error: meError, refetch: refetchMe } = useQuery(GET_ME, {
    skip: !token,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  // Efecto para manejar datos del usuario
  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
      setLoading(false);
    }
  }, [meData]);

  // Efecto para manejar errores de autenticación
  useEffect(() => {
    if (meError) {
      console.error('Auth error:', meError);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  }, [meError]);

  // Mutations
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER);

  // Cargar usuario al montar
  useEffect(() => {
    if (token) {
      refetchMe().catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token, refetchMe]);

  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login con:', { email }); // Debug
      
      const { data } = await loginMutation({
        variables: {
          input: { email, password },
        },
      });
      
      console.log('✅ Respuesta del servidor:', data); // Debug
      
      if (data?.login) {
        const { accessToken, user } = data.login;
        console.log('💾 Guardando token:', accessToken); // Debug
        
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setUser(user);
        
        console.log('✅ Login exitoso!', user); // Debug
      } else {
        throw new Error('No se recibió respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Login error completo:', error); // Debug detallado
      console.error('❌ GraphQL errors:', error.graphQLErrors); // Errores GraphQL
      console.error('❌ Network error:', error.networkError); // Errores de red
      throw error;
    }
  };

  const register = async (nombre, email, password, passwordConfirm) => {
    try {
      // Validación de contraseñas en el frontend
      if (password !== passwordConfirm) {
        throw new Error('Las contraseñas no coinciden');
      }

      const { data } = await registerMutation({
        variables: {
          input: { 
            nombre, 
            email, 
            password 
            // NO enviamos passwordConfirm - el backend no lo acepta
          },
        },
      });
      
      if (data?.register) {
        const { accessToken, user } = data.register;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setUser(user);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    userId: user?.id,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoggedIn: !!user,
    loginLoading,
    registerLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
