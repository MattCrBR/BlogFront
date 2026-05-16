import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/articles.css'

interface Article {
  id: number
  title: string
  content: string
  banner?: string
  author_name: string
  category: string
  created_at: string
  likes: number
  views: number
  average_read_time: number
}

export const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (category) params.append('category', category)

        const response = await fetch(`http://localhost:3001/api/articles?${params}`)
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

    const debounce = setTimeout(fetchArticles, 500)
    return () => clearTimeout(debounce)
  }, [search, category])

  if (loading) return <div className="loading">Carregando...</div>

  return (
    <div className="articles-page">
      <div className="container">
        <h1>Todos os Artigos</h1>
        <p>Explore nossa coleção completa de artigos técnicos</p>

        <div className="articles-controls">
          <input
            type="text"
            placeholder="Buscar artigos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="controls-right">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Todas as categorias</option>
              <option value="Desenvolvimento web">Desenvolvimento web</option>
              <option value="Inteligência Artificial">Inteligência Artificial</option>
              <option value="DevOps">DevOps</option>
              <option value="Mobile">Mobile</option>
            </select>

            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid"
              >⊞</button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="Lista"
              >☰</button>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="no-results">Nenhum artigo encontrado</div>
        ) : viewMode === 'grid' ? (
          <div className="articles-grid">
            {articles.map((article) => (
              <Link key={article.id} to={`/artigos/${article.id}`} className="article-card">
                <div className="card-image">
                  {article.banner
                    ? <img src={article.banner} alt={article.title} />
                    : <div className="card-placeholder" />
                  }
                  {article.category && <span className="category-tag">{article.category}</span>}
                </div>
                <div className="card-content">
                  <h3>{article.title}</h3>
                  <p>{article.content.substring(0, 100)}...</p>
                  <div className="card-footer">
                    <span>{article.author_name}</span>
                    <span>⏱ {article.average_read_time || 5} min</span>
                    <span>♥ {article.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="articles-list">
            {articles.map((article) => (
              <Link key={article.id} to={`/artigos/${article.id}`} className="article-list-item">
                <div className="list-image">
                  {article.banner
                    ? <img src={article.banner} alt={article.title} />
                    : <div className="card-placeholder" />
                  }
                </div>
                <div className="list-content">
                  {article.category && <span className="category-tag">{article.category}</span>}
                  <h3>{article.title}</h3>
                  <p>{article.content.substring(0, 150)}...</p>
                  <div className="card-footer">
                    <span>{article.author_name}</span>
                    <span>⏱ {article.average_read_time || 5} min</span>
                    <span>♥ {article.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}