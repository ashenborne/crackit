'use client'

import { useState, useEffect } from 'react'

const EXAM_DATES: Record<string, string> = {
  JEE: '2027-01-21',
  NEET: '2027-05-02',
}

export default function CalendarPage({ exam }: { exam: string }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [goalHours, setGoalHours] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('crackit_goal') || '6'
    return '6'
  })
  const [logs, setLogs] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crackit_logs')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  const [examDate, setExamDate] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('crackit_examdate') || EXAM_DATES[exam] || ''
    return EXAM_DATES[exam] || ''
  })
  const [inputHours, setInputHours] = useState('')
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0])
  const [view, setView] = useState<'calendar' | 'weekly' | 'monthly' | 'yearly'>('calendar')

  const saveGoal = (val: string) => {
    setGoalHours(val)
    localStorage.setItem('crackit_goal', val)
  }

  const saveExamDate = (val: string) => {
    setExamDate(val)
    localStorage.setItem('crackit_examdate', val)
  }

  const logHours = () => {
    if (!inputHours) return
    const updated = { ...logs, [selectedDate]: parseFloat(inputHours) }
    setLogs(updated)
    localStorage.setItem('crackit_logs', JSON.stringify(updated))
    setInputHours('')
  }

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDay = (month: number, year: number) => new Date(year, month, 1).getDay()

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const todayStr = today.toISOString().split('T')[0]

  const getDayColor = (dateStr: string) => {
    if (dateStr === examDate) return '#FFD700'
    if (dateStr > todayStr) return 'transparent'
    const hours = logs[dateStr]
    if (hours === undefined) return 'rgba(255,90,31,0.3)'
    if (hours >= parseFloat(goalHours)) return 'rgba(0,177,106,0.3)'
    return 'rgba(255,90,31,0.3)'
  }

  const getDayTextColor = (dateStr: string) => {
    if (dateStr === examDate) return '#000'
    if (dateStr === todayStr) return '#FF5A1F'
    return 'white'
  }

  // Weekly chart data — last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 6 + i)
    const str = d.toISOString().split('T')[0]
    return { label: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], hours: logs[str] || 0, date: str }
  })

  // Monthly chart data — last 30 days grouped by week
  const last4weeks = Array.from({ length: 4 }, (_, wi) => {
    let total = 0
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (3 - wi) * 7 - (6 - d))
      const str = date.toISOString().split('T')[0]
      total += logs[str] || 0
    }
    return { label: `Week ${wi + 1}`, hours: total }
  })

  // Yearly chart data — last 12 months
  const last12months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1)
    const m = d.getMonth(), y = d.getFullYear()
    let total = 0
    for (let day = 1; day <= getDaysInMonth(m, y); day++) {
      const str = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      total += logs[str] || 0
    }
    return { label: months[m].slice(0, 3), hours: total }
  })

  const chartData = view === 'weekly' ? last7 : view === 'monthly' ? last4weeks : last12months
  const maxHours = Math.max(...chartData.map(d => d.hours), 1)

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDay(currentMonth, currentYear)

  const daysLeft = examDate ? Math.max(0, Math.ceil((new Date(examDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : null

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>📅 Study Calendar</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>Track your daily study hours and stay on goal</p>

      {/* Settings Row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 20px', flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>🎯 Daily Goal (hours)</div>
          <input
            type="number" value={goalHours} onChange={e => saveGoal(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: 'white', fontSize: 18, fontWeight: 700, width: 80 }}
          />
          <span style={{ color: '#888', marginLeft: 8, fontSize: 13 }}>hrs/day</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 20px', flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>📆 Exam Date</div>
          <input
            type="date" value={examDate} onChange={e => saveExamDate(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: 'white', fontSize: 14 }}
          />
        </div>
        {daysLeft !== null && (
          <div style={{ background: 'rgba(255,90,31,0.1)', border: '1px solid rgba(255,90,31,0.3)', borderRadius: 16, padding: '16px 20px', flex: 1, minWidth: 200, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>⏳ Days to Exam</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#FF5A1F' }}>{daysLeft}</div>
          </div>
        )}
      </div>

      {/* Log Today's Hours */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>✍️ Log Study Hours</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: 'white', fontSize: 14 }} />
          <input type="number" placeholder="Hours studied" value={inputHours} onChange={e => setInputHours(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: 'white', fontSize: 14, width: 140 }} />
          <button onClick={logHours}
            style={{ padding: '8px 20px', background: '#FF5A1F', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Save
          </button>
          {logs[selectedDate] !== undefined && (
            <span style={{ color: '#00B16A', fontSize: 13 }}>✓ {logs[selectedDate]}h logged</span>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['calendar', 'weekly', 'monthly', 'yearly'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: '8px 18px', borderRadius: 50, border: 'none', background: view === v ? '#FF5A1F' : 'rgba(255,255,255,0.07)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13, textTransform: 'capitalize' }}>
            {v}
          </button>
        ))}
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) } else setCurrentMonth(m => m - 1) }}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>←</button>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{months[currentMonth]} {currentYear}</div>
            <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) } else setCurrentMonth(m => m + 1) }}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>→</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#888', padding: '4px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const bgColor = getDayColor(dateStr)
              const textColor = getDayTextColor(dateStr)
              const isToday = dateStr === todayStr
              const isExam = dateStr === examDate
              return (
                <div key={day} onClick={() => setSelectedDate(dateStr)}
                  style={{ aspectRatio: '1', borderRadius: 8, background: bgColor, border: isToday ? '2px solid #FF5A1F' : isExam ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                  <span style={{ fontSize: 13, fontWeight: isToday || isExam ? 800 : 400, color: textColor }}>{day}</span>
                  {logs[dateStr] !== undefined && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>{logs[dateStr]}h</span>}
                  {isExam && <span style={{ fontSize: 8, color: '#000', fontWeight: 700 }}>EXAM</span>}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 12, color: '#888' }}>
            <span>🟢 Goal met</span>
            <span>🔴 Goal missed</span>
            <span style={{ color: '#FFD700' }}>⭐ Exam day</span>
            <span style={{ color: '#FF5A1F' }}>● Today</span>
          </div>
        </div>
      )}

      {/* Graph Views */}
      {view !== 'calendar' && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>
            {view === 'weekly' ? 'Last 7 Days' : view === 'monthly' ? 'Last 4 Weeks' : 'Last 12 Months'} — Study Hours
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
            {chartData.map((item, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, color: '#888' }}>{item.hours > 0 ? `${item.hours}h` : ''}</span>
                <div style={{ width: '100%', background: item.hours >= parseFloat(goalHours) ? '#00B16A' : item.hours > 0 ? '#FF5A1F' : 'rgba(255,255,255,0.07)', borderRadius: '6px 6px 0 0', height: `${(item.hours / maxHours) * 160}px`, minHeight: item.hours > 0 ? 4 : 0, transition: 'height 0.3s' }} />
                <span style={{ fontSize: 11, color: '#888' }}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ color: '#00B16A' }}>🟢 Goal met ({chartData.filter(d => d.hours >= parseFloat(goalHours)).length} days)</span>
            <span style={{ color: '#FF5A1F' }}>🔴 Below goal ({chartData.filter(d => d.hours > 0 && d.hours < parseFloat(goalHours)).length} days)</span>
            <span style={{ color: '#888' }}>Total: {chartData.reduce((a, b) => a + b.hours, 0).toFixed(1)}h</span>
          </div>
        </div>
      )}
    </div>
  )
}