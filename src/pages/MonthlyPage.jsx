import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import Calendar from '../components/Calendar'

const SQL_GUIDE = `-- Supabaseダッシュボードで実行してください
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date text not null,
  title text not null,
  description text,
  created_at timestamptz default now()
);
create table if not exists diary (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date text not null unique,
  content text,
  created_at timestamptz default now()
);
create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  period_type text not null,
  period_key text not null,
  content text,
  created_at timestamptz default now(),
  unique(user_id, period_type, period_key)
);`

function getPeriodKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

function getToday() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  monthLabel: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#5a4a5a',
    letterSpacing: '-0.5px',
  },
  navBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#fff',
    border: '1.5px solid #f0e0ec',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#9e8e9e',
    transition: 'background 0.2s',
  },
  goalSection: {
    background: '#fff',
    borderRadius: '16px',
    padding: '14px 16px',
    marginTop: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderLeft: '4px solid #f9a8c9',
  },
  goalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  goalTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#9e8e9e',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  goalText: {
    fontSize: '14px',
    color: '#5a4a5a',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    minHeight: '20px',
  },
  goalInput: {
    width: '100%',
    padding: '8px 0',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#5a4a5a',
    background: 'transparent',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    minHeight: '60px',
  },
  editBtn: {
    fontSize: '12px',
    color: '#f9a8c9',
    background: '#fce4ef',
    border: 'none',
    borderRadius: '8px',
    padding: '3px 10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  saveBtn: {
    fontSize: '12px',
    color: '#fff',
    background: '#f9a8c9',
    border: 'none',
    borderRadius: '8px',
    padding: '3px 10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  tableError: {
    margin: '16px 0',
  },
}

export default function MonthlyPage() {
  const { session } = useAuth()
  const today = getToday()
  const [current, setCurrent] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [eventCounts, setEventCounts] = useState({})
  const [goal, setGoal] = useState('')
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalDraft, setGoalDraft] = useState('')
  const [tableError, setTableError] = useState(false)
  const [loading, setLoading] = useState(true)

  const { year, month } = current
  const periodKey = getPeriodKey(year, month)

  useEffect(() => {
    if (!session) return
    loadData()
  }, [year, month, session])

  async function loadData() {
    setLoading(true)
    setTableError(false)

    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`

    // イベント取得
    const { data: evData, error: evErr } = await supabase
      .from('events')
      .select('date')
      .eq('user_id', session.user.id)
      .gte('date', startDate)
      .lte('date', endDate)

    if (evErr) {
      if (evErr.code === '42P01') {
        setTableError(true)
        setLoading(false)
        return
      }
    }

    if (evData) {
      const counts = {}
      evData.forEach(ev => {
        counts[ev.date] = (counts[ev.date] || 0) + 1
      })
      setEventCounts(counts)
    }

    // 月目標取得
    const { data: goalData } = await supabase
      .from('goals')
      .select('content')
      .eq('user_id', session.user.id)
      .eq('period_type', 'month')
      .eq('period_key', periodKey)
      .maybeSingle()

    if (goalData) {
      setGoal(goalData.content || '')
    } else {
      setGoal('')
    }

    setLoading(false)
  }

  async function saveGoal() {
    const { error } = await supabase
      .from('goals')
      .upsert({
        user_id: session.user.id,
        period_type: 'month',
        period_key: periodKey,
        content: goalDraft,
      }, { onConflict: 'user_id,period_type,period_key' })

    if (!error) {
      setGoal(goalDraft)
      setEditingGoal(false)
    }
  }

  function prevMonth() {
    setCurrent(c => {
      const d = new Date(c.year, c.month - 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  function nextMonth() {
    setCurrent(c => {
      const d = new Date(c.year, c.month + 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const monthName = new Date(year, month, 1).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div>
      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={prevMonth}>‹</button>
        <div style={styles.monthLabel}>{monthName}</div>
        <button style={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      {tableError && (
        <div className="info-box" style={styles.tableError}>
          <strong>⚠️ テーブルが見つかりません</strong><br />
          Supabaseダッシュボードの SQL Editor で以下を実行してください：
          <pre>{SQL_GUIDE}</pre>
        </div>
      )}

      {!tableError && (
        <>
          <Calendar
            year={year}
            month={month}
            events={eventCounts}
            today={today}
          />

          <div style={styles.goalSection}>
            <div style={styles.goalHeader}>
              <span style={styles.goalTitle}>🎯 今月の目標</span>
              {!editingGoal ? (
                <button
                  style={styles.editBtn}
                  onClick={() => { setGoalDraft(goal); setEditingGoal(true) }}
                >
                  編集
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    style={{ ...styles.editBtn, color: '#9e8e9e', background: '#f5f5f5' }}
                    onClick={() => setEditingGoal(false)}
                  >
                    キャンセル
                  </button>
                  <button style={styles.saveBtn} onClick={saveGoal}>保存</button>
                </div>
              )}
            </div>

            {editingGoal ? (
              <textarea
                style={styles.goalInput}
                value={goalDraft}
                onChange={e => setGoalDraft(e.target.value)}
                placeholder="今月の目標を入力..."
                autoFocus
              />
            ) : (
              <div style={styles.goalText}>
                {goal || <span style={{ color: '#c8b8c8', fontStyle: 'italic' }}>目標を設定しましょう ✨</span>}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
