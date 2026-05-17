import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/article-form.css'

export const ArticleForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const isEditing = !!id

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [banner, setBanner] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/articles/${id}`)
          if (response.ok) {
            const data = await response.json()
            setTitle(data.title)
            setContent(data.content)
            setCategory(data.category || '')
            setBanner(data.banner || '')
          }
        } catch (error) {
          console.error('Erro ao buscar artigo:', error)
        }
      }
      fetchArticle()
    }
  }, [id, isEditing])

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setBanner(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('Título e conteúdo são obrigatórios')
      return
    }

    setLoading(true)

    try {
      const url = isEditing
        ? `http://localhost:3001/api/articles/${id}`
        : 'http://localhost:3001/api/articles'

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category, banner }),
      })

      if (response.ok) {
        navigate('/dashboard')
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao salvar artigo')
      }
    } catch (err) {
      setError('Erro ao salvar artigo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="article-form-page">
      <div className="container">
        <h1>{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</h1>
        <p>{isEditing ? 'Edite as informações do seu artigo' : 'Preencha as informações do seu artigo'}</p>

        <div className="article-form-box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do artigo"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Selecione uma categoria</option>
                <option value="Desenvolvimento web">Desenvolvimento web</option>
                <option value="Inteligência Artificial">Inteligência Artificial</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className="form-group">
              <label>Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="file-input"
              />
              {banner && (
                <div className="banner-preview">
                  <img src={banner} alt="Preview do banner" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Conteúdo</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva o conteúdo do seu artigo..."
                rows={16}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Publicar Artigo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}