import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientesList from './pages/Clientes/ClientesList';
import ClienteForm from './pages/Clientes/ClienteForm';

// Criar cliente do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Tema personalizado do Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Componente para proteger rotas autenticadas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Componente para redirecionar usuários autenticados
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rota pública */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Rotas protegidas */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Clientes */}
              <Route
                path="/clientes"
                element={
                  <ProtectedRoute>
                    <ClientesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes/novo"
                element={
                  <ProtectedRoute>
                    <ClienteForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes/:id/editar"
                element={
                  <ProtectedRoute>
                    <ClienteForm />
                  </ProtectedRoute>
                }
              />

              {/* Placeholder para outras rotas */}
              <Route
                path="/responsaveis"
                element={
                  <ProtectedRoute>
                    <div>Responsáveis - Em desenvolvimento</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/atividades"
                element={
                  <ProtectedRoute>
                    <div>Atividades - Em desenvolvimento</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inscricoes"
                element={
                  <ProtectedRoute>
                    <div>Inscrições - Em desenvolvimento</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/avaliacoes"
                element={
                  <ProtectedRoute>
                    <div>Avaliações - Em desenvolvimento</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/administradores"
                element={
                  <ProtectedRoute>
                    <div>Administradores - Em desenvolvimento</div>
                  </ProtectedRoute>
                }
              />

              {/* Rota padrão */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Rota 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
