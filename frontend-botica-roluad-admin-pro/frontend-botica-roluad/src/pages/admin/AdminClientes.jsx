import { useEffect, useMemo, useState } from 'react'
import api from '../../api/api'

export default function AdminClientes() {
  const [pedidos, setPedidos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/pedidos/admin')
      .then((res) => setPedidos(res.data))
      .catch(() => setError('No se pudieron cargar los clientes.'))
  }, [])

  const clientes = useMemo(() => {
    const mapa = new Map()
    pedidos.forEach((p) => {
      const clave = p.email_cliente || p.telefono || p.nombre_cliente
      const actual = mapa.get(clave) || {
        nombre: p.nombre_cliente,
        email: p.email_cliente || 'Invitado / sin email',
        telefono: p.telefono,
        pedidos: 0,
        total: 0,
        ultimaCompra: p.creado_en
      }
      actual.pedidos += 1
      actual.total += Number(p.total || 0)
      if (new Date(p.creado_en) > new Date(actual.ultimaCompra)) actual.ultimaCompra = p.creado_en
      mapa.set(clave, actual)
    })
    return [...mapa.values()]
  }, [pedidos])

  const filtrados = clientes.filter((c) => `${c.nombre} ${c.email} ${c.telefono}`.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <>
      <div className="mb-4">
        <h1 className="admin-title">Clientes</h1>
        <p className="text-muted mb-0">Vista general de clientes registrados e invitados según pedidos.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-card mb-4">
        <input className="form-control" placeholder="Buscar cliente por nombre, email o teléfono..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="table align-middle admin-table">
            <thead><tr><th>Cliente</th><th>Email</th><th>Teléfono</th><th>Pedidos</th><th>Total comprado</th><th>Última compra</th></tr></thead>
            <tbody>
              {filtrados.map((c, i) => (
                <tr key={`${c.telefono}-${i}`}>
                  <td className="fw-bold">{c.nombre}</td>
                  <td>{c.email}</td>
                  <td>{c.telefono}</td>
                  <td>{c.pedidos}</td>
                  <td>S/ {c.total.toFixed(2)}</td>
                  <td>{new Date(c.ultimaCompra).toLocaleString()}</td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No hay clientes para mostrar.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
