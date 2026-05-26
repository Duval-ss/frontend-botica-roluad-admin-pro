import { useCarrito } from '../context/CarritoContext'

export default function ProductoCard({ producto }) {
  const { agregarProducto } = useCarrito()
  const sinStock = producto.stock <= 0

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <div className="product-card card h-100 border-0 shadow-sm">
        <div className="product-img-wrap">
          <img src={producto.imagen || 'https://placehold.co/500x350?text=Botica+ROLUAD'} alt={producto.nombre} className="product-img" />
          <span className="badge bg-light text-primary product-category">{producto.categoria_nombre || 'Botica'}</span>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="product-title">{producto.nombre}</h5>
          <p className="text-muted small flex-grow-1">{producto.descripcion}</p>
          <div className="d-flex align-items-end justify-content-between mb-3">
            <div>
              <div className="price">S/ {Number(producto.precio).toFixed(2)}</div>
              <small className={sinStock ? 'text-danger' : 'text-success'}>{sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}</small>
            </div>
          </div>
          <button className="btn btn-primary w-100" disabled={sinStock} onClick={() => agregarProducto(producto)}>
            {sinStock ? 'No disponible' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
