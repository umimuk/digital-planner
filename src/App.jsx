import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import MonthlyPage from './pages/MonthlyPage'
import WeeklyPage from './pages/WeeklyPage'
import DayPage from './pages/DayPage'
import './App.css'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="loading-center">読み込み中...</div>
  if (!session) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      <BrowserRouter basename="/digital-planner">
        <div className="app">
          <Routes>
            <Route path="/login" element={
              session ? <Navigate to="/" replace /> : <LoginPage />
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<MonthlyPage />} />
              <Route path="weekly" element={<WeeklyPage />} />
              <Route path="day/:date" element={<DayPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
