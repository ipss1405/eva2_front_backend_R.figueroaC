import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function UsuariosInactivos() {
  const [usuariosInactivos, setUsuariosInactivos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const navigate = useNavigate()

  const leerRespuesta = async (response) => {
    const texto = await response.text()

    if (!texto) {
      return {}
    }

    try {
      return JSON.parse(texto)
    } catch (error) {
      return {}
    }
  }

  const obtenerToken = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return null
    }

    return token
  }

  const obtenerUsuariosInactivos = async () => {
    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      setCargando(true)

      const response = await fetch(
        `http://localhost:3000/api/usuarios?t=${Date.now()}`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await leerRespuesta(response)

      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        navigate('/login')
        return
      }

      if (!response.ok) {
        setMensaje(data.mensaje || 'No se pudieron cargar los usuarios inactivos')
        setCargando(false)
        return
      }

      const listaUsuarios = Array.isArray(data)
        ? data
        : data.data || data.usuarios || []

      const inactivos = listaUsuarios.filter(
        (usuario) => String(usuario.estado).toLowerCase() === 'inactivo'
      )

      setUsuariosInactivos(inactivos)
      setCargando(false)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerUsuariosInactivos()
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">Usuarios inactivos</h1>


      <div className="alert alert-secondary text-center">
        Usuarios desactivados que se mantienen registrados para 
        control interno del sistema.
      </div>

      {mensaje && (
        <div className="alert alert-danger text-center">
          {mensaje}
        </div>
      )}

      {cargando ? (
        <div className="alert alert-info text-center">
          Cargando usuarios inactivos...
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-secondary">
              <tr>
                <th>IDENTIFICACIÓN</th>
                <th>Nombre</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {usuariosInactivos.length > 0 ? (
                usuariosInactivos.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {usuario.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay usuarios inactivos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UsuariosInactivos