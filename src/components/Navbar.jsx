import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Logo.png'

export default function Navbar() {
  const { cantidadTotal } = useCarrito()
  const { usuario, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-icon">
            <img src={logo} alt="ROLUAD logo" />
          </span>
          <span className="fw-bold text-primary">Botica ROLUAD</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Tienda</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/mis-pedidos">Mis pedidos</NavLink>
            </li>
            {usuario?.rol === 'ADMIN' && (
              <li className="nav-item">
                <NavLink className="nav-link admin-link" to="/admin">Panel Admin</NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {usuario ? (
              <>
                <span className="small text-muted d-none d-md-inline">Hola, {usuario.nombre}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Salir</button>
              </>
            ) : (
              <Link className="btn btn-outline-primary btn-sm" to="/login">Ingresar</Link>
            )}
            <Link className="btn btn-primary position-relative" to="/carrito">
              🛒 Carrito
              {cantidadTotal > 0 && <span className="cart-badge">{cantidadTotal}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
