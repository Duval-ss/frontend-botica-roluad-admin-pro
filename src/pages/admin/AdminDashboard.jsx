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
      <div className="admin-hero mb-4">
        <div>
          <span className="admin-hero-badge">Panel administrativo</span>
          <h1>Dashboard Botica ROLUAD</h1>
          <p>Controla ventas, pedidos, productos y clientes desde un solo lugar.</p>
        </div>

        <Link to="/admin/productos" className="btn btn-light fw-bold">
          + Nuevo producto
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="admin-kpi admin-kpi-green">
            <div className="admin-kpi-icon">📦</div>
            <span>Productos activos</span>
            <strong>{stats?.productos ?? '...'}</strong>
            <small>Catálogo disponible</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-kpi admin-kpi-blue">
            <div className="admin-kpi-icon">🧾</div>
            <span>Pedidos</span>
            <strong>{stats?.pedidos ?? '...'}</strong>
            <small>Registrados en el sistema</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-kpi admin-kpi-purple">
            <div className="admin-kpi-icon">👥</div>
            <span>Clientes</span>
            <strong>{stats?.usuarios ?? '...'}</strong>
            <small>Usuarios registrados</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-kpi admin-kpi-orange">
            <div className="admin-kpi-icon">💰</div>
            <span>Ventas</span>
            <strong>S/ {stats ? Number(stats.ventas).toFixed(2) : '...'}</strong>
            <small>No incluye cancelados</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="admin-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-0">Pedidos recientes</h4>
                <small className="text-muted">Últimos pedidos registrados por los clientes</small>
              </div>

              <Link to="/admin/pedidos" className="btn btn-sm btn-outline-primary">
                Ver todos
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Entrega</th>
                    <th>Estado</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.codigo}</td>
                      <td>{p.nombre_cliente}</td>
                      <td>
                        <span className="admin-chip">
                          {p.tipo_entrega === 'DELIVERY' ? '🚚 Delivery' : '🏪 Recojo'}
                        </span>
                      </td>
                      <td>
                        <span className={`estado-badge estado-${String(p.estado).toLowerCase()}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="fw-bold">S/ {Number(p.total).toFixed(2)}</td>
                    </tr>
                  ))}

                  {pedidos.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No hay pedidos recientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="admin-card h-100">
            <h4>Accesos rápidos</h4>
            <p className="text-muted small">Gestiona las áreas principales del sistema.</p>

            <div className="admin-quick-links mt-3">
              <Link to="/admin/productos">
                <span>📦</span>
                <div>
                  <strong>Gestionar productos</strong>
                  <small>Stock, precios e imágenes</small>
                </div>
              </Link>

              <Link to="/admin/pedidos">
                <span>🧾</span>
                <div>
                  <strong>Controlar pedidos</strong>
                  <small>Estados y entregas</small>
                </div>
              </Link>

              <Link to="/admin/clientes">
                <span>👥</span>
                <div>
                  <strong>Ver clientes</strong>
                  <small>Datos y compras</small>
                </div>
              </Link>

              <Link to="/admin/categorias">
                <span>🏷️</span>
                <div>
                  <strong>Categorías</strong>
                  <small>Organización del catálogo</small>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}