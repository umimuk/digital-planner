import { useNavigate } from 'react-router-dom'
import EventDot from './EventDot'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function toDateStr(year, month, day) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
    background: '#fff',
    borderRadius: '16px',
    padding: '12px 8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  weekdayHeader: {
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 0 8px',
  },
  dayCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6px 2px 8px',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '68px',
    transition: 'background 0.15s',
    touchAction: 'manipulation',
  },
  dayNumber: {
    fontSize: '13px',
    fontWeight: '500',
    lineHeight: 1,
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
}

export default function Calendar({ year, month, events = {}, today }) {
  const navigate = useNavigate()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const cells = []

  // 前月の空セル
  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }

  // 当月の日付
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  function handleDayClick(day) {
    if (!day) return
    const dateStr = toDateStr(year, month, day)
    navigate(`/day/${dateStr}`)
  }

  function isToday(day) {
    if (!today || !day) return false
    return toDateStr(year, month, day) === today
  }

  function getEventCount(day) {
    if (!day) return 0
    const key = toDateStr(year, month, day)
    return events[key] || 0
  }

  function getDayColor(colIndex) {
    if (colIndex === 0) return '#f9a8c9' // 日曜
    if (colIndex === 6) return '#a8d8ea' // 土曜
    return '#5a4a5a'
  }

  return (
    <div style={styles.grid}>
      {WEEKDAYS.map((wd, i) => (
        <div
          key={wd}
          style={{
            ...styles.weekdayHeader,
            color: i === 0 ? '#f9a8c9' : i === 6 ? '#a8d8ea' : '#9e8e9e',
          }}
        >
          {wd}
        </div>
      ))}

      {cells.map((day, i) => {
        const colIndex = i % 7
        const todayFlag = isToday(day)
        const count = getEventCount(day)

        return (
          <div
            key={i}
            style={{
              ...styles.dayCell,
              background: !day ? 'transparent' : todayFlag ? '#fce4ef' : 'transparent',
              cursor: day ? 'pointer' : 'default',
            }}
            onClick={() => handleDayClick(day)}
          >
            {day && (
              <>
                <span
                  style={{
                    ...styles.dayNumber,
                    color: todayFlag ? '#c2547b' : getDayColor(colIndex),
                    fontWeight: todayFlag ? '700' : '500',
                    background: todayFlag ? '#f9a8c9' : 'transparent',
                    color: todayFlag ? '#fff' : getDayColor(colIndex),
                  }}
                >
                  {day}
                </span>
                <EventDot count={count} />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
