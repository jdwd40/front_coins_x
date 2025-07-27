import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastContainer } from './components/ui/ToastContainer';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorHandlingDemo from './components/ui/ErrorHandlingDemo';
import { AuthTest } from './components/auth/AuthTest';
import ApiTest from './pages/ApiTest';
import CoinDetail from './pages/CoinDetail';
import BuySell from './pages/BuySell';
import Sell from './pages/Sell';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
                          {/* Demo Route */}
            <Route path="/demo" element={<ErrorHandlingDemo />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/api-test" element={<ApiTest />} />
                          <Route path="/coin/:coinId" element={<CoinDetail />} />
              <Route path="/buy-sell" element={<BuySell />} />
              <Route path="/sell" element={<Sell />} />
              
              {/* Protected Routes with Layout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/trading" element={
                <ProtectedRoute>
                  <Layout>
                    <Trading />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <Layout>
                    <Portfolio />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/transaction-history" element={
                <ProtectedRoute>
                  <Layout>
                    <TransactionHistoryPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Toast Container for notifications */}
            <ToastContainer />
          </Router>
        </AuthProvider>
        
        {/* React Query DevTools - only in development */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
