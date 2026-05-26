    import { useEffect, useMemo, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import api from '../api/api'
    import ProductoCard from '../components/ProductoCard'
    import heroVideo from '../assets/videos/Farmacia.mp4'

    export default function Home() {
      const [productos, setProductos] = useState([])
      const [categorias, setCategorias] = useState([])
      const [busqueda, setBusqueda] = useState('')
      const [categoria, setCategoria] = useState('')
      const [cargando, setCargando] = useState(true)
      const [error, setError] = useState('')
      const [searchParams] = useSearchParams()

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

      useEffect(() => {
        cargarDatos()
      }, [])

      useEffect(() => {
        const buscar = searchParams.get('buscar') || ''
        setBusqueda(buscar)
      }, [searchParams])

      const productosFiltrados = useMemo(() => {
        return productos.filter((p) => {
          const textoBusqueda = busqueda.toLowerCase()

          const coincideBusqueda =
            p.nombre.toLowerCase().includes(textoBusqueda) ||
            String(p.descripcion || '').toLowerCase().includes(textoBusqueda)

          const coincideCategoria = categoria
            ? Number(p.categoria_id) === Number(categoria)
            : true

          return coincideBusqueda && coincideCategoria
        })
      }, [productos, busqueda, categoria])

      return (
        <>
          <section className="hero-section position-relative overflow-hidden">
            <video className="hero-video" autoPlay muted loop playsInline>
              <source src={heroVideo} type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="container position-relative hero-content">
              <div className="row align-items-center g-5">
                <div className="col-lg-7">
                  <span className="hero-pill">
                    💚 Tu salud más cerca de ti
                  </span>

                  <h1 className="display-4 fw-bold mt-3">
                    Todo lo que necesitas para tu bienestar, en un solo lugar
                  </h1>

                  <p className="lead mt-3">
                    Compra medicamentos, vitaminas y productos de cuidado personal desde casa.
                    Sin colas, sin esperas y con delivery rápido hasta tu puerta.
                  </p>

                  <div className="d-flex flex-wrap gap-3 mt-4">
                    <a href="#productos" className="btn btn-primary btn-lg">
                      Comprar ahora
                    </a>

                    <a href="#promos" className="btn btn-outline-light btn-lg">
                      Ver promociones
                    </a>
                  </div>

                  <div className="hero-trust mt-4">
                    <div>
                      <strong>🚚 Delivery rápido</strong>
                      <span>Recibe tu pedido sin salir de casa</span>
                    </div>

                    <div>
                      <strong>💊 Productos confiables</strong>
                      <span>Medicinas y cuidado personal para toda la familia</span>
                    </div>

                    <div>
                      <strong>🛒 Compra fácil</strong>
                      <span>Haz tu pedido en pocos minutos</span>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="hero-sale-card">
                    <span>Oferta destacada</span>
                    <h3>Hasta 30% en productos seleccionados</h3>
                    <p>Vitaminas, cuidado personal y productos para el hogar.</p>
                    <a href="#productos" className="btn btn-warning fw-bold">
                      Ver ofertas
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container quick-categories my-5">
            <div className="quick-category-card">💊 Medicamentos</div>
            <div className="quick-category-card">🌿 Vitaminas</div>
            <div className="quick-category-card">👶 Bebés</div>
            <div className="quick-category-card">🧴 Cuidado personal</div>
            <div className="quick-category-card">🩺 Primeros auxilios</div>
            <div className="quick-category-card">🎁 Promociones</div>
          </section>

          <section id="promos" className="container my-5">
            <div id="promoCarousel" className="carousel slide promo-carousel" data-bs-ride="carousel">

              <div className="carousel-indicators">
                <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="0" className="active"></button>
                <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="2"></button>
              </div>

              <div className="carousel-inner">

                <div className="carousel-item active">
                  <div className="promo-slide">
                    <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1400" alt="Medicamentos" />

                    <div className="promo-slide-content">
                      <span>OFERTA DEL DÍA</span>
                      <h2>Medicamentos esenciales con descuento</h2>
                      <p>Encuentra productos para cuidar tu salud y la de tu familia.</p>
                      <a href="#productos">Comprar ahora</a>
                    </div>
                  </div>
                </div>

                <div className="carousel-item">
                  <div className="promo-slide">
                    <img src="https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1400" alt="Vitaminas" />

                    <div className="promo-slide-content">
                      <span>VITAMINAS</span>
                      <h2>Refuerza tus defensas todos los días</h2>
                      <p>Vitaminas y suplementos para tu bienestar diario.</p>
                      <a href="#productos">Ver productos</a>
                    </div>
                  </div>
                </div>

                <div className="carousel-item">
                  <div className="promo-slide">
                    <img src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=1400" alt="Delivery botica" />

                    <div className="promo-slide-content">
                      <span>DELIVERY</span>
                      <h2>Recibe tu pedido sin salir de casa</h2>
                      <p>Compra online y elige delivery o recojo en botica.</p>
                      <a href="#productos">Pedir ahora</a>
                    </div>
                  </div>
                </div>

              </div>

              <button className="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>

              <button className="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>

            </div>
          </section>
          <section id="beneficios" className="container my-5">
            <div className="section-header mb-4">
              <div>
                <h2 className="fw-bold mb-1">Pensado para comprar fácil</h2>
                <p className="text-muted mb-0">
                  Una experiencia simple para que encuentres lo que necesitas sin complicarte.
                </p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="benefit-card">
                  <div className="benefit-icon">🚚</div>
                  <div>
                    <strong>Delivery</strong>
                    <span>Recibe tu pedido en casa con datos claros de contacto.</span>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="benefit-card">
                  <div className="benefit-icon">🏪</div>
                  <div>
                    <strong>Recojo en botica</strong>
                    <span>Compra online y pasa a recoger cuando esté listo.</span>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="benefit-card">
                  <div className="benefit-icon">🔐</div>
                  <div>
                    <strong>Compra flexible</strong>
                    <span>Haz tu pedido con cuenta o como invitado.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="productos" className="container my-5">
            <div className="section-header mb-4">
              <div>
                <h2 className="fw-bold mb-1">Productos disponibles</h2>
                <p className="text-muted mb-0">
                  Busca medicamentos, vitaminas y productos de cuidado personal.
                </p>
              </div>
            </div>

            <div className="filter-box shadow-sm mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <input
                    className="form-control form-control-lg"
                    placeholder="¿Qué producto estás buscando?"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select form-select-lg"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-warning">{error}</div>}

            {cargando ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-muted">Cargando productos de la botica...</p>
              </div>
            ) : (
              <div className="row g-4">
                {productosFiltrados.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}

                {productosFiltrados.length === 0 && (
                  <div className="col-12">
                    <div className="empty-state">
                      No encontramos productos con esos filtros. Prueba con otro nombre o categoría.
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      ) 
    }