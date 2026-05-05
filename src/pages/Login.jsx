import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setCargando(true)
      const usuario = await login(email, password)

      if (usuario?.rol === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card shadow">
        <h2 className="fw-bold">Ingresar</h2>
        <p className="text-muted">Los clientes pueden comprar sin cuenta. El administrador entra a su panel interno.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={enviar}>
          <label className="form-label">Email</label>
          <input className="form-control mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="form-label">Contraseña</label>
          <input className="form-control mb-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn btn-primary w-100" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
        <p className="mt-3 mb-0 text-center">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        <div className="small text-muted mt-3">Admin prueba: admin@roluad.com / admin123</div>
      </div>
    </div>
  )
}
