import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

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

export const Home = () => {
  const [featured, setFeatured] = useState<Article[]>([])
  const [recent, setRecent] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/articles')
        if (response.ok) {
          const data = await response.json()
          setFeatured(data.slice(0, 4))
          setRecent(data.slice(4, 8))
        }
      } catch (error) {
        console.error('Erro ao buscar artigos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  if (loading) return <div className="loading">Carregando...</div>

  return (
    <div className="home">
      <section className="hero">
        <h1>Explore o Futuro da <span>Tecnologia</span></h1>
        <p>Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas</p>
        <div className="hero-buttons">
          <Link to="/artigos" className="btn-primary">Explorar Artigos</Link>
          <Link to="/cadastro" className="btn-secondary">Começar a Escrever</Link>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Artigos em Destaque</h2>
              <p>Os melhores conteúdos selecionados para você</p>
            </div>
            <Link to="/artigos">Ver todos →</Link>
          </div>

          <div className="articles-grid">
            {featured.map((article) => (
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
        </div>
      </section>

      {recent.length > 0 && (
        <section className="home-section home-section--dark">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>Artigos Recentes</h2>
                <p>Conteúdo recente da comunidade</p>
              </div>
            </div>
            <div className="articles-grid">
              {recent.map((article) => (
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
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}