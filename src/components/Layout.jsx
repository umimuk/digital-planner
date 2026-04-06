import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    width: '100%',
  },
  header: {
    background: '#fff',
    borderBottom: '1.5px solid #f0e0ec',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  logo: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#f9a8c9',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  logoutBtn: {
    fontSize: '12px',
    color: '#9e8e9e',
    padding: '4px 10px',
    border: '1px solid #f0e0ec',
    borderRadius: '20px',
    background: '#fdf6f0',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  content: {
    flex: 1,
    padding: '20px 16px',
    paddingBottom: '84px',
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    background: '#fff',
    borderTop: '1.5px solid #f0e0ec',
    display: 'flex',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0 12px',
    fontSize: '10px',
    color: '#9e8e9e',
    fontWeight: '500',
    gap: '2px',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  navIcon: {
    fontSize: '20px',
    lineHeight: 1,
  },
}

export default function Layout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div
          style={{ ...styles.logo, cursor: 'pointer', userSelect: 'none' }}
          onClick={() => navigate('/')}
          role="link"
          aria-label="トップに戻る"
        >
          <span>🌸</span>
          <span>my planner</span>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      <main style={styles.content}>
        <Outlet />
      </main>

      <nav style={styles.nav}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#f9a8c9' : '#9e8e9e',
          })}
        >
          <span style={styles.navIcon}>📅</span>
          <span>月間</span>
        </NavLink>
        <NavLink
          to="/weekly"
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#a8d8ea' : '#9e8e9e',
          })}
        >
          <span style={styles.navIcon}>📋</span>
          <span>週間</span>
        </NavLink>
      </nav>
    </div>
  )
}
