import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function Login() {
  const [email, setEmail] = useState('admin@reservas.cl')
  const [password, setPassword] = useState('admin123')
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (email.trim() === '' || password.trim() === '') {
      setMensaje('Debe ingresar correo y contraseña')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMensaje(data.mensaje || 'Credenciales incorrectas')
        return
      }

      const token = data.token || data.accessToken

      if (!token) {
        setMensaje('El backend no devolvió token')
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem(
        'usuario',
        JSON.stringify(data.usuario || data.user || {})
      )

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo conectar con el backend')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
            <div className="p-4">
              <img
                src={logo}
                alt="Logo institucional"
                className="img-fluid mb-4"
                style={{ maxWidth: '220px' }}
              />

              <h1 className="fw-bold mb-3">
                Sistema de Reservas de Salas IPSS
              </h1>

              <p className="fs-5 text-secondary">
                Plataforma administrativa para gestionar usuarios, salas y reservas
                de forma centralizada.
              </p>

              <div className="alert alert-primary mt-4">
                Acceso exclusivo para usuarios autorizados del sistema.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-header bg-primary text-white text-center py-3">
                <h4 className="mb-0">Panel Administrativo</h4>
              </div>

              <div className="card-body p-4">
                <h5 className="text-center mb-4">Inicio de sesión</h5>

                {mensaje && (
                  <div className="alert alert-danger text-center">
                    {mensaje}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Ingresar al sistema
                  </button>
                </form>
              </div>

              <div className="card-footer text-center text-muted small">
                Sistema Privado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login