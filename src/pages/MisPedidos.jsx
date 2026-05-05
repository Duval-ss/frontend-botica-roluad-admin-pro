import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function MisPedidos() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!usuario) return
    api.get('/pedidos/mis-pedidos').then((res) => setPedidos(res.data)).catch(() => setError('No se pudieron cargar tus pedidos'))
  }, [usuario])

  if (!usuario) {
    return (
      <div className="container py-5 text-center">
        <h2>Inicia sesión para ver tus pedidos</h2>
        <p className="text-muted">Las compras como invitado solo muestran confirmación al finalizar.</p>
        <Link to="/login" className="btn btn-primary">Ingresar</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Mis pedidos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead><tr><th>Código</th><th>Entrega</th><th>Estado</th><th>Total</th><th>Fecha</th></tr></thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td><td>{p.tipo_entrega}</td><td><span className="badge bg-primary">{p.estado}</span></td><td>S/ {Number(p.total).toFixed(2)}</td><td>{new Date(p.creado_en).toLocaleString()}</td>
                </tr>
              ))}
              {pedidos.length === 0 && <tr><td colSpan="5" className="text-center py-4 text-muted">Aún no tienes pedidos.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
