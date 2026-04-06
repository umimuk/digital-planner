import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function getWeekKey(date) {
  // ISO週番号
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function getWeekDates(startDate) {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    dates.push(d)
  }
  return dates
}

function getMondayOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function getToday() {
  return toDateStr(new Date())
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  weekLabel: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#5a4a5a',
    letterSpacing: '-0.5px',
    textAlign: 'center',
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
  },
  weekRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    background: '#fff',
    borderRadius: '16px',
    padding: '10px 8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '16px',
  },
  dayChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 2px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  dayName: {
    fontSize: '10px',
    fontWeight: '700',
  },
  dayNum: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
  },
  goalSection: {
    background: '#fff',
    borderRadius: '16px',
    padding: '14px 16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderLeft: '4px solid #a8d8ea',
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
  editBtn: {
    fontSize: '12px',
    color: '#3a7d99',
    background: '#daf0f7',
    border: 'none',
    borderRadius: '8px',
    padding: '3px 10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  saveBtn: {
    fontSize: '12px',
    color: '#fff',
    background: '#a8d8ea',
    border: 'none',
    borderRadius: '8px',
    padding: '3px 10px',
    cursor: 'pointer',
    fontWeight: '600',
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
    minHeight: '56px',
  },
  goalText: {
    fontSize: '14px',
    color: '#5a4a5a',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    minHeight: '20px',
  },
  dayCard: {
    background: '#fff',
    borderRadius: '14px',
    padding: '12px 14px',
    marginBottom: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  dayCardDate: {
    minWidth: '40px',
    textAlign: 'center',
    flexShrink: 0,
  },
  dayCardNum: {
    fontSize: '20px',
    fontWeight: '800',
    lineHeight: 1,
  },
  dayCardName: {
    fontSize: '11px',
    color: '#9e8e9e',
    marginTop: '2px',
  },
  dayCardContent: {
    flex: 1,
    minWidth: 0,
  },
  eventItem: {
    fontSize: '13px',
    color: '#5a4a5a',
    padding: '3px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  eventDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#f9a8c9',
    flexShrink: 0,
  },
  noEvent: {
    fontSize: '12px',
    color: '#c8b8c8',
    fontStyle: 'italic',
    padding: '2px 0',
  },
  addHint: {
    fontSize: '11px',
    color: '#a8d8ea',
    marginTop: '4px',
  },
}

export default function WeeklyPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const today = getToday()

  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(new Date()))
  const [events, setEvents] = useState({})
  const [goal, setGoal] = useState('')
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalDraft, setGoalDraft] = useState('')
  const [tableError, setTableError] = useState(false)

  const weekDates = getWeekDates(weekStart)
  const weekKey = getWeekKey(weekStart)

  useEffect(() => {
    if (!session) return
    loadData()
  }, [weekStart, session])

  async function loadData() {
    setTableError(false)
    const startStr = toDateStr(weekDates[0])
    const endStr = toDateStr(weekDates[6])

    const { data: evData, error: evErr } = await supabase
      .from('events')
      .select('date, title')
      .eq('user_id', session.user.id)
      .gte('date', startStr)
      .lte('date', endStr)
      .order('date')

    if (evErr) {
      if (evErr.code === '42P01') { setTableError(true); return }
    }

    if (evData) {
      const grouped = {}
      evData.forEach(ev => {
        if (!grouped[ev.date]) grouped[ev.date] = []
        grouped[ev.date].push(ev.title)
      })
      setEvents(grouped)
    }

    const { data: goalData } = await supabase
      .from('goals')
      .select('content')
      .eq('user_id', session.user.id)
      .eq('period_type', 'week')
      .eq('period_key', weekKey)
      .maybeSingle()

    setGoal(goalData?.content || '')
  }

  async function saveGoal() {
    await supabase.from('goals').upsert({
      user_id: session.user.id,
      period_type: 'week',
      period_key: weekKey,
      content: goalDraft,
    }, { onConflict: 'user_id,period_type,period_key' })
    setGoal(goalDraft)
    setEditingGoal(false)
  }

  function prevWeek() {
    setWeekStart(d => {
      const nd = new Date(d)
      nd.setDate(nd.getDate() - 7)
      return nd
    })
  }

  function nextWeek() {
    setWeekStart(d => {
      const nd = new Date(d)
      nd.setDate(nd.getDate() + 7)
      return nd
    })
  }

  function getDayColor(dayIndex) {
    // dayIndex 0=Mon...6=Sun
    const dow = (dayIndex + 1) % 7 // 0=Sun,6=Sat
    if (dow === 0) return '#f9a8c9'
    if (dow === 6) return '#a8d8ea'
    return '#5a4a5a'
  }

  const startLabel = weekDates[0].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  const endLabel = weekDates[6].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })

  return (
    <div>
      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={prevWeek}>‹</button>
        <div style={styles.weekLabel}>{startLabel} 〜 {endLabel}</div>
        <button style={styles.navBtn} onClick={nextWeek}>›</button>
      </div>

      {/* ミニ週間バー */}
      <div style={styles.weekRow}>
        {weekDates.map((d, i) => {
          const dateStr = toDateStr(d)
          const isToday = dateStr === today
          const dow = d.getDay()
          const color = dow === 0 ? '#f9a8c9' : dow === 6 ? '#a8d8ea' : '#5a4a5a'
          return (
            <div
              key={i}
              style={{
                ...styles.dayChip,
                background: isToday ? '#fce4ef' : 'transparent',
              }}
              onClick={() => navigate(`/day/${dateStr}`)}
            >
              <span style={{ ...styles.dayName, color: isToday ? '#c2547b' : color }}>
                {WEEKDAYS[dow]}
              </span>
              <span style={{
                ...styles.dayNum,
                background: isToday ? '#f9a8c9' : 'transparent',
                color: isToday ? '#fff' : color,
              }}>
                {d.getDate()}
              </span>
            </div>
          )
        })}
      </div>

      {/* 週間目標 */}
      {!tableError && (
        <div style={styles.goalSection}>
          <div style={styles.goalHeader}>
            <span style={styles.goalTitle}>🎯 今週の目標</span>
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
                  ×
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
              placeholder="今週の目標を入力..."
              autoFocus
            />
          ) : (
            <div style={styles.goalText}>
              {goal || <span style={{ color: '#c8b8c8', fontStyle: 'italic' }}>目標を設定しましょう ✨</span>}
            </div>
          )}
        </div>
      )}

      {/* 日別予定リスト */}
      <div>
        {weekDates.map((d, i) => {
          const dateStr = toDateStr(d)
          const isToday = dateStr === today
          const dow = d.getDay()
          const color = dow === 0 ? '#f9a8c9' : dow === 6 ? '#a8d8ea' : '#5a4a5a'
          const dayEvents = events[dateStr] || []

          return (
            <div
              key={i}
              style={{
                ...styles.dayCard,
                borderLeft: isToday ? '3px solid #f9a8c9' : '3px solid transparent',
              }}
              onClick={() => navigate(`/day/${dateStr}`)}
            >
              <div style={styles.dayCardDate}>
                <div style={{ ...styles.dayCardNum, color }}>
                  {d.getDate()}
                </div>
                <div style={styles.dayCardName}>{WEEKDAYS[dow]}</div>
              </div>
              <div style={styles.dayCardContent}>
                {dayEvents.length === 0 ? (
                  <div style={styles.noEvent}>予定なし</div>
                ) : (
                  dayEvents.slice(0, 3).map((title, j) => (
                    <div key={j} style={styles.eventItem}>
                      <span style={{
                        ...styles.eventDot,
                        background: j === 0 ? '#f9a8c9' : j === 1 ? '#a8d8ea' : '#ffd3b6',
                      }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {title}
                      </span>
                    </div>
                  ))
                )}
                {dayEvents.length > 3 && (
                  <div style={styles.addHint}>+{dayEvents.length - 3}件</div>
                )}
                {dayEvents.length === 0 && (
                  <div style={styles.addHint}>タップして追加 →</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
