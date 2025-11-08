import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import UserPerfil from '../components/users/UserPerfil';
import ManageRoles from '../components/views/administrador/ManageRoles';
import ManageUsuarios from '../components/views/administrador/ManageUsuarios';
import Login from '../components/users/Login';
import ManagePermissions from '../components/views/administrador/ManagePermissions';
import Catalog from '../components/pages/Catalog';
import ManageDiscount from '../components/views/Productos/ManageDiscount';
import ManageSize from '../components/views/Productos/ManageSize';
import ManageColor from '../components/views/Productos/ManageColor';
import ManageBrand from '../components/views/Productos/ManageBrand';
import ManageCategory from '../components/views/Productos/ManageCategory';
import ManageProduct from '../components/views/Productos/ManageProducts';
import PurchaseReceipt from '../components/views/Catalogo/PurchaseReceipt';
import ManageNotaIngreso from '../components/views/Inventario/ManageNotaIngreso';
import ManageCategoryColor from '../components/views/Productos/ManageCategoryColor';
import ManageUsers from '../components/views/administrador/ManageUsers';
import NotaVents from '../components/views/Inventario/NotaVents';
import ProductListReal from '../components/views/Catalogo/ProductListReal';

const MyRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/productos" element={<ProductListReal />} />
      <Route path="/purchase-receipt" element={<PurchaseReceipt />} />
      <Route path="/" element={isAuthenticated ? <ProductListReal /> : <Catalog />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/descuento" element={<ManageDiscount />} />
        <Route path="/talla" element={<ManageSize />} />
        <Route path="/color" element={<ManageColor />} />
        <Route path="/marca" element={<ManageBrand />} />
        <Route path="/categoria" element={<ManageCategory />} />
        <Route path="/categoria_color" element={<ManageCategoryColor />} />
        <Route path="/producto" element={<ManageProduct />} />
        <Route path="/notaIngreso" element={<ManageNotaIngreso />} />
        <Route path="/ventas" element={<NotaVents />} />
        <Route path="/perfil" element={<UserPerfil />} />
      </Route>

      {/* Rutas admin */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/roles" element={<ManageRoles />} />
        <Route path="/permisos" element={<ManagePermissions />} />
        <Route path="/adminUsers" element={<ManageUsers />} />
        <Route path="/admin/users" element={<ManageUsuarios />} />
      </Route>

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
};

export default MyRoutes;