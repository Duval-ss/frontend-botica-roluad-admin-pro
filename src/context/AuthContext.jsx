import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const data = localStorage.getItem('usuario')
    return data ? JSON.parse(data) : null
  })

  useEffect(() => {
    if (usuario) localStorage.setItem('usuario', JSON.stringify(usuario))
    else localStorage.removeItem('usuario')
  }, [usuario])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setUsuario(data.usuario)
    return data.usuario
  }

  const registrar = async (payload) => {
    return api.post('/auth/registrar', payload)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  const value = useMemo(() => ({ usuario, login, registrar, logout }), [usuario])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
