import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  backBtn: {
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
    flexShrink: 0,
  },
  dateLabel: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#5a4a5a',
    letterSpacing: '-0.3px',
    flex: 1,
  },
  section: {
    background: '#fff',
    borderRadius: '16px',
    padding: '14px 16px',
    marginBottom: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#9e8e9e',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  addBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f9a8c9, #ffd3b6)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(249,168,201,0.4)',
    lineHeight: 1,
    fontWeight: '300',
    flexShrink: 0,
  },
  eventItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid #fdf0f7',
  },
  eventDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#f9a8c9',
    marginTop: '5px',
    flexShrink: 0,
  },
  eventContent: {
    flex: 1,
    minWidth: 0,
  },
  eventTitle: {
    fontSize: '14px',
    color: '#5a4a5a',
    fontWeight: '600',
    marginBottom: '2px',
  },
  eventDesc: {
    fontSize: '12px',
    color: '#9e8e9e',
    lineHeight: '1.4',
  },
  eventActions: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0,
  },
  actionBtn: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  editBtnSmall: {
    background: '#fce4ef',
    color: '#c2547b',
  },
  deleteBtnSmall: {
    background: '#f5f5f5',
    color: '#9e8e9e',
  },
  emptyText: {
    fontSize: '13px',
    color: '#c8b8c8',
    fontStyle: 'italic',
    padding: '4px 0 8px',
    textAlign: 'center',
  },
  diaryInput: {
    width: '100%',
    padding: '8px 4px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#5a4a5a',
    background: 'transparent',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.7',
    minHeight: '100px',
    boxSizing: 'border-box',
  },
  diarySaveBtn: {
    fontSize: '12px',
    color: '#fff',
    background: 'linear-gradient(135deg, #f9a8c9, #ffd3b6)',
    border: 'none',
    borderRadius: '8px',
    padding: '5px 14px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(249,168,201,0.3)',
  },
  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(90, 74, 90, 0.3)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 200,
  },
  sheet: {
    background: '#fff',
    borderRadius: '20px 20px 0 0',
    padding: '20px 20px 36px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
  },
  handle: {
    width: '40px',
    height: '4px',
    background: '#f0e0ec',
    borderRadius: '2px',
    margin: '0 auto 16px',
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#5a4a5a',
    marginBottom: '16px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '12px',
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
    padding: '10px 14px',
    border: '1.5px solid #f0e0ec',
    borderRadius: '12px',
    background: '#fdf6f0',
    color: '#5a4a5a',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #f0e0ec',
    borderRadius: '12px',
    background: '#fdf6f0',
    color: '#5a4a5a',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px',
    lineHeight: '1.6',
    transition: 'border-color 0.2s',
  },
  modalActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  submitBtn: {
    flex: 1,
    padding: '11px',
    background: 'linear-gradient(135deg, #f9a8c9, #ffd3b6)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(249,168,201,0.35)',
  },
  cancelBtn: {
    flex: 1,
    padding: '11px',
    background: '#fdf6f0',
    color: '#9e8e9e',
    border: '1.5px solid #f0e0ec',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}

const DOT_COLORS = ['#f9a8c9', '#a8d8ea', '#ffd3b6', '#c8e6c9', '#e1bee7']

export default function DayPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()

  const [events, setEvents] = useState([])
  const [diary, setDiary] = useState('')
  const [diaryDraft, setDiaryDraft] = useState('')
  const [diaryChanged, setDiaryChanged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tableError, setTableError] = useState(false)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // null = new
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session || !date) return
    loadData()
  }, [date, session])

  async function loadData() {
    setLoading(true)
    setTableError(false)

    const { data: evData, error: evErr } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', date)
      .order('created_at')

    if (evErr) {
      if (evErr.code === '42P01') { setTableError(true); setLoading(false); return }
    }
    if (evData) setEvents(evData)

    const { data: diaryData } = await supabase
      .from('diary')
      .select('content')
      .eq('user_id', session.user.id)
      .eq('date', date)
      .maybeSingle()

    const content = diaryData?.content || ''
    setDiary(content)
    setDiaryDraft(content)
    setDiaryChanged(false)

    setLoading(false)
  }

  function openAddModal() {
    setEditTarget(null)
    setFormTitle('')
    setFormDesc('')
    setShowModal(true)
  }

  function openEditModal(ev) {
    setEditTarget(ev)
    setFormTitle(ev.title)
    setFormDesc(ev.description || '')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditTarget(null)
  }

  async function saveEvent() {
    if (!formTitle.trim()) return
    setSaving(true)

    if (editTarget) {
      await supabase
        .from('events')
        .update({ title: formTitle.trim(), description: formDesc.trim() || null })
        .eq('id', editTarget.id)
    } else {
      await supabase
        .from('events')
        .insert({
          user_id: session.user.id,
          date,
          title: formTitle.trim(),
          description: formDesc.trim() || null,
        })
    }

    setSaving(false)
    closeModal()
    loadData()
  }

  async function deleteEvent(id) {
    if (!confirm('この予定を削除しますか？')) return
    await supabase.from('events').delete().eq('id', id)
    loadData()
  }

  async function saveDiary() {
    await supabase
      .from('diary')
      .upsert({
        user_id: session.user.id,
        date,
        content: diaryDraft,
      }, { onConflict: 'user_id,date' })
    setDiary(diaryDraft)
    setDiaryChanged(false)
  }

  // 日付フォーマット
  const dateObj = new Date(date + 'T00:00:00')
  const dateLabel = dateObj.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#9e8e9e' }}>
        読み込み中...
      </div>
    )
  }

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>‹</button>
        <div style={styles.dateLabel}>{dateLabel}</div>
      </div>

      {tableError && (
        <div className="info-box">
          <strong>⚠️ テーブルが見つかりません</strong><br />
          Supabaseダッシュボードでテーブルを作成してください。<br />
          月間画面でSQLガイドを確認できます。
        </div>
      )}

      {!tableError && (
        <>
          {/* 予定セクション */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>📌 予定</span>
              <button style={styles.addBtn} onClick={openAddModal} title="予定を追加">+</button>
            </div>

            {events.length === 0 && (
              <div style={styles.emptyText}>予定はありません</div>
            )}

            {events.map((ev, i) => (
              <div key={ev.id} style={{
                ...styles.eventItem,
                borderBottom: i === events.length - 1 ? 'none' : '1px solid #fdf0f7',
              }}>
                <div style={{
                  ...styles.eventDot,
                  background: DOT_COLORS[i % DOT_COLORS.length],
                }} />
                <div style={styles.eventContent}>
                  <div style={styles.eventTitle}>{ev.title}</div>
                  {ev.description && (
                    <div style={styles.eventDesc}>{ev.description}</div>
                  )}
                </div>
                <div style={styles.eventActions}>
                  <button
                    style={{ ...styles.actionBtn, ...styles.editBtnSmall }}
                    onClick={() => openEditModal(ev)}
                  >
                    編集
                  </button>
                  <button
                    style={{ ...styles.actionBtn, ...styles.deleteBtnSmall }}
                    onClick={() => deleteEvent(ev.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 一言日記セクション */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>📝 一言日記</span>
              {diaryChanged && (
                <button style={styles.diarySaveBtn} onClick={saveDiary}>
                  保存
                </button>
              )}
            </div>

            <textarea
              style={styles.diaryInput}
              value={diaryDraft}
              onChange={e => {
                setDiaryDraft(e.target.value)
                setDiaryChanged(e.target.value !== diary)
              }}
              placeholder="今日のひとことを書いてみよう... ✍️"
            />
          </div>
        </>
      )}

      {/* 予定追加/編集モーダル */}
      {showModal && (
        <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={styles.sheet}>
            <div style={styles.handle} />
            <div style={styles.modalTitle}>
              {editTarget ? '予定を編集' : '予定を追加'}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>タイトル</label>
              <input
                style={styles.input}
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="予定のタイトル"
                autoFocus
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>メモ（任意）</label>
              <textarea
                style={styles.textarea}
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                placeholder="詳細メモを入力..."
              />
            </div>

            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={closeModal}>
                キャンセル
              </button>
              <button
                style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1 }}
                onClick={saveEvent}
                disabled={saving || !formTitle.trim()}
              >
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
