import { useEffect, useMemo, useState } from 'react'
import api from '../api/api'
import ProductoCard from '../components/ProductoCard'

export default function Home() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [prodRes, catRes] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias')
      ])
      setProductos(prodRes.data)
      setCategorias(catRes.data)
    } catch (err) {
      setError('No se pudo conectar con el backend. Verifica que esté corriendo en el puerto 3000.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarDatos() }, [])

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || String(p.descripcion || '').toLowerCase().includes(busqueda.toLowerCase())
      const coincideCategoria = categoria ? Number(p.categoria_id) === Number(categoria) : true
      return coincideBusqueda && coincideCategoria
    })
  }, [productos, busqueda, categoria])

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="hero-pill">Compra online fácil y segura</span>
              <h1 className="display-5 fw-bold mt-3">Tu botica de confianza, ahora en línea</h1>
              <p className="lead text-muted mt-3">Agrega tus productos al carrito, compra como invitado o inicia sesión al finalizar. Elige delivery o recojo en botica.</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#productos" className="btn btn-primary btn-lg">Ver productos</a>
                <a href="#beneficios" className="btn btn-outline-primary btn-lg">Beneficios</a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-card shadow-lg">
                <div className="hero-emoji">💊</div>
                <h4 className="fw-bold">Delivery o recojo</h4>
                <p className="mb-0 text-muted">Pensado para una experiencia rápida, clara y cómoda para el cliente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="container my-5">
        <div className="row g-3">
          <div className="col-md-4"><div className="benefit-card">🚚 <strong>Delivery</strong><span>Recibe tu pedido en casa.</span></div></div>
          <div className="col-md-4"><div className="benefit-card">🏪 <strong>Recojo</strong><span>Compra y recoge en botica.</span></div></div>
          <div className="col-md-4"><div className="benefit-card">🔐 <strong>Compra flexible</strong><span>Con cuenta o como invitado.</span></div></div>
        </div>
      </section>

      <section id="productos" className="container my-5">
        <div className="section-header mb-4">
          <div>
            <h2 className="fw-bold mb-1">Productos disponibles</h2>
            <p className="text-muted mb-0">Busca medicamentos, vitaminas y productos de cuidado personal.</p>
          </div>
        </div>

        <div className="filter-box shadow-sm mb-4">
          <div className="row g-3">
            <div className="col-md-8">
              <input className="form-control form-control-lg" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select form-select-lg" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-warning">{error}</div>}
        {cargando ? <div className="text-center py-5">Cargando productos...</div> : (
          <div className="row g-4">
            {productosFiltrados.map((producto) => <ProductoCard key={producto.id} producto={producto} />)}
            {productosFiltrados.length === 0 && <div className="col-12"><div className="empty-state">No encontramos productos con esos filtros.</div></div>}
          </div>
        )}
      </section>
    </>
  )
}
