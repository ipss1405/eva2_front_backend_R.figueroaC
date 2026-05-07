import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Reservas() {
  const [reservas, setReservas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [salas, setSalas] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('danger')
  const [cargando, setCargando] = useState(true)

  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({
    usuario_id: '',
    sala_id: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    observacion: ''
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

  const manejarSesionExpirada = (response) => {
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      navigate('/login')
      return true
    }

    return false
  }

  const obtenerUsuarios = async () => {
    const token = obtenerToken()

    if (!token) {
      return
    }

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

    if (manejarSesionExpirada(response)) {
      return
    }

    if (!response.ok) {
      return
    }

    const listaUsuarios = Array.isArray(data)
      ? data
      : data.data || data.usuarios || []

    const usuariosActivos = listaUsuarios.filter(
      (usuario) => String(usuario.estado).toLowerCase() === 'activo'
    )

    setUsuarios(usuariosActivos)
  }

  const obtenerSalas = async () => {
    const token = obtenerToken()

    if (!token) {
      return
    }

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

    if (manejarSesionExpirada(response)) {
      return
    }

    if (!response.ok) {
      return
    }

    const listaSalas = Array.isArray(data)
      ? data
      : data.data || data.salas || []

    const salasDisponibles = listaSalas.filter(
      (sala) => String(sala.estado).toLowerCase() === 'disponible'
    )

    setSalas(salasDisponibles)
  }

  const obtenerReservas = async () => {
    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/reservas?t=${Date.now()}`,
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

      if (manejarSesionExpirada(response)) {
        return
      }

      if (!response.ok) {
        setMensaje(data.mensaje || 'No se pudieron cargar las reservas')
        setTipoMensaje('danger')
        setCargando(false)
        return
      }

      const listaReservas = Array.isArray(data)
        ? data
        : data.data || data.reservas || []

      setReservas(listaReservas)
      setCargando(false)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
      setCargando(false)
    }
  }

  const cargarDatos = async () => {
    setCargando(true)

    try {
      await obtenerUsuarios()
      await obtenerSalas()
      await obtenerReservas()
    } catch (error) {
      console.error(error)
      setMensaje('Error al cargar datos del módulo de reservas')
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

  const limpiarFormulario = () => {
    setFormulario({
      usuario_id: '',
      sala_id: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      observacion: ''
    })
  }

  const crearReserva = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (
      formulario.usuario_id === '' ||
      formulario.sala_id === '' ||
      formulario.fecha.trim() === '' ||
      formulario.hora_inicio.trim() === '' ||
      formulario.hora_fin.trim() === ''
    ) {
      setMensaje('Usuario, sala, fecha, hora de inicio y hora de término son obligatorios')
      setTipoMensaje('danger')
      return
    }

    if (formulario.hora_inicio >= formulario.hora_fin) {
      setMensaje('La hora de inicio debe ser menor que la hora de término')
      setTipoMensaje('danger')
      return
    }

    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      const datosEnviar = {
        usuario_id: Number(formulario.usuario_id),
        sala_id: Number(formulario.sala_id),
        fecha: formulario.fecha,
        hora_inicio: formulario.hora_inicio,
        hora_fin: formulario.hora_fin,
        observacion: formulario.observacion
      }

      const response = await fetch('http://localhost:3000/api/reservas', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosEnviar)
      })

      const data = await leerRespuesta(response)

      if (manejarSesionExpirada(response)) {
        return
      }

      if (!response.ok) {
        setMensaje(data.mensaje || 'No se pudo crear la reserva')
        setTipoMensaje('danger')
        return
      }

      setMensaje(data.mensaje || 'Reserva creada correctamente')
      setTipoMensaje('success')

      limpiarFormulario()
      await obtenerReservas()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
    }
  }

  const cambiarEstadoReserva = async (id, nuevoEstado) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas cambiar esta reserva a estado "${nuevoEstado}"?`
    )

    if (!confirmar) {
      return
    }

    const token = obtenerToken()

    if (!token) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/reservas/${id}/estado`,
        {
          method: 'PATCH',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            estado: nuevoEstado
          })
        }
      )

      const data = await leerRespuesta(response)

      if (manejarSesionExpirada(response)) {
        return
      }

      if (!response.ok) {
        setMensaje(data.mensaje || 'No se pudo cambiar el estado de la reserva')
        setTipoMensaje('danger')
        return
      }

      setMensaje(data.mensaje || `Reserva cambiada a estado ${nuevoEstado}`)
      setTipoMensaje('success')

      await obtenerReservas()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
      setMensaje('Error al conectar con el backend')
      setTipoMensaje('danger')
    }
  }

  const obtenerNombreUsuario = (reserva) => {
    return (
      reserva.usuario?.nombre ||
      reserva.Usuario?.nombre ||
      usuarios.find((usuario) => usuario.id === reserva.usuario_id)?.nombre ||
      reserva.usuario_id
    )
  }

  const obtenerNombreSala = (reserva) => {
    return (
      reserva.sala?.nombre ||
      reserva.Sala?.nombre ||
      salas.find((sala) => sala.id === reserva.sala_id)?.nombre ||
      reserva.sala_id
    )
  }

  const obtenerColorEstado = (estado) => {
    const estadoNormalizado = String(estado).toLowerCase()

    if (estadoNormalizado === 'pendiente') {
      return 'badge bg-warning text-dark'
    }

    if (estadoNormalizado === 'confirmada') {
      return 'badge bg-success'
    }

    if (estadoNormalizado === 'finalizada') {
      return 'badge bg-primary'
    }

    if (estadoNormalizado === 'cancelada') {
      return 'badge bg-danger'
    }

    return 'badge bg-secondary'
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">Gestión de reservas</h1>

      <p className="text-center">
        Crear, listar y cambiar el estado de las reservas de salas.
      </p>

      {mensaje && (
        <div className={`alert alert-${tipoMensaje} text-center`}>
          {mensaje}
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white text-center">
          Crear nueva reserva
        </div>

        <div className="card-body">
          <form onSubmit={crearReserva}>
            <div className="row">
              <div className="col-12 col-md-3 mb-3">
                <label className="form-label">Usuario</label>
                <select
                  name="usuario_id"
                  className="form-select"
                  value={formulario.usuario_id}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} - {usuario.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <label className="form-label">Sala</label>
                <select
                  name="sala_id"
                  className="form-select"
                  value={formulario.sala_id}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione sala</option>
                  {salas.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                      {sala.nombre} - capacidad {sala.capacidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-2 mb-3">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  className="form-control"
                  value={formulario.fecha}
                  onChange={manejarCambio}
                />
              </div>

              <div className="col-12 col-md-2 mb-3">
                <label className="form-label">Hora inicio</label>
                <input
                  type="time"
                  name="hora_inicio"
                  className="form-control"
                  value={formulario.hora_inicio}
                  onChange={manejarCambio}
                />
              </div>

              <div className="col-12 col-md-2 mb-3">
                <label className="form-label">Hora término</label>
                <input
                  type="time"
                  name="hora_fin"
                  className="form-control"
                  value={formulario.hora_fin}
                  onChange={manejarCambio}
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Observación</label>
                <textarea
                  name="observacion"
                  className="form-control"
                  value={formulario.observacion}
                  onChange={manejarCambio}
                  placeholder="Ejemplo: reunión de coordinación"
                  rows="2"
                ></textarea>
              </div>

              <div className="col-12 text-end">
                <button type="submit" className="btn btn-success">
                  Crear reserva
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {cargando ? (
        <div className="alert alert-info text-center">
          Cargando reservas...
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Sala</th>
                <th>Fecha</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Estado</th>
                <th>Observación</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservas.length > 0 ? (
                reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{obtenerNombreUsuario(reserva)}</td>
                    <td>{obtenerNombreSala(reserva)}</td>
                    <td>{reserva.fecha}</td>
                    <td>{reserva.hora_inicio}</td>
                    <td>{reserva.hora_fin}</td>
                    <td>
                      <span className={obtenerColorEstado(reserva.estado)}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td>{reserva.observacion || reserva.observaciones || '-'}</td>
                    <td>
                      <div className="d-flex flex-column gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => cambiarEstadoReserva(reserva.id, 'confirmada')}
                          disabled={reserva.estado === 'confirmada'}
                        >
                          Confirmar
                        </button>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => cambiarEstadoReserva(reserva.id, 'finalizada')}
                          disabled={reserva.estado === 'finalizada'}
                        >
                          Finalizar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => cambiarEstadoReserva(reserva.id, 'cancelada')}
                          disabled={reserva.estado === 'cancelada'}
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No hay reservas registradas.
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

export default Reservas