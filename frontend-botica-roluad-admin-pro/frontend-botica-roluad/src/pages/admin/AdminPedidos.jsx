import { useEffect, useMemo, useState } from 'react'
import api from '../../api/api'

const estados = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'LISTO_RECOJO', 'ENTREGADO', 'CANCELADO']

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const { data } = await api.get('/pedidos/admin')
      setPedidos(data)
    } catch (err) {
      setError('No se pudieron cargar los pedidos.')
    }
  }

  useEffect(() => { cargar() }, [])

  const cambiarEstado = async (id, nuevoEstado) => {
    await api.patch(`/pedidos/${id}/estado`, { estado: nuevoEstado })
    cargar()
  }

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const texto = `${p.codigo} ${p.nombre_cliente} ${p.telefono} ${p.tipo_entrega}`.toLowerCase()
      const coincideBusqueda = texto.includes(busqueda.toLowerCase())
      const coincideEstado = estado ? p.estado === estado : true
      return coincideBusqueda && coincideEstado
    })
  }, [pedidos, busqueda, estado])

  return (
    <>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="admin-title">Pedidos</h1>
          <p className="text-muted mb-0">Controla el estado de los pedidos de delivery y recojo.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-card mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <input className="form-control" placeholder="Buscar por código, cliente o teléfono..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {estados.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="table align-middle admin-table">
            <thead>
              <tr><th>Código</th><th>Cliente</th><th>Teléfono</th><th>Entrega</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.codigo}</td>
                  <td>{p.nombre_cliente}</td>
                  <td>{p.telefono}</td>
                  <td><span className="badge text-bg-light">{p.tipo_entrega}</span></td>
                  <td>S/ {Number(p.total).toFixed(2)}</td>
                  <td style={{ minWidth: 165 }}>
                    <select className="form-select form-select-sm" value={p.estado} onChange={(e) => cambiarEstado(p.id, e.target.value)}>
                      {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </td>
                  <td>{new Date(p.creado_en).toLocaleString()}</td>
                </tr>
              ))}
              {pedidosFiltrados.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No hay pedidos con esos filtros.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
