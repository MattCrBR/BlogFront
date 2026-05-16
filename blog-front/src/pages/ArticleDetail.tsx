import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/article-detail.css'

interface Article {
  id: number
  title: string
  content: string
  banner?: string
  author_name: string
  author_id: number
  category: string
  created_at: string
  likes: number
  views: number
  average_read_time: number
}

interface Comment {
  id: number
  content: string
  user_id: number
  name: string
  created_at: string
}

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/articles/${id}`)
        if (response.ok) {
          const data = await response.json()
          setArticle(data)
          setComments(data.comments || [])
        } else {
          navigate('/artigos')
        }
      } catch (error) {
        navigate('/artigos')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id, navigate])

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      const response = await fetch(`http://localhost:3001/api/articles/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      })
      if (response.ok) {
        const newComment = await response.json()
        setComments([newComment, ...comments])
        setCommentText('')
      }
    } catch (error) {
      console.error('Erro ao comentar:', error)
    }
  }

  const handleLike = async () => {
    if (!token) return
    try {
      const method = isLiked ? 'DELETE' : 'POST'
      const response = await fetch(`http://localhost:3001/api/articles/${id}/like`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setIsLiked(!isLiked)
        setArticle((prev) =>
          prev ? { ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 } : prev
        )
      }
    } catch (error) {
      console.error('Erro ao curtir:', error)
    }
  }

  if (loading) return <div className="loading">Carregando...</div>
  if (!article) return null

  const isAuthor = user?.id === article.author_id

  return (
    <div className="article-detail">
      <div className="container">
        <Link to="/artigos" className="back-link">← Voltar aos Artigos</Link>

        {article.category && <span className="category-badge">{article.category}</span>}

        <h1>{article.title}</h1>

        <div className="article-meta">
          <span>{article.author_name}</span>
          <span>•</span>
          <span>{new Date(article.created_at).toLocaleDateString('pt-BR')}</span>
          <span>•</span>
          <span>⏱ {article.average_read_time || 5} min</span>
        </div>

        <div className="article-actions">
          <button
            className={`btn-like ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!token}
          >
            ♥ {article.likes}
          </button>
          <span className="views">👁 {article.views} visualizações</span>
          {isAuthor && (
            <>
              <Link to={`/artigos/${article.id}/editar`} className="btn-edit">Editar</Link>
            </>
          )}
        </div>

        {article.banner && (
          <div className="article-banner">
            <img src={article.banner} alt={article.title} />
          </div>
        )}

        <div className="article-content">
          {article.content}
        </div>

        <div className="comments-section">
          <h2>Comentários ({comments.length})</h2>

          {token ? (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Deixe seu comentário..."
                rows={4}
              />
              <button type="submit" className="btn-primary">Comentar</button>
            </form>
          ) : (
            <div className="login-to-comment">
              <p>Faça login para comentar</p>
              <Link to="/entrar" className="btn-primary">Fazer login</Link>
            </div>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.name}</strong>
                  <span>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}