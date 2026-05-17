import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Articles } from './pages/Articles'
import { ArticleDetail } from './pages/ArticleDetail'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ArticleForm } from './pages/ArticleForm'
import './index.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div className="loading">Carregando...</div>
  if (!isAuthenticated) return <Navigate to="/entrar" replace />

  return <>{children}</>
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artigos" element={<Articles />} />
        <Route path="/artigos/:id" element={<ArticleDetail />} />
        <Route path="/artigos/novo" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
        <Route path="/artigos/:id/editar" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App