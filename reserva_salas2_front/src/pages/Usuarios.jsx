import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('danger')
  const [cargando, setCargando] = useState(true)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null)

  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario'
  })

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

  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      email: '',
      password: '',
      rol: 'usuario'
    })

    setModoEdicion(false)
    setUsuarioEditandoId(null)
  }

  const obtenerUsuarios = async () => {
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
        setMensaje(data.mensaje || 'No se pudieron cargar los usuarios')
        setTipoMensaje('danger')
        setCargando(false)
        return
      }

      const listaUsuarios = Array.isArray(data)
        ? data
        : data.data || data.usuarios || []

      setUsuarios(listaUsuarios)
      setCargando(false)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
      setCargando(false)
    }
  }

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    })
  }

  const guardarUsuario = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (
      formulario.nombre.trim() === '' ||
      formulario.email.trim() === '' ||
      formulario.rol.trim() === ''
    ) {
      setMensaje('Nombre, correo y rol son obligatorios')
      setTipoMensaje('danger')
      return
    }

    if (!modoEdicion && formulario.password.trim() === '') {
      setMensaje('La contraseña es obligatoria para crear un usuario')
      setTipoMensaje('danger')
      return
    }

    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      const datosEnviar = {
        nombre: formulario.nombre,
        email: formulario.email,
        rol: formulario.rol
      }

      if (formulario.password.trim() !== '') {
        datosEnviar.password = formulario.password
      }

      const url = modoEdicion
        ? `http://localhost:3000/api/usuarios/${usuarioEditandoId}`
        : 'http://localhost:3000/api/usuarios'

      const metodo = modoEdicion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: metodo,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosEnviar)
      })

      const data = await leerRespuesta(response)

      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        navigate('/login')
        return
      }

      if (!response.ok) {
        setMensaje(data.mensaje || 'No se pudo guardar el usuario')
        setTipoMensaje('danger')
        return
      }

      setMensaje(
        modoEdicion
          ? data.mensaje || 'Usuario actualizado correctamente'
          : data.mensaje || 'Usuario creado correctamente'
      )
      setTipoMensaje('success')

      limpiarFormulario()
      await obtenerUsuarios()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
    }
  }

  const prepararEdicion = (usuario) => {
    setFormulario({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      password: '',
      rol: usuario.rol || 'usuario'
    })

    setModoEdicion(true)
    setUsuarioEditandoId(usuario.id)
    setMensaje('')
    window.scrollTo(0, 0)
  }

  const eliminarUsuario = async (id) => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este usuario?'
    )

    if (!confirmar) {
      return
    }

    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const data = await leerRespuesta(response)

      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        navigate('/login')
        return
      }

      if (!response.ok) {
        setMensaje(data.mensaje || 'No se pudo eliminar el usuario')
        setTipoMensaje('danger')
        return
      }

      setMensaje(data.mensaje || 'Usuario eliminado correctamente')
      setTipoMensaje('success')

      await obtenerUsuarios()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
    }
  }

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="mb-3 text-center">Gestión de usuarios</h1>

      <p className="text-center">
         Administración de usuarios registrados en el sistema.
      </p>

      {mensaje && (
        <div className={`alert alert-${tipoMensaje} text-center`}>
          {mensaje}
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div
          className={
            modoEdicion
              ? 'card-header bg-warning text-dark text-center'
              : 'card-header bg-primary text-white text-center'
          }
        >
          {modoEdicion ? 'Editar usuario' : 'Crear nuevo usuario'}
        </div>

        <div className="card-body">
          <form onSubmit={guardarUsuario}>
            <div className="row">
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Nombre usuario"
                />
              </div>

              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formulario.email}
                  onChange={manejarCambio}
                  placeholder="correo@reservas.cl"
                />
              </div>

              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label">
                  Contraseña {modoEdicion && '(opcional)'}
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formulario.password}
                  onChange={manejarCambio}
                  placeholder={
                    modoEdicion
                      ? 'Dejar en blanco si no cambia'
                      : 'Contraseña'
                  }
                />
              </div>

              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label">Rol</label>
                <select
                  name="rol"
                  className="form-select"
                  value={formulario.rol}
                  onChange={manejarCambio}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              {modoEdicion && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              )}

              <button
                type="submit"
                className={
                  modoEdicion
                    ? 'btn btn-warning px-4'
                    : 'btn btn-success px-4'
                }
              >
                {modoEdicion ? 'Actualizar usuario' : 'Crear usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {cargando ? (
        <div className="alert alert-info text-center">
          Cargando usuarios...
        </div>
      ) : (
        <>
          <h4 className="mb-3">Listado de usuarios</h4>

          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>IDENTIFICACIÓN</th>
                  <th>Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.rol}</td>
                      <td>{usuario.estado}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => prepararEdicion(usuario)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarUsuario(usuario.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Usuarios