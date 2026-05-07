import { Link } from 'react-router-dom'

function Dashboard() {
  const usuarioGuardado = localStorage.getItem('usuario')
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null

  return (
    <div className="container mt-4">
      <div className="p-4 p-md-5 mb-4 bg-light rounded-3 shadow-sm">
        <div className="container-fluid text-center">
          <h1 className="display-5 fw-bold">Panel principal</h1>

          <p className="fs-5 mt-3">
            Sistema de administración de reservas de salas para una empresa o institución.
          </p>

          <div className="alert alert-success mt-4">
            Inicio de sesión correcto. Usuario autenticado.
          </div>

          {usuario?.email && (
            <p className="mb-0">
              Usuario conectado: <strong>{usuario.email}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm text-center">
            <div className="card-body">
              <div className="fs-1 mb-2">👥</div>
              <h5 className="card-title">Usuarios</h5>
              <p className="card-text">
                Crear, listar, editar y eliminar usuarios del sistema.
              </p>
              <Link to="/usuarios" className="btn btn-primary">
                Ir a usuarios
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm text-center">
            <div className="card-body">
              <div className="fs-1 mb-2">📁</div>
              <h5 className="card-title">Inactivos</h5>
              <p className="card-text">
                Revisar usuarios eliminados lógicamente para trazabilidad.
              </p>
              <Link to="/usuarios-inactivos" className="btn btn-secondary">
                Ver inactivos
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm text-center">
            <div className="card-body">
              <div className="fs-1 mb-2">🏢</div>
              <h5 className="card-title">Salas</h5>
              <p className="card-text">
                Administrar salas, capacidad, ubicación y estado.
              </p>
              <Link to="/salas" className="btn btn-primary">
                Ir a salas
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm text-center">
            <div className="card-body">
              <div className="fs-1 mb-2">📅</div>
              <h5 className="card-title">Reservas</h5>
              <p className="card-text">
                Crear reservas y gestionar estados del flujo.
              </p>
              <Link to="/reservas" className="btn btn-success">
                Ir a reservas
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white text-center">
          Flujo general del sistema
        </div>

        <div className="card-body">
          <div className="row text-center">
            <div className="col-12 col-md-3 mb-3">
              <div className="border rounded p-3 h-100">
                <h6>1. Usuarios</h6>
                <p className="mb-0">
                  Se registran las personas que participan en el sistema.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-3 mb-3">
              <div className="border rounded p-3 h-100">
                <h6>2. Salas</h6>
                <p className="mb-0">
                  Se administran las salas disponibles para uso interno.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-3 mb-3">
              <div className="border rounded p-3 h-100">
                <h6>3. Reservas</h6>
                <p className="mb-0">
                  Se crean reservas según sala, fecha y horario.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-3 mb-3">
              <div className="border rounded p-3 h-100">
                <h6>4. Estados</h6>
                <p className="mb-0">
                  Las reservas pueden quedar pendientes, confirmadas, finalizadas o canceladas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info text-center">
        Este panel permite administrar de forma centralizada los usuarios, salas y reservas del sistema.
      </div>
    </div>
  )
}

export default Dashboard