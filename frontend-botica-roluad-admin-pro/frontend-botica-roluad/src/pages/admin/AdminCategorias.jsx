import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargar = async () => {
    const { data } = await api.get('/categorias')
    setCategorias(data)
  }

  useEffect(() => { cargar().catch(() => setError('No se pudieron cargar las categorías.')) }, [])

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    try {
      if (editandoId) {
        await api.put(`/categorias/${editandoId}`, { nombre })
        setMensaje('Categoría actualizada.')
      } else {
        await api.post('/categorias', { nombre })
        setMensaje('Categoría creada.')
      }
      setNombre('')
      setEditandoId(null)
      cargar()
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar la categoría.')
    }
  }

  const editar = (c) => {
    setEditandoId(c.id)
    setNombre(c.nombre)
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar categoría? No se podrá si tiene productos asociados.')) return
    try {
      await api.delete(`/categorias/${id}`)
      cargar()
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar la categoría.')
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="admin-title">Categorías</h1>
        <p className="text-muted mb-0">Organiza el catálogo de productos de la botica.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="admin-card">
            <h4>{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h4>
            <form onSubmit={guardar} className="mt-3">
              <label className="form-label">Nombre</label>
              <input className="form-control mb-3" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              <button className="btn btn-primary me-2">{editandoId ? 'Actualizar' : 'Guardar'}</button>
              {editandoId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditandoId(null); setNombre('') }}>Cancelar</button>}
            </form>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="admin-card">
            <h4 className="mb-3">Listado</h4>
            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
                <tbody>
                  {categorias.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td className="fw-bold">{c.nombre}</td>
                      <td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(c)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c.id)}>Eliminar</button></td>
                    </tr>
                  ))}
                  {categorias.length === 0 && <tr><td colSpan="3" className="text-center text-muted py-4">No hay categorías.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
