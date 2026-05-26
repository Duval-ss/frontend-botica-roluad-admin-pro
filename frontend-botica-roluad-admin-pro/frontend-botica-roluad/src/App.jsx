import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Registro from './pages/Registro'
import MisPedidos from './pages/MisPedidos'
import { useAuth } from './context/AuthContext'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductos from './pages/admin/AdminProductos'
import AdminPedidos from './pages/admin/AdminPedidos'
import AdminClientes from './pages/admin/AdminClientes'
import AdminCategorias from './pages/admin/AdminCategorias'

function AdminRoute({ children }) {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/login" replace />
  if (usuario.rol !== 'ADMIN') return <Navigate to="/" replace />

  return children
}

function AppShell() {
  const location = useLocation()
  const esAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!esAdmin && <Navbar />}

      <main>
        <Routes>
          {/* TIENDA / CLIENTE */}
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />

          {/* ADMINISTRADOR */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="categorias" element={<AdminCategorias />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!esAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
