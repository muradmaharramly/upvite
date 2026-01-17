import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { FiMoon, FiSun } from 'react-icons/fi'
import { signOut } from '../../features/auth/authSlice'
import { closeSidebar, toggleSidebar, toggleTheme } from '../../features/ui/uiSlice'

function AppShell() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.ui.theme)
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen)
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    dispatch(closeSidebar())
  }, [location.pathname, dispatch])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <button
            type="button"
            className="app-logo"
            onClick={() => dispatch(closeSidebar())}
          >
            <Link to="/">
              <span className="app-logo-mark">UP</span>
              <span className="app-logo-text">Upvite</span>
            </Link>
          </button>
          <nav className="app-nav app-nav-desktop">
            <NavLink to="/" end className="app-nav-link">
              Home
            </NavLink>
            <NavLink to="/builder" className="app-nav-link">
              Create invitations
            </NavLink>
            <NavLink to="/profile" className="app-nav-link">
              My invitations
            </NavLink>
          </nav>
        </div>
        <div className="app-header-right">
          <button
            type="button"
            className="icon-button"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          {user ? (
            <div className="app-user">
              <span className="app-user-avatar">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="app-user-email">{user.email}</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => dispatch(signOut())}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="icon-button app-nav-toggle"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className="app-shell-body">
        <aside className={`app-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
          <nav className="app-nav app-nav-mobile">
            <NavLink to="/" end className="app-nav-link">
              Home
            </NavLink>
            <NavLink to="/builder" className="app-nav-link">
              Create invitations
            </NavLink>
            <NavLink to="/profile" className="app-nav-link">
              My invitations
            </NavLink>
          </nav>
        </aside>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
