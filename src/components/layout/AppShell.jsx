import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { FiHome, FiLayout, FiArchive, FiSearch, FiMoon, FiSun } from 'react-icons/fi'
import { RiMenu2Line } from 'react-icons/ri'
import { LiaTimesSolid } from 'react-icons/lia'
import { signOut } from '../../features/auth/authSlice'
import { toggleTheme, toggleSidebar, closeSidebar } from '../../features/ui/uiSlice'
import { IoMdLogIn, IoMdLogOut } from 'react-icons/io'
import AppLogo from '../../assets/images/upvite-logo.png'

function AppShell() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.ui.theme)
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen)
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()
  const isBuilderOpen = location.pathname.startsWith('/builder')

  useEffect(() => {
    dispatch(closeSidebar())
  }, [location.pathname, dispatch])

  return (
    <div className="app-shell">
      <button
        type="button"
        className="icon-button app-nav-toggle"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle navigation"
      >
        {isSidebarOpen ? <LiaTimesSolid /> : <RiMenu2Line />}
      </button>
      <div className="app-shell-body">
        <aside className={`app-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
          <div className="sidebar-inner">
            <div>
              <div className="sidebar-header-row">
                <button type="button" className="app-logo">
                  <Link to="/">
                    <div className='logo-img'><img src={AppLogo}></img></div>
                    <span className="app-logo-text">Upvite</span>
                  </Link>
                </button>
                <div className="sidebar-header-actions">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => dispatch(toggleTheme())}
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? <FiMoon /> : <FiSun />}
                  </button>
                </div>
              </div>
              <div className="sidebar-profile">
              </div>
              <div className="sidebar-divider" />
              <nav className="app-nav app-nav-desktop app-nav-mobile">
                <NavLink to="/" end className="app-nav-link">
                  <span className="app-nav-icon">
                    <FiHome />
                  </span>
                  <div className="app-nav-text">
                    <span className="app-nav-label">Explore</span>
                    <span className="app-nav-caption">Overview and quick start</span>
                  </div>
                </NavLink>
                <div className={`app-nav-group ${isBuilderOpen ? 'is-open' : ''}`}>
                  <NavLink to="/builder" className="app-nav-link">
                    <span className="app-nav-icon">
                      <FiLayout />
                    </span>
                    <div className="app-nav-text">
                      <span className="app-nav-label">Builder</span>
                      <span className="app-nav-caption">Manual and bulk modes</span>
                    </div>
                  </NavLink>
                  <div className="app-nav-sublist">
                    <div className="app-nav-subitem">
                      <span className="app-nav-sub-bullet" />
                      <NavLink to="/builder/manual" className="app-nav-sub-label">
                        Manual mode
                      </NavLink>
                    </div>
                    <div className="app-nav-subitem">
                      <span className="app-nav-sub-bullet" />
                      <NavLink to="/builder/bulk" className="app-nav-sub-label">
                        Bulk upload
                      </NavLink>
                    </div>
                  </div>
                </div>
                <NavLink to="/profile" className="app-nav-link">
                  <span className="app-nav-icon">
                    <FiArchive />
                  </span>
                  <div className="app-nav-text">
                    <span className="app-nav-label">My invitations</span>
                    <span className="app-nav-caption">History, exports, and links</span>
                  </div>
                </NavLink>
              </nav>
            </div>
            <div className="sidebar-footer">
              <div className='sidebar-user'>
                <div className="sidebar-avatar">
                  {user && user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="sidebar-profile-text">
                  <span className="sidebar-profile-name">
                    {user && user.email ? user.email.split('@')[0] : 'Guest user'}
                  </span>
                  <span className="sidebar-profile-email">
                    {user && user.email ? user.email : 'Sign in to save invitations'}
                  </span>
                </div>
              </div>
              {!user ? (
                <Link to="/auth" className="btn btn-primary btn-sm sidebar-profile-cta">
                  Sign in <IoMdLogIn />
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger btn-sm sidebar-profile-cta"
                  onClick={() => dispatch(signOut())}
                >
                  Sign out <IoMdLogOut />
                </button>
              )}
            </div>
          </div>
        </aside>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
