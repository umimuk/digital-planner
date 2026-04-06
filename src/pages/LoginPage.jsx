import { useState } from 'react'
import { supabase } from '../lib/supabase'

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fce4ef 0%, #e8f5fb 50%, #ffe8d6 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '32px 24px',
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 4px 24px rgba(249, 168, 201, 0.2)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  emoji: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '8px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#f9a8c9',
    marginBottom: '4px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#9e8e9e',
  },
  tabs: {
    display: 'flex',
    background: '#fdf6f0',
    borderRadius: '12px',
    padding: '3px',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    padding: '8px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: '#fff',
    color: '#f9a8c9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  inactiveTab: {
    background: 'transparent',
    color: '#9e8e9e',
  },
  formGroup: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#9e8e9e',
    marginBottom: '6px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #f0e0ec',
    borderRadius: '12px',
    background: '#fdf6f0',
    color: '#5a4a5a',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #f9a8c9 0%, #ffd3b6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(249, 168, 201, 0.4)',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  error: {
    padding: '10px 14px',
    background: '#fff0f5',
    border: '1.5px solid #f9a8c9',
    borderRadius: '10px',
    color: '#c2547b',
    fontSize: '13px',
    marginBottom: '14px',
  },
  success: {
    padding: '10px 14px',
    background: '#f0fff4',
    border: '1.5px solid #a8d8ea',
    borderRadius: '10px',
    color: '#2d7d6a',
    fontSize: '13px',
    marginBottom: '14px',
  },
  divider: {
    textAlign: 'center',
    color: '#9e8e9e',
    fontSize: '11px',
    margin: '16px 0 0',
  },
}

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('登録メールを送信しました。メールを確認してください。')
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      setError(err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.emoji}>🌸</span>
          <div style={styles.title}>my planner</div>
          <div style={styles.subtitle}>あなただけの手帳</div>
        </div>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'login' ? styles.activeTab : styles.inactiveTab) }}
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
          >
            ログイン
          </button>
          <button
            style={{ ...styles.tab, ...(mode === 'register' ? styles.activeTab : styles.inactiveTab) }}
            onClick={() => { setMode('register'); setError(''); setSuccess('') }}
          >
            新規登録
          </button>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}
        {success && <div style={styles.success}>✉️ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>メールアドレス</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>パスワード</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="6文字以上"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '登録する'}
          </button>
        </form>

        <div style={styles.divider}>
          {mode === 'login'
            ? 'アカウントをお持ちでない方は「新規登録」へ'
            : 'すでにアカウントをお持ちの方は「ログイン」へ'}
        </div>
      </div>
    </div>
  )
}
