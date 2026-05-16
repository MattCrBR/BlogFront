import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/navbar.css'

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">&lt;M/&gt;</Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/artigos" className="nav-link">Artigos</Link>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">{user?.name.charAt(0).toUpperCase()}</div>
                <span>{user?.name}</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p className="dropdown-user-info">
                    <strong>{user?.name}</strong>
                    <small>{user?.email}</small>
                  </p>
                  <hr />
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                  <Link to="/configuracoes" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Configurações</Link>
                  <hr />
                  <button onClick={handleLogout} className="dropdown-item logout">Sair</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/entrar" className="btn-secondary">Entrar</Link>
              <Link to="/cadastro" className="btn-primary">Cadastrar</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}