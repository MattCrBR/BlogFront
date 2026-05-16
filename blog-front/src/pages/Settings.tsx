import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/settings.css'

export const Settings = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, bio }),
      })

      if (response.ok) {
        setMessage('Perfil atualizado com sucesso!')
      } else {
        setError('Erro ao atualizar perfil')
      }
    } catch (err) {
      setError('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="settings">
      <div className="container">
        <Link to="/dashboard" className="back-link">← Voltar ao Dashboard</Link>

        <h1>Configurações do Perfil</h1>
        <p>Gerencie suas informações pessoais</p>

        <div className="settings-box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Fale um pouco sobre você..."
                rows={4}
                maxLength={500}
              />
              <small>{bio.length}/500 caracteres</small>
            </div>

            <div className="account-info">
              <h3>Informações da Conta</h3>
              <div className="info-row">
                <span>Membro desde</span>
                <strong>{new Date().toLocaleDateString('pt-BR')}</strong>
              </div>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary btn-full">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>

          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}