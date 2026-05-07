import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Usuarios from './pages/Usuarios.jsx'
import UsuariosInactivos from './pages/UsuariosInactivos.jsx'
import Salas from './pages/Salas.jsx'
import Reservas from './pages/Reservas.jsx'

function App() {
  const location = useLocation()

  // En la pantalla de login no se muestra el Navbar
  const esLogin = location.pathname === '/login'

  return (
    <>
      {!esLogin && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios-inactivos" element={<UsuariosInactivos />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </>
  )
}

export default App