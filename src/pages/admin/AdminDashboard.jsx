import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const [dash, ped] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/pedidos/admin')
        ])
        setStats(dash.data)
        setPedidos(ped.data.slice(0, 5))
      } catch (err) {
        setError('No se pudo cargar el dashboard. Verifica el backend y el token del administrador.')
      }
    }
    cargar()
  }, [])

  return (
    <>
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <h1 className="admin-title">Dashboard</h1>
          <p className="text-muted mb-0">Resumen general de ventas, pedidos, productos y clientes.</p>
        </div>
        <Link to="/admin/productos" className="btn btn-primary align-self-start">+ Nuevo producto</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3"><div className="admin-kpi"><span>Productos activos</span><strong>{stats?.productos ?? '...'}</strong><small>Catálogo disponible</small></div></div>
        <div className="col-md-6 col-xl-3"><div className="admin-kpi"><span>Pedidos</span><strong>{stats?.pedidos ?? '...'}</strong><small>Registrados en el sistema</small></div></div>
        <div className="col-md-6 col-xl-3"><div className="admin-kpi"><span>Clientes</span><strong>{stats?.usuarios ?? '...'}</strong><small>Usuarios registrados</small></div></div>
        <div className="col-md-6 col-xl-3"><div className="admin-kpi"><span>Ventas</span><strong>S/ {stats ? Number(stats.ventas).toFixed(2) : '...'}</strong><small>No incluye cancelados</small></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="admin-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Pedidos recientes</h4>
              <Link to="/admin/pedidos" className="btn btn-sm btn-outline-primary">Ver todos</Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead><tr><th>Código</th><th>Cliente</th><th>Entrega</th><th>Estado</th><th>Total</th></tr></thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.codigo}</td>
                      <td>{p.nombre_cliente}</td>
                      <td>{p.tipo_entrega}</td>
                      <td><span className="badge text-bg-info">{p.estado}</span></td>
                      <td>S/ {Number(p.total).toFixed(2)}</td>
                    </tr>
                  ))}
                  {pedidos.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No hay pedidos recientes.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="admin-card h-100">
            <h4>Accesos rápidos</h4>
            <div className="d-grid gap-2 mt-3">
              <Link className="btn btn-outline-primary" to="/admin/productos">Gestionar productos</Link>
              <Link className="btn btn-outline-success" to="/admin/pedidos">Controlar pedidos</Link>
              <Link className="btn btn-outline-dark" to="/admin/clientes">Ver clientes</Link>
              <Link className="btn btn-outline-secondary" to="/admin/categorias">Categorías</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
