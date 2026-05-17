import { Link } from 'react-router-dom'
import '../styles/footer.css'

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-logo">&lt;M/&gt;</Link>
          <p>Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.</p>
        </div>

        <div className="footer-nav">
          <h4>Navegação</h4>
          <Link to="/">Home</Link>
          <Link to="/artigos">Artigos</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="footer-social">
          <h4>Redes Sociais</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noreferrer">in</a>
            <a href="#" target="_blank" rel="noreferrer">gh</a>
            <a href="#" target="_blank" rel="noreferrer">tw</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 TechBlog. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}