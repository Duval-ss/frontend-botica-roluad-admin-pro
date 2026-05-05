import { useEffect, useMemo, useState } from 'react'
import api from '../../api/api'

const productoVacio = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '', categoria_id: '' }

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(productoVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargar = async () => {
    const [prod, cat] = await Promise.all([api.get('/productos'), api.get('/categorias')])
    setProductos(prod.data)
    setCategorias(cat.data)
  }

  useEffect(() => { cargar().catch(() => setError('No se pudieron cargar los productos.')) }, [])

  const actualizar = (campo, valor) => setForm({ ...form, [campo]: valor })

  const limpiar = () => {
    setForm(productoVacio)
    setEditandoId(null)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    const payload = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria_id: form.categoria_id || null,
      activo: 1
    }

    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, payload)
        setMensaje('Producto actualizado correctamente.')
      } else {
        await api.post('/productos', payload)
        setMensaje('Producto creado correctamente.')
      }
      limpiar()
      cargar()
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar el producto.')
    }
  }

  const editar = (p) => {
    setEditandoId(p.id)
    setForm({
      nombre: p.nombre || '',
      descripcion: p.descripcion || '',
      precio: p.precio || '',
      stock: p.stock || '',
      imagen: p.imagen || '',
      categoria_id: p.categoria_id || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminar = async (id) => {
    if (!confirm('¿Deseas desactivar este producto?')) return
    await api.delete(`/productos/${id}`)
    cargar()
  }

  const filtrados = useMemo(() => productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())), [productos, busqueda])

  return (
    <>
      <div className="mb-4">
        <h1 className="admin-title">Productos</h1>
        <p className="text-muted mb-0">Registra, edita y controla el stock del catálogo de la botica.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <div className="admin-card mb-4">
        <h4 className="mb-3">{editandoId ? 'Editar producto' : 'Nuevo producto'}</h4>
        <form onSubmit={guardar}>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Nombre</label><input className="form-control" value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} required /></div>
            <div className="col-md-3"><label className="form-label">Precio</label><input type="number" step="0.01" className="form-control" value={form.precio} onChange={(e) => actualizar('precio', e.target.value)} required /></div>
            <div className="col-md-3"><label className="form-label">Stock</label><input type="number" className="form-control" value={form.stock} onChange={(e) => actualizar('stock', e.target.value)} required /></div>
            <div className="col-md-6"><label className="form-label">Categoría</label><select className="form-select" value={form.categoria_id} onChange={(e) => actualizar('categoria_id', e.target.value)}><option value="">Sin categoría</option>{categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
            <div className="col-md-6"><label className="form-label">URL de imagen</label><input className="form-control" value={form.imagen} onChange={(e) => actualizar('imagen', e.target.value)} placeholder="https://..." /></div>
            <div className="col-12"><label className="form-label">Descripción</label><textarea className="form-control" rows="3" value={form.descripcion} onChange={(e) => actualizar('descripcion', e.target.value)} /></div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary">{editandoId ? 'Actualizar' : 'Guardar'}</button>
            {editandoId && <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
          <h4 className="mb-0">Listado de productos</h4>
          <input className="form-control admin-search" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="table-responsive">
          <table className="table align-middle admin-table">
            <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td><div className="d-flex align-items-center gap-2"><img className="admin-thumb" src={p.imagen || 'https://placehold.co/80'} alt={p.nombre} /><strong>{p.nombre}</strong></div></td>
                  <td>{p.categoria_nombre || 'Sin categoría'}</td>
                  <td>S/ {Number(p.precio).toFixed(2)}</td>
                  <td><span className={p.stock <= 5 ? 'badge text-bg-danger' : 'badge text-bg-success'}>{p.stock}</span></td>
                  <td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(p)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p.id)}>Desactivar</button></td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No hay productos.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
