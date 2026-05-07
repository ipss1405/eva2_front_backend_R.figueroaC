import { Link } from 'react-router-dom'

function Navbar() {
  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/login'
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          Reservas Salas IPSS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/usuarios">
                Usuarios
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/usuarios-inactivos">
                Usuarios Inactivos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/salas">
                Salas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/reservas">
                Reservas
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm ms-lg-3"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar