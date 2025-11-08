import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import MyRoutes from './routes/Routes';
import Sidebar from './components/layout/Sidebar';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';

const AppContent = () => {
  const { isLoggedIn, sidebarOpen, setSidebarOpen } = useAuth();

  return (
    <div className="flex h-screen bg-white transition-all duration-300">
      {isLoggedIn && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <div className="pt-16">
          <MyRoutes />
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
