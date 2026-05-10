'use client'

import { useState, useEffect } from 'react'
import { auth, googleProvider } from './firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import CalendarPage from './CalendarPage'
import ChapterTracker from './ChapterTracker'

export default function Home() {
  const [screen, setScreen] = useState('loading')
  const [exam, setExam] = useState('')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userName, setUserName] = useState(() => {
  if (typeof window !== 'undefined') return localStorage.getItem('crackit_name') || ''
  return ''
})
const [nameInput, setNameInput] = useState('')
  const [schedule, setSchedule] = useState<Record<string, any[]>>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('crackit_schedule')
    return saved ? JSON.parse(saved) : {}
  }
  return {}
})
const [showAddTask, setShowAddTask] = useState(false)
const [clock, setClock] = useState(new Date())
const [streak, setStreak] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('crackit_streak')
    return saved ? JSON.parse(saved) : { count: 0, lastCompleted: '' }
  }
  return { count: 0, lastCompleted: '' }
})
const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0])

useEffect(() => {
  const timer = setInterval(() => setClock(new Date()), 1000)
  return () => clearInterval(timer)
}, [])
const [taskForm, setTaskForm] = useState({ time: '', title: '', subject: '', duration: '' })


useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      setUser(firebaseUser)
      const savedExam = localStorage.getItem('crackit_exam')
      if (savedExam) {
  setExam(savedExam)
  const savedName = localStorage.getItem('crackit_name')
  if (savedName) {
    setUserName(savedName)
    setScreen('app')
  } else {
    setScreen('name')
  }
} else {
  setScreen('exam')
}
    } else {
      setScreen('login')
    }
  })
  return () => unsubscribe()
}, [])

  const handleGoogleLogin = async () => {
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      setScreen('exam')
    } catch (err: any) {
      setError('Login failed. Please try again.')
    }
  }

const handleExamSelect = (selectedExam: string) => {
  setExam(selectedExam)
  localStorage.setItem('crackit_exam', selectedExam)
  setScreen('name')
}
const completeToday = () => {
  const todayStr = new Date().toISOString().split('T')[0]
  if (streak.lastCompleted === todayStr) return
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  const newCount = streak.lastCompleted === yesterdayStr ? streak.count + 1 : 1
  const updated = { count: newCount, lastCompleted: todayStr }
  setStreak(updated)
  localStorage.setItem('crackit_streak', JSON.stringify(updated))
}

const getTimeRemaining = () => {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(23, 59, 59, 999)
  const diff = midnight.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${mins}m`
}

const getGreeting = () => {
  const hour = clock.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
const addTask = () => {
  if (!taskForm.title || !taskForm.time) return
  const todayStr = new Date().toISOString().split('T')[0]
  const updated = { ...schedule, [todayStr]: [...(schedule[todayStr] || []), taskForm] }
  setSchedule(updated)
  localStorage.setItem('crackit_schedule', JSON.stringify(updated))
  setTaskForm({ time: '', title: '', subject: '', duration: '' })
  setShowAddTask(false)
}

  const handleSignOut = async () => {
    await signOut(auth)
    setUser(null)
    setExam('')
    setPage('dashboard')
    localStorage.removeItem('crackit_exam')
    setScreen('login')
  }

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'chapters', icon: '✅', label: 'Chapter Tracker' },
    { id: 'pyqs', icon: '📝', label: 'PYQs' },
    { id: 'dpp', icon: '🎯', label: 'Daily DPP' },
    { id: 'ncert', icon: '📚', label: 'NCERT PDFs' },
    { id: 'books', icon: '📖', label: 'Book PDFs' },
    { id: 'notes', icon: '🗒️', label: 'Short Notes' },
    { id: 'formulas', icon: '🔢', label: 'Formula Sheets' },
{ id: 'calendar', icon: '📅', label: 'Calendar' },
{ id: 'donate', icon: '❤️', label: 'Donate' },  ]

  const sub3 = exam === 'NEET' ? 'Biology' : 'Mathematics'
  const firstName = userName || user?.displayName?.split(' ')[0] || 'Student'

  if (screen === 'loading') return (
    <main style={{ minHeight: '100vh', background: '#0D0D0D', color: 'white', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>⚡ CrackIt</div>
        <div style={{ fontSize: 16, color: '#888' }}>Loading...</div>
      </div>
    </main>
  )

  if (screen === 'login') return (
    <main style={{ minHeight: '100vh', background: '#0D0D0D', color: 'white', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '48px 56px', width: 420 }}>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>⚡ CrackIt</div>
        <p style={{ color: '#888', marginBottom: 32 }}>Everything to crack JEE & NEET</p>
        {error && <p style={{ color: '#FF5A5A', marginBottom: 16, fontSize: 14 }}>{error}</p>}
        <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '14px 24px', background: 'white', color: 'black', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
          🔵 Continue with Google
        </button>
      </div>
    </main>
  )
if (screen === 'name') return (
  <main style={{ minHeight: '100vh', background: '#0D0D0D', color: 'white', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '48px 56px', width: 420 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>What's your name?</h2>
      <p style={{ color: '#888', marginBottom: 28 }}>We'll personalise your dashboard</p>
      <input
        placeholder="Enter your name"
        value={nameInput}
        onChange={e => setNameInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && nameInput.trim()) {
            setUserName(nameInput.trim())
            localStorage.setItem('crackit_name', nameInput.trim())
            setScreen('app')
          }
        }}
        style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 16, marginBottom: 16, boxSizing: 'border-box' }}
      />
      <button
        onClick={() => {
          if (nameInput.trim()) {
            setUserName(nameInput.trim())
            localStorage.setItem('crackit_name', nameInput.trim())
            setScreen('app')
          }
        }}
        style={{ width: '100%', padding: '14px', background: '#FF5A1F', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
        Let's Go 🚀
      </button>
    </div>
  </main>
)
  if (screen === 'exam') return (
    <main style={{ minHeight: '100vh', background: '#0D0D0D', color: 'white', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 8, color: '#888' }}>Logged in as {user?.email}</div>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Which exam?</h2>
        <p style={{ color: '#888', marginBottom: 40 }}>We'll personalise everything for you</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <button onClick={() => handleExamSelect('JEE')} style={{ padding: '32px 52px', fontSize: 24, fontWeight: 800, borderRadius: 16, border: 'none', background: '#1A3CFF', color: 'white', cursor: 'pointer' }}>
            JEE<br /><span style={{ fontSize: 13, fontWeight: 400, opacity: 0.8 }}>Physics · Chemistry · Maths</span>
          </button>
          <button onClick={() => handleExamSelect('NEET')} style={{ padding: '32px 52px', fontSize: 24, fontWeight: 800, borderRadius: 16, border: 'none', background: '#FF5A1F', color: 'white', cursor: 'pointer' }}>
            NEET<br /><span style={{ fontSize: 13, fontWeight: 400, opacity: 0.8 }}>Physics · Chemistry · Biology</span>
          </button>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ display: 'flex', minHeight: '100vh', background: '#1A1A1A', color: 'white', fontFamily: 'sans-serif' }}>

      {showAddTask && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: 420 }}>
      <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>+ Add Task</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input placeholder="Time (e.g. 9:00 AM)" value={taskForm.time} onChange={e => setTaskForm(f => ({ ...f, time: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14 }} />
        <input placeholder="Task title (e.g. Revision: Mechanics)" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14 }} />
        <input placeholder="Subject (e.g. Physics)" value={taskForm.subject} onChange={e => setTaskForm(f => ({ ...f, subject: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14 }} />
        <input placeholder="Duration (e.g. 1 hour)" value={taskForm.duration} onChange={e => setTaskForm(f => ({ ...f, duration: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button onClick={addTask}
          style={{ flex: 1, padding: '12px', background: '#FF5A1F', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          Save Task
        </button>
        <button onClick={() => setShowAddTask(false)}
          style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      {/* Sidebar */}
<div style={{ width: sidebarOpen ? 220 : 0, background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: sidebarOpen ? '24px 0' : 0, overflow: 'hidden', transition: 'width 0.3s ease' }}>        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>⚡ CrackIt</div>
          <div style={{ fontSize: 11, marginTop: 4, padding: '2px 8px', borderRadius: 50, display: 'inline-block', background: exam === 'JEE' ? '#EEF1FF' : '#FFF0EA', color: exam === 'JEE' ? '#0A1FA8' : '#C43C0A', fontWeight: 600 }}>{exam}</div>
        </div>
        <div style={{ padding: '0 20px 12px', marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
  <button onClick={() => setShowAddTask(true)}
    style={{ width: '100%', padding: '8px', background: 'rgba(255,90,31,0.15)', border: '1px dashed rgba(255,90,31,0.4)', borderRadius: 10, color: '#FF5A1F', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
    + Add Today's Task
  </button>
</div>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setPage(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', cursor: 'pointer', background: page === item.id ? 'rgba(255,255,255,0.08)' : 'none', color: page === item.id ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 2 }}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user?.photoURL && <img src={user.photoURL} style={{ width: 32, height: 32, borderRadius: '50%', marginBottom: 8 }} alt="profile" />}
          <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.displayName}</div>
          <div style={{ fontSize: 11, color: '#888' }}>{user?.email}</div>
          <div onClick={handleSignOut} style={{ fontSize: 12, color: '#FF5A5A', marginTop: 8, cursor: 'pointer' }}>Sign out</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 32, overflowY: 'auto', position: 'relative' }}>
  <button onClick={() => setSidebarOpen(o => !o)}
    style={{ position: 'fixed', top: 20, left: sidebarOpen ? 232 : 12, background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', width: 28, height: 28, cursor: 'pointer', fontSize: 14, transition: 'left 0.3s ease', zIndex: 100 }}>
    {sidebarOpen ? '←' : '→'}
  </button>

        {page === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{getGreeting()}, {firstName} 👋</h1>
    <p style={{ color: '#888' }}>Let's make today count.</p>
  </div>
  <div style={{ textAlign: 'right' }}>
    <div style={{ fontSize: 36, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'white' }}>
{clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' })}    </div>
    <div style={{ fontSize: 13, color: '#888' }}>
{clock.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })}    </div>
  </div>
</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>🔥 Streak</div>
  <div style={{ fontSize: 28, fontWeight: 800 }}>{streak.count} days</div>
</div>
<div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>✅ Qs Solved</div>
  <div style={{ fontSize: 28, fontWeight: 800 }}>1,847</div>
</div>
<div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>📊 Accuracy</div>
  <div style={{ fontSize: 28, fontWeight: 800 }}>73%</div>
</div>
<div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>⏱️ Study Time</div>
  <div style={{ fontSize: 28, fontWeight: 800 }}>8.5h</div>
</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
                <div style={{ fontWeight: 700, marginBottom: 16 }}>Subject Progress</div>
{[['Physics', '#1A3CFF'], ['Chemistry', '#00B16A'], [sub3, '#FF5A1F']].map(([subj, color]) => {
  const chapters = exam === 'NEET'
    ? { Physics: 23, Chemistry: 29, Biology: 38 }
    : { Physics: 23, Chemistry: 29, Mathematics: 20 }
  const totalChapters = (chapters as any)[subj as string] || 1
  const TASKS = ['Lecture', 'NCERT', 'NCERT Exemplar', 'PYQs', 'DPP', 'Revision', 'Test']
  const savedProgress = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crackit_chapters') || '{}') : {}
  const totalTasks = totalChapters * TASKS.length
  const doneTasks = Object.keys(savedProgress).filter(k => k.startsWith(`${subj}__`) && savedProgress[k]).length
  const pct = Math.round((doneTasks / totalTasks) * 100)
  return (                  <div key={subj as string} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span>{subj}</span><span style={{ color: '#888' }}>{pct}%</span></div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color as string, borderRadius: 3 }} />
                    </div>
                  </div>
                )})}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
  <div style={{ fontWeight: 700 }}>
    {scheduleDate === new Date().toISOString().split('T')[0] ? "Today's Schedule" : `Schedule — ${new Date(scheduleDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
  </div>
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <button onClick={() => { const d = new Date(scheduleDate); d.setDate(d.getDate() - 1); setScheduleDate(d.toISOString().split('T')[0]) }}
      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'white', width: 24, height: 24, cursor: 'pointer', fontSize: 12 }}>←</button>
    <button onClick={() => { const d = new Date(scheduleDate); d.setDate(d.getDate() + 1); if (d <= new Date()) setScheduleDate(d.toISOString().split('T')[0]) }}
      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'white', width: 24, height: 24, cursor: 'pointer', fontSize: 12 }}>→</button>
  </div>
</div>
{(schedule[scheduleDate] || []).length === 0 ? (
  <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
    {scheduleDate === new Date().toISOString().split('T')[0] ? "No tasks yet — click \"+ Add Today's Task\" in the sidebar!" : 'No tasks were added for this day.'}
  </div>
) : (schedule[scheduleDate] || []).map((task, i) => (
  <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ fontSize: 12, color: '#888', minWidth: 52 }}>{task.time}</div>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5A1F', marginTop: 4, flexShrink: 0 }} />
    <div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{task.title}</div>
      <div style={{ fontSize: 11, color: '#888' }}>{task.subject}{task.duration ? ` · ${task.duration}` : ''}</div>
    </div>
  </div>
))}
{scheduleDate === new Date().toISOString().split('T')[0] && (
  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
    {streak.lastCompleted === new Date().toISOString().split('T')[0] ? (
      <div style={{ textAlign: 'center', color: '#00B16A', fontWeight: 700, fontSize: 14 }}>
        ✅ You completed today! Streak: 🔥 {streak.count} days
      </div>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#FF5A1F' }}>
          ⏰ {getTimeRemaining()} remaining to keep your streak!
        </div>
        <button onClick={completeToday}
          style={{ padding: '8px 16px', background: '#FF5A1F', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          Mark Today Complete ✓
        </button>
      </div>
    )}
  </div>
)}
    </div>
  </div>

              </div>
            
        )}
        {page === 'pyqs' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Previous Year Questions</h1>
            <p style={{ color: '#888', marginBottom: 24 }}>Chapter-wise PYQs from 2000–2024 with solutions</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[['⚡', 'Mechanics', '247 Qs', 'Physics'], ['🧪', 'Organic Chemistry', '183 Qs', 'Chemistry'], ['📐', exam === 'NEET' ? 'Genetics' : 'Calculus', '312 Qs', sub3], ['🔋', 'Electrostatics', '194 Qs', 'Physics'], ['⚗️', 'Coordination Chemistry', '128 Qs', 'Chemistry'], ['🌊', 'Waves & Optics', '167 Qs', 'Physics']].map(([icon, title, qs, subj]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>{subj}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ background: 'rgba(255,255,255,0.07)', padding: '3px 8px', borderRadius: 50 }}>{qs}</span>
                    <span style={{ color: '#FF5A1F' }}>Solve →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'dpp' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Daily Practice Problems</h1>
            <p style={{ color: '#888', marginBottom: 24 }}>30 hand-picked questions every day</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['10', 'Thermodynamics', 'Today · Chemistry', 'New', '#FF5A1F'], ['9', 'Optics', 'Yesterday · Physics', 'Done ✓', '#00B16A'], ['8', exam === 'NEET' ? 'Cell Biology' : 'Calculus', `2 days ago · ${sub3}`, 'Done ✓', '#00B16A'], ['7', 'Electrochemistry', '3 days ago · Chemistry', 'Done ✓', '#00B16A'], ['11', 'Modern Physics', 'Unlocks tomorrow', '🔒 Locked', '#888']].map(([num, title, sub, status, color]) => (
                <div key={num as string} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: color as string }}>{num}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>DPP #{num} — {title}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{sub}</div>
                  </div>
                  <div style={{ padding: '5px 12px', borderRadius: 50, fontSize: 12, background: color === '#00B16A' ? 'rgba(0,177,106,0.12)' : color === '#FF5A1F' ? 'rgba(255,90,31,0.12)' : 'rgba(255,255,255,0.06)', color: color as string }}>{status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'ncert' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>NCERT PDFs</h1>
            <p style={{ color: '#888', marginBottom: 24 }}>Class 11 & 12 — all subjects</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[['📘', 'Physics Part I — Class 11', '22 MB'], ['📘', 'Physics Part II — Class 12', '18 MB'], ['📗', 'Chemistry Part I — Class 11', '16 MB'], ['📗', 'Chemistry Part II — Class 12', '19 MB'], ['📙', `${sub3} — Class 11`, '24 MB'], ['📙', `${sub3} — Class 12`, '28 MB']].map(([icon, title, size]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 14 }}>{title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ background: 'rgba(255,255,255,0.07)', padding: '3px 8px', borderRadius: 50 }}>PDF · {size}</span>
                    <span style={{ color: '#FF5A1F' }}>Download ↓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'books' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Reference Book PDFs</h1>
            <p style={{ color: '#888', marginBottom: 24 }}>Toppers' recommended books</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[['⚡', 'HC Verma — Concepts of Physics', 'Physics'], ['🧪', 'MS Chauhan — Organic Chemistry', 'Chemistry'], ['🔬', 'VK Jaiswal — Inorganic Chemistry', 'Chemistry'], ['📐', exam === 'NEET' ? 'AK Jain — Human Physiology' : 'SL Loney — Trigonometry', sub3], ['🔭', 'DC Pandey — Optics', 'Physics'], ['📊', exam === 'NEET' ? "Trueman's Biology" : 'Arihant — Algebra', exam === 'NEET' ? 'Biology' : sub3]].map(([icon, title, subj]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>{subj}</div>
                  <span style={{ color: '#FF5A1F', fontSize: 12 }}>Read →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'notes' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Short Notes</h1>
            <p style={{ color: '#888', marginBottom: 24 }}>Concise revision notes — Kota style</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[['🔥', 'Thermodynamics Quick Notes', 'Physics'], ['⚛️', 'Atomic Structure', 'Chemistry'], [exam === 'NEET' ? '🧬' : '📐', exam === 'NEET' ? 'Cell Biology Notes' : 'Differentiation & Limits', sub3], ['🧲', 'Electromagnetism Summary', 'Physics'], ['🏗️', 'Chemical Bonding', 'Chemistry'], [exam === 'NEET' ? '🌿' : '📊', exam === 'NEET' ? 'Ecology & Environment' : 'Probability & Statistics', sub3]].map(([icon, title, subj]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>{subj}</div>
                  <span style={{ color: '#FF5A1F', fontSize: 12 }}>View →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'formulas' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Formula Sheets</h1>
            <p style={{ color: '#888', marginBottom: 24 }}>Print and stick on your wall</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[['📋', 'Physics — Master Sheet', '4 pages'], ['📋', 'Chemistry — Reactions', '6 pages'], ['📋', `${sub3} — Formulas`, '8 pages'], ['📋', 'Physical Chemistry Constants', '1 page'], ['📋', 'Organic Reactions Mind Map', '2 pages'], ['📋', 'Periodic Table — Extended', '1 page']].map(([icon, title, pages]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 14 }}>{title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ background: 'rgba(255,255,255,0.07)', padding: '3px 8px', borderRadius: 50 }}>{pages}</span>
                    <span style={{ color: '#FF5A1F' }}>Download ↓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       {page === 'chapters' && (
  <ChapterTracker exam={exam} />
)} 
        {page === 'calendar' && (
  <CalendarPage exam={exam} />
)}{page === 'donate' && (
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 48 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>❤️</div>
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Help us stay free</h1>
            <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 36 }}>CrackIt is completely free and always will be. If it has helped you, consider buying us a chai ☕</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
              {['₹99', '₹299', '₹499', '₹999'].map(amt => (
                <button key={amt} style={{ padding: '12px 28px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.1)', background: amt === '₹299' ? '#FF5A1F' : 'none', color: 'white', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>{amt}</button>
              ))}
            </div>
            <button style={{ padding: '16px 48px', borderRadius: 12, background: '#FF5A1F', border: 'none', color: 'white', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>Donate ₹299 via UPI</button>
            <p style={{ fontSize: 13, color: '#888', marginTop: 16 }}>UPI · Credit/Debit Card · Net Banking</p>
          </div>
        )}

      </div>
    </main>
  )
}