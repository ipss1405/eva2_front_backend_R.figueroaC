import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Salas() {
  const [salas, setSalas] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('danger')
  const [cargando, setCargando] = useState(true)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [salaEditandoId, setSalaEditandoId] = useState(null)

  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({
    nombre: '',
    capacidad: '',
    ubicacion: '',
    estado: 'disponible'
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
      capacidad: '',
      ubicacion: '',
      estado: 'disponible'
    })

    setModoEdicion(false)
    setSalaEditandoId(null)
  }

  const obtenerSalas = async () => {
    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      setCargando(true)

      const response = await fetch(
        `http://localhost:3000/api/salas?t=${Date.now()}`,
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
        setMensaje(data.mensaje || 'No se pudieron cargar las salas')
        setTipoMensaje('danger')
        setCargando(false)
        return
      }

      const listaSalas = Array.isArray(data)
        ? data
        : data.data || data.salas || []

      setSalas(listaSalas)
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

  const guardarSala = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (
      formulario.nombre.trim() === '' ||
      formulario.capacidad.toString().trim() === '' ||
      formulario.ubicacion.trim() === '' ||
      formulario.estado.trim() === ''
    ) {
      setMensaje('Todos los campos son obligatorios')
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
        capacidad: Number(formulario.capacidad),
        ubicacion: formulario.ubicacion,
        estado: formulario.estado
      }

      const url = modoEdicion
        ? `http://localhost:3000/api/salas/${salaEditandoId}`
        : 'http://localhost:3000/api/salas'

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
        setMensaje(data.mensaje || 'No se pudo guardar la sala')
        setTipoMensaje('danger')
        return
      }

      setMensaje(
        modoEdicion
          ? data.mensaje || 'Sala actualizada correctamente'
          : data.mensaje || 'Sala creada correctamente'
      )
      setTipoMensaje('success')

      limpiarFormulario()
      await obtenerSalas()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
    }
  }

  const prepararEdicion = (sala) => {
    setFormulario({
      nombre: sala.nombre || '',
      capacidad: sala.capacidad || '',
      ubicacion: sala.ubicacion || '',
      estado: sala.estado || 'disponible'
    })

    setModoEdicion(true)
    setSalaEditandoId(sala.id)
    setMensaje('')
    window.scrollTo(0, 0)
  }

  const eliminarSala = async (id) => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar esta sala?'
    )

    if (!confirmar) {
      return
    }

    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/salas/${id}`, {
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
        setMensaje(data.mensaje || 'No se pudo eliminar la sala')
        setTipoMensaje('danger')
        return
      }

      setMensaje(data.mensaje || 'Sala eliminada correctamente')
      setTipoMensaje('success')

      await obtenerSalas()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
    }
  }

  useEffect(() => {
    obtenerSalas()
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">Gestión de salas</h1>

      <p className="text-center">
        Crear, listar, actualizar y eliminar salas disponibles para reservas.
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
          {modoEdicion ? 'Editar sala' : 'Crear nueva sala'}
        </div>

        <div className="card-body">
          <form onSubmit={guardarSala}>
            <div className="row">
              <div className="col-12 col-md-3 mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Sala de reuniones"
                />
              </div>

              <div className="col-12 col-md-2 mb-3">
                <label className="form-label">Capacidad</label>
                <input
                  type="number"
                  name="capacidad"
                  className="form-control"
                  value={formulario.capacidad}
                  onChange={manejarCambio}
                  placeholder="10"
                />
              </div>

              <div className="col-12 col-md-3 mb-3">
                <label className="form-label">Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  className="form-control"
                  value={formulario.ubicacion}
                  onChange={manejarCambio}
                  placeholder="Primer piso"
                />
              </div>

              <div className="col-12 col-md-2 mb-3">
                <label className="form-label">Estado</label>
                <select
                  name="estado"
                  className="form-select"
                  value={formulario.estado}
                  onChange={manejarCambio}
                >
                  <option value="disponible">Disponible</option>
                  <option value="no_disponible">No disponible</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="mantencion">Mantención</option>
                </select>
              </div>

              <div className="col-12 col-md-2 mb-3 d-flex align-items-end gap-2">
                <button
                  type="submit"
                  className={
                    modoEdicion
                      ? 'btn btn-warning w-100'
                      : 'btn btn-success w-100'
                  }
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>

            {modoEdicion && (
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {cargando ? (
        <div className="alert alert-info text-center">
          Cargando salas...
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>IDENTIFICACIÓN</th>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {salas.length > 0 ? (
                salas.map((sala) => (
                  <tr key={sala.id}>
                    <td>{sala.id}</td>
                    <td>{sala.nombre}</td>
                    <td>{sala.capacidad}</td>
                    <td>{sala.ubicacion}</td>
                    <td>{sala.estado}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => prepararEdicion(sala)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarSala(sala.id)}
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
                    No hay salas registradas.
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

export default Salas