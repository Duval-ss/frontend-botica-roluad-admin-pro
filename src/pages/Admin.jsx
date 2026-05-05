import { useEffect, useState } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { usuario } = useAuth()
  const [stats, setStats] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const [dash, ped] = await Promise.all([api.get('/admin/dashboard'), api.get('/pedidos/admin')])
      setStats(dash.data)
      setPedidos(ped.data)
    } catch (err) {
      setError('No tienes acceso o el backend no está disponible')
    }
  }

  useEffect(() => { if (usuario?.rol === 'ADMIN') cargar() }, [usuario])

  const cambiarEstado = async (id, estado) => {
    await api.patch(`/pedidos/${id}/estado`, { estado })
    cargar()
  }

  if (!usuario || usuario.rol !== 'ADMIN') {
    return <div className="container py-5 text-center"><h2>Acceso solo para administrador</h2></div>
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Panel administrador</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3"><div className="admin-stat">Productos<strong>{stats.productos}</strong></div></div>
          <div className="col-md-3"><div className="admin-stat">Pedidos<strong>{stats.pedidos}</strong></div></div>
          <div className="col-md-3"><div className="admin-stat">Clientes<strong>{stats.usuarios}</strong></div></div>
          <div className="col-md-3"><div className="admin-stat">Ventas<strong>S/ {stats.ventas.toFixed(2)}</strong></div></div>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-3">Pedidos recientes</h4>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Código</th><th>Cliente</th><th>Entrega</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td><td>{p.nombre_cliente}</td><td>{p.tipo_entrega}</td><td>S/ {Number(p.total).toFixed(2)}</td>
                    <td>
                      <select className="form-select form-select-sm" value={p.estado} onChange={(e) => cambiarEstado(p.id, e.target.value)}>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="PREPARANDO">PREPARANDO</option>
                        <option value="EN_CAMINO">EN_CAMINO</option>
                        <option value="LISTO_RECOJO">LISTO_RECOJO</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
