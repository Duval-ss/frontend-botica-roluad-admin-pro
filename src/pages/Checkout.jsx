import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useCarrito } from '../context/CarritoContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { carrito, total, vaciarCarrito } = useCarrito()
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    nombre_cliente: usuario?.nombre || '',
    email_cliente: usuario?.email || '',
    telefono: usuario?.telefono || '',
    direccion: usuario?.direccion || '',
    referencia: '',
    tipo_entrega: 'DELIVERY'
  })

  const actualizar = (campo, valor) => setForm({ ...form, [campo]: valor })

  const confirmarPedido = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (carrito.length === 0) return setError('Tu carrito está vacío.')
    if (!form.nombre_cliente || !form.telefono) return setError('Completa nombre y teléfono.')
    if (form.tipo_entrega === 'DELIVERY' && !form.direccion) return setError('Para delivery debes ingresar una dirección.')

    try {
      setEnviando(true)
      const payload = {
        ...form,
        usuario_id: usuario?.id || null,
        productos: carrito.map((p) => ({ id: p.id, cantidad: p.cantidad }))
      }
      const { data } = await api.post('/pedidos', payload)
      vaciarCarrito()
      setMensaje(`Pedido ${data.pedido.codigo} registrado correctamente. Total: S/ ${Number(data.pedido.total).toFixed(2)}`)
      setTimeout(() => navigate('/'), 1800)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'No se pudo registrar el pedido.')
    } finally {
      setEnviando(false)
    }
  }

  if (carrito.length === 0 && !mensaje) {
    return (
      <div className="container py-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-primary mt-3">Volver a la tienda</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-2">Finalizar compra</h2>
              <p className="text-muted">Puedes comprar como invitado o iniciar sesión si deseas guardar tu historial.</p>

              {!usuario && (
                <div className="alert alert-info d-flex justify-content-between align-items-center gap-3">
                  <span>¿Ya tienes cuenta? Puedes iniciar sesión antes de comprar.</span>
                  <Link to="/login" className="btn btn-sm btn-primary">Ingresar</Link>
                </div>
              )}

              {mensaje && <div className="alert alert-success">{mensaje}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={confirmarPedido}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre completo</label>
                    <input className="form-control" value={form.nombre_cliente} onChange={(e) => actualizar('nombre_cliente', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Celular</label>
                    <input className="form-control" value={form.telefono} onChange={(e) => actualizar('telefono', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email opcional</label>
                    <input type="email" className="form-control" value={form.email_cliente} onChange={(e) => actualizar('email_cliente', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Tipo de entrega</label>
                    <div className="delivery-options">
                      <button type="button" className={`delivery-option ${form.tipo_entrega === 'DELIVERY' ? 'active' : ''}`} onClick={() => actualizar('tipo_entrega', 'DELIVERY')}>🚚 Delivery</button>
                      <button type="button" className={`delivery-option ${form.tipo_entrega === 'RECOJO' ? 'active' : ''}`} onClick={() => actualizar('tipo_entrega', 'RECOJO')}>🏪 Recojo en botica</button>
                    </div>
                  </div>

                  {form.tipo_entrega === 'DELIVERY' && (
                    <>
                      <div className="col-12">
                        <label className="form-label">Dirección</label>
                        <input className="form-control" value={form.direccion} onChange={(e) => actualizar('direccion', e.target.value)} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Referencia</label>
                        <input className="form-control" value={form.referencia} onChange={(e) => actualizar('referencia', e.target.value)} placeholder="Ej: Frente al parque" />
                      </div>
                    </>
                  )}
                </div>

                <button className="btn btn-primary btn-lg w-100 mt-4" disabled={enviando}>{enviando ? 'Registrando pedido...' : 'Confirmar pedido'}</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="summary-card shadow-sm">
            <h4 className="fw-bold mb-3">Resumen de compra</h4>
            {carrito.map((p) => (
              <div className="d-flex justify-content-between border-bottom py-2" key={p.id}>
                <span>{p.nombre} x{p.cantidad}</span>
                <strong>S/ {(Number(p.precio) * p.cantidad).toFixed(2)}</strong>
              </div>
            ))}
            <div className="d-flex justify-content-between fs-5 mt-3"><span>Total</span><strong>S/ {total.toFixed(2)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
