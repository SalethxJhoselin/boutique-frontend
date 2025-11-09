// src/App.jsx
import { BrowserRouter } from 'react-router-dom';

import { ApolloProvider } from '@apollo/client';
import apolloClient from './api/apolloClient';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './hooks/useAuth';
import MyRoutes from './routes/Routes';

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex h-screen bg-white transition-all duration-300">

      {isAuthenticated && user.rolNombre === 'admin' && <Sidebar />}
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
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </ApolloProvider>
);

export default App;