// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './api/apolloClient';
import Navbar from './components/layout/Navbar';
import MyRoutes from './routes/Routes';
import Sidebar from './components/layout/Sidebar';
import { AuthProvider, useAuth } from './hooks/useAuth'; // Import from your main useAuth file
import { CartProvider } from './context/CartContext';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex h-screen bg-white transition-all duration-300">
      {isAuthenticated && <Sidebar />}
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