import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo.png'

export default function AdminLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const salir = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand text-decoration-none">
          <span className="admin-brand-logo"><img src={logo} alt="ROLUAD logo" /></span>
          <div>
            <strong>ROLUAD</strong>
            <small>Panel administrativo</small>
          </div>
        </Link>

        <nav className="admin-menu">
          <NavLink end to="/admin">📊 Dashboard</NavLink>
          <NavLink to="/admin/productos">📦 Productos</NavLink>
          <NavLink to="/admin/pedidos">🧾 Pedidos</NavLink>
          <NavLink to="/admin/clientes">👥 Clientes</NavLink>
          <NavLink to="/admin/categorias">🏷️ Categorías</NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="btn btn-light w-100 mb-2">Ver tienda</Link>
          <button className="btn btn-outline-light w-100" onClick={salir}>Cerrar sesión</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div>
            <span className="badge rounded-pill text-bg-primary mb-1">ADMIN</span>
            <h5 className="mb-0">Sistema interno de gestión</h5>
          </div>
          <div className="text-end">
            <small className="text-muted d-block">Administrador</small>
            <strong>{usuario?.nombre}</strong>
          </div>
        </header>

        <div className="admin-page">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
