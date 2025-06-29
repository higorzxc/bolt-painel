import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WhatsAppPanel from './components/WhatsAppPanel'; // IMPORTANDO O WhatsAppPanel

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp(); // Verificando se o usuário está autenticado

  return (
    <>
      {isAuthenticated ? (
        <>
          <Dashboard /> {/* Exibe o Dashboard quando autenticado */}
          <WhatsAppPanel /> {/* Exibe o QR Code com o WhatsAppPanel */}
        </>
      ) : (
        <Login /> // Exibe a tela de login quando não autenticado
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
