import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const navigate = useNavigate()
  const { registrar } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '', direccion: '' })
  const [error, setError] = useState('')

  const actualizar = (campo, valor) => setForm({ ...form, [campo]: valor })

  const enviar = async (e) => {
    e.preventDefault()
    try {
      setError('')
      await registrar(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo registrar')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card shadow">
        <h2 className="fw-bold">Crear cuenta</h2>
        <p className="text-muted">Crea tu cuenta para ver tu historial de pedidos.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={enviar}>
          <input className="form-control mb-3" placeholder="Nombre" value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
          <input className="form-control mb-3" type="email" placeholder="Email" value={form.email} onChange={(e) => actualizar('email', e.target.value)} />
          <input className="form-control mb-3" type="password" placeholder="Contraseña" value={form.password} onChange={(e) => actualizar('password', e.target.value)} />
          <input className="form-control mb-3" placeholder="Teléfono" value={form.telefono} onChange={(e) => actualizar('telefono', e.target.value)} />
          <input className="form-control mb-3" placeholder="Dirección opcional" value={form.direccion} onChange={(e) => actualizar('direccion', e.target.value)} />
          <button className="btn btn-primary w-100">Registrarme</button>
        </form>
        <p className="mt-3 mb-0 text-center">¿Ya tienes cuenta? <Link to="/login">Ingresar</Link></p>
      </div>
    </div>
  )
}
