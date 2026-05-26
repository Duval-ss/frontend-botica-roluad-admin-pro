import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Logo.png'



export default function Navbar() {
  const { cantidadTotal } = useCarrito()
  const { usuario, logout } = useAuth()
  const [buscarNav, setBuscarNav] = useState('')
  const navigate = useNavigate()
  const [tema, setTema] = useState('light')

  useEffect(() => {
    document.body.setAttribute('data-theme', tema)
  }, [tema])


  const buscarProducto = (e) => {
    e.preventDefault()

    const texto = buscarNav.trim()

    if (texto) {
      navigate(`/?buscar=${encodeURIComponent(texto)}#productos`)
    } else {
      navigate('/#productos')
    }
  }

  return (
    <>
      <div className="top-promo">
        <div className="container d-flex justify-content-between align-items-center">
          <span>💬 WhatsApp 997 551 917</span>
          <span className="d-none d-md-inline">Promociones y pedidos online</span>
        </div>
      </div>

      <div className="top-contact">
        <div className="container d-flex justify-content-between align-items-center">
          <span>📞 Roluad - 01 314 2020</span>
          <div className="d-none d-md-flex gap-4">
            <span>Delivery</span>
            <span>Recojo</span>
            <span>Promociones</span>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top roluad-navbar">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-3" to="/">
            <div className="brand-icon">
              <img src={logo} alt="ROLUAD logo" />
            </div>

            <div className="d-flex flex-column">
              <span className="fw-bold brand-title">
                Botica ROLUAD
              </span>

              <small className="brand-subtitle">
                Salud y bienestar online
              </small>
            </div>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <form className="navbar-search mx-lg-4 my-3 my-lg-0" onSubmit={buscarProducto}>
              <input
                type="text"
                placeholder="Busca una marca o producto"
                value={buscarNav}
                onChange={(e) => setBuscarNav(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>

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
              <div className="dropdown">
                <button
                  className="btn btn-theme dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {tema === 'light' && ' Light'}
                  {tema === 'dark' && ' Dark'}
                  {tema === 'auto' && ' Auto'}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTema('light')}
                    >
                      Light
                    </button>
                  </li>

                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTema('dark')}
                    >
                      Dark
                    </button>
                  </li>

                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTema('auto')}
                    >
                      Auto
                    </button>
                  </li>
                </ul>
              </div>
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

      <div className="category-navbar">
        <div className="container category-scroll">
          <a href="/#productos">Categorías ▾</a>
          <a href="/#productos">🌿 Rutina diaria</a>
          <a href="/#productos">👶 Mamá y Bebé</a>
          <a href="/#productos">💊 Vitaminas</a>
          <a href="/#productos">🧴 Cuida tu piel</a>
          <a href="/#productos">🩺 Dispositivos médicos</a>
          <a href="/#productos">🎁 Packs</a>
        </div>
      </div>
    </>
  )
}