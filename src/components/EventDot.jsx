const COLORS = ['#f9a8c9', '#a8d8ea', '#ffd3b6', '#c8e6c9', '#e1bee7']

export default function EventDot({ count = 0 }) {
  if (count === 0) return null

  const dots = Math.min(count, 3)

  return (
    <div style={{
      display: 'flex',
      gap: '2px',
      justifyContent: 'center',
      marginTop: '2px',
      flexWrap: 'wrap',
    }}>
      {Array.from({ length: dots }).map((_, i) => (
        <span
          key={i}
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: COLORS[i % COLORS.length],
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
      ))}
      {count > 3 && (
        <span style={{
          fontSize: '8px',
          color: '#9e8e9e',
          lineHeight: 1,
          marginLeft: '1px',
        }}>
          +{count - 3}
        </span>
      )}
    </div>
  )
}
