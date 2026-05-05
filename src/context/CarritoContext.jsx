import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const data = localStorage.getItem('carrito_roluad')
    return data ? JSON.parse(data) : []
  })

  useEffect(() => {
    localStorage.setItem('carrito_roluad', JSON.stringify(carrito))
  }, [carrito])

  const agregarProducto = (producto) => {
    setCarrito((actual) => {
      const existe = actual.find((p) => p.id === producto.id)
      if (existe) {
        return actual.map((p) => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      }
      return [...actual, { ...producto, cantidad: 1 }]
    })
  }

  const cambiarCantidad = (id, cantidad) => {
    const nuevaCantidad = Math.max(1, Number(cantidad))
    setCarrito((actual) => actual.map((p) => p.id === id ? { ...p, cantidad: nuevaCantidad } : p))
  }

  const eliminarProducto = (id) => setCarrito((actual) => actual.filter((p) => p.id !== id))
  const vaciarCarrito = () => setCarrito([])

  const total = carrito.reduce((acc, p) => acc + Number(p.precio) * Number(p.cantidad), 0)
  const cantidadTotal = carrito.reduce((acc, p) => acc + Number(p.cantidad), 0)

  const value = useMemo(() => ({
    carrito,
    agregarProducto,
    cambiarCantidad,
    eliminarProducto,
    vaciarCarrito,
    total,
    cantidadTotal
  }), [carrito, total, cantidadTotal])

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
}

export const useCarrito = () => useContext(CarritoContext)
