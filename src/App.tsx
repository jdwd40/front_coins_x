import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastContainer } from './components/ui/ToastContainer';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorHandlingDemo from './components/ui/ErrorHandlingDemo';
import './styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Demo Route */}
          <Route path="/demo" element={<ErrorHandlingDemo />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/trading" element={
            <Layout>
              <Trading />
            </Layout>
          } />
          <Route path="/portfolio" element={
            <Layout>
              <Portfolio />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />
          
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Toast Container for notifications */}
        <ToastContainer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
