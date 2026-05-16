import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard.css'

interface Article {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  likes: number
  views: number
  average_read_time: number
}

export const Dashboard = () => {
  const { user, token } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/articles/user/my-articles', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setArticles(data)
        }
      } catch (error) {
        console.error('Erro ao buscar artigos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMyArticles()
  }, [token])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const response = await fetch(`http://localhost:3001/api/articles/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setArticles(articles.filter((a) => a.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error('Erro ao deletar:', error)
    }
  }

  const totalLikes = articles.reduce((acc, a) => acc + a.likes, 0)
  const totalViews = articles.reduce((acc, a) => acc + a.views, 0)
  const avgReadTime = articles.length
    ? Math.round(articles.reduce((acc, a) => acc + (a.average_read_time || 0), 0) / articles.length)
    : 0

  if (loading) return <div className="loading">Carregando...</div>

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta, {user?.name}!</p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/configuracoes" className="btn-secondary">⚙ Configurações</Link>
            <Link to="/artigos/novo" className="btn-primary">+ Novo Artigo</Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📄</span>
            <div>
              <h3>{articles.length}</h3>
              <p>Total de Artigos</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👁</span>
            <div>
              <h3>{totalViews}</h3>
              <p>Visualizações</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">♥</span>
            <div>
              <h3>{totalLikes}</h3>
              <p>Curtidas</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱</span>
            <div>
              <h3>{avgReadTime} min</h3>
              <p>Tempo médio de leitura</p>
            </div>
          </div>
        </div>

        <div className="my-articles">
          <h2>Meus Artigos</h2>

          {articles.length === 0 ? (
            <div className="no-articles">
              <p>Você ainda não publicou nenhum artigo</p>
              <Link to="/artigos/novo" className="btn-primary">Criar primeiro artigo</Link>
            </div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="dashboard-article">
                <div className="dashboard-article-info">
                  <h3>{article.title}</h3>
                  <p>{article.content.substring(0, 100)}...</p>
                  <div className="dashboard-article-meta">
                    <span>{new Date(article.created_at).toLocaleDateString('pt-BR')}</span>
                    <span>♥ {article.likes}</span>
                    <span>👁 {article.views}</span>
                  </div>
                </div>
                <div className="dashboard-article-actions">
                  <Link to={`/artigos/${article.id}/editar`} className="btn-edit-small">Editar</Link>
                  <button className="btn-delete-small" onClick={() => setDeleteId(article.id)}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Excluir Artigo</h2>
            <p>Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancelar</button>
              <button className="btn-delete" onClick={handleDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}