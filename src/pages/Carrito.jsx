import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'

export default function Carrito() {
  const {
    carrito,
    cambiarCantidad,
    eliminarProducto,
    total,
    vaciarCarrito
  } = useCarrito()

  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [mostrarLoginModal, setMostrarLoginModal] = useState(false)

  const comprarAhora = () => {
    if (usuario) {
      navigate('/checkout')
    } else {
      setMostrarLoginModal(true)
    }
  }

  if (carrito.length === 0) {
    return (
      <div className="container py-5">
        <div className="empty-state text-center">
          <div className="display-4">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p className="text-muted">Agrega productos para continuar con tu compra.</p>
          <Link to="/" className="btn btn-primary">Ir a la tienda</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Tu carrito</h2>
                <button className="btn btn-outline-danger btn-sm" onClick={vaciarCarrito}>
                  Vaciar
                </button>
              </div>

              {carrito.map((p) => (
                <div className="cart-item" key={p.id}>
                  <img src={p.imagen || 'https://placehold.co/120'} alt={p.nombre} />

                  <div className="flex-grow-1">
                    <h5 className="mb-1">{p.nombre}</h5>
                    <span className="text-muted">S/ {Number(p.precio).toFixed(2)}</span>
                  </div>

                  <input
                    type="number"
                    min="1"
                    className="form-control qty-input"
                    value={p.cantidad}
                    onChange={(e) => cambiarCantidad(p.id, e.target.value)}
                  />

                  <strong>S/ {(Number(p.precio) * Number(p.cantidad)).toFixed(2)}</strong>

                  <button className="btn btn-light text-danger" onClick={() => eliminarProducto(p.id)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="summary-card shadow-sm">
            <h4 className="fw-bold">Resumen</h4>

            <div className="d-flex justify-content-between py-2">
              <span>Subtotal</span>
              <strong>S/ {total.toFixed(2)}</strong>
            </div>

            <div className="d-flex justify-content-between py-2">
              <span>Delivery</span>
              <span>Se calcula en checkout</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fs-5">
              <span>Total</span>
              <strong>S/ {total.toFixed(2)}</strong>
            </div>

            <button className="btn btn-primary w-100 mt-4" onClick={comprarAhora}>
              Finalizar compra
            </button>

            <Link to="/" className="btn btn-outline-primary w-100 mt-2">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>

      {mostrarLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-card">
            <button
              className="login-modal-close"
              onClick={() => setMostrarLoginModal(false)}
            >
              ×
            </button>

            <div className="login-modal-header">
              <div className="login-avatar">👤</div>
              <div>
                <h4>Iniciar sesión</h4>
                <p>Elige cómo deseas continuar con tu compra.</p>
              </div>
            </div>

            <div className="login-modal-actions">
              <Link className="login-social-btn" to="/login">
                 Ingresar con correo electrónico
              </Link>

              <Link className="login-social-btn" to="/registro">
                 Crear una cuenta nueva
              </Link>

              <button
                className="login-guest-btn"
                onClick={() => navigate('/checkout')}
              >
                Continuar sin iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}