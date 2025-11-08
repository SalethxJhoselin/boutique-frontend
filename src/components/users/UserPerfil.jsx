import { useQuery } from '@apollo/client';
import { useAuth } from '../../hooks/useAuth';
import { GET_ME } from '../../services/graphql/auth.queries';
import { Spin } from 'antd';

const UserProfile = () => {
  const { isLoggedIn } = useAuth();
  
  // GraphQL Query - DATOS REALES DEL BACKEND
  const { data, loading, error } = useQuery(GET_ME, {
    skip: !isLoggedIn, // No ejecutar si no está logueado
  });

  const userData = data?.me;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
        <p className="ml-4">Cargando datos del usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
        <p className="text-red-500">Error al cargar los datos del usuario: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      {userData ? (
        <div className="space-y-2">
          <p><strong>ID:</strong> {userData.id}</p>
          <p><strong>Nombre:</strong> {userData.nombre}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>No se encontraron datos del usuario.</p>
      )}
    </div>
  );
};

export default UserProfile;