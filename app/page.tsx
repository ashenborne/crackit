'use client'

import { useState } from 'react'
import { auth, googleProvider } from './firebase'
import { signInWithPopup, signOut } from 'firebase/auth'

export default function Home() {
  const [screen, setScreen] = useState('login')
  const [exam, setExam] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      setScreen('exam')
    } catch (err: any) {
      setError('Login failed. Please try again.')
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut(auth)
    setUser(null)
    setScreen('login')
    setExam('')
  }

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'pyqs', icon: '📝', label: 'PYQs' },
    { id: 'dpp', icon: '🎯', label: 'Daily DPP' },
    { id: 'ncert', icon: '📚', label: 'NCERT PDFs' },
    { id: 'books', icon: '📖', label: 'Book PDFs' },
    { id: 'notes', icon: '🗒️', label: 'Short Notes' },
    { id: 'formulas', icon: '🔢', label: 'Formula Sheets' },
    { id: 'donate', icon: '❤️', label: 'Donate' },
  ]

  const [page, setPage] = useState('dashboard')
  const sub3 = exam === 'NEET' ? 'Biology' : 'Mathematics'
  const firstName = user?.displayName?.split(' ')[0] || 'Student'

  if (screen === 'login') return (
    <main style={{ minHeight: '100vh', background: '#0D0D0D', color: 'white', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '48px 56px', width: 420 }}>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>⚡ CrackIt</div>
        <p style={{ color: '#888', marginBottom: 32 }}>Everything to crack JEE & NEET</p>
        {error && <p style={{ color: '#FF5A5A', marginBottom: 16, fontSize: 14 }}>{error}</p>}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '14px 24px', background: 'white', color: 'black', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Signing in...' : '🔵 Continue with Google'}
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
          <button onClick={() => { setExam('JEE'); setScreen('app') }} style={{ padding: '32px 52px', fontSize: 24, fontWeight: 800, borderRadius: 16, border: 'none', background: '#1A3CFF', color: 'white', cursor: 'pointer' }}>
            JEE<br /><span style={{ fontSize: 13, fontWeight: 400, opacity: 0.8 }}>Physics · Chemistry · Maths</span>
          </button>
          <button onClick={() => { setExam('NEET'); setScreen('app') }} style={{ padding: '32px 52px', fontSize: 24, fontWeight: 800, borderRadius: 16, border: 'none', background: '#FF5A1F', color: 'white', cursor: 'pointer' }}>
            NEET<br /><span style={{ fontSize: 13, fontWeight: 400, opacity: 0.8 }}>Physics · Chemistry · Biology</span>
          </button>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ display: 'flex', minHeight: '100vh', background: '#1A1A1A', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ width: 220, background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>⚡ CrackIt</div>
          <div style={{ fontSize: 11, marginTop: 4, padding: '2px 8px', borderRadius: 50, display: 'inline-block', background: exam === 'JEE' ? '#EEF1FF' : '#FFF0EA', color: exam === 'JEE' ? '#0A1FA8' : '#C43C0A', fontWeight: 600 }}>{exam}</div>
        </div>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setPage(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', cursor: 'pointer', background: page === item.id ? 'rgba(255,255,255,0.08)' : 'none', color: page === item.id ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 2 }}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user?.photoURL && <img src={user.photoURL} style={{ width: 32, height: 32, borderRadius: '50%', marginBottom: 8 }} />}
          <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.displayName}</div>
          <div style={{ fontSize: 11, color: '#888' }}>{user?.email}</div>
          <div onClick={handleSignOut} style={{ fontSize: 12, color: '#FF5A5A', marginTop: 8, cursor: 'pointer' }}>Sign out</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {page === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Good morning, {firstName} 👋</h1>
            <p style={{ color: '#888', marginBottom: 28 }}>Your exam is in <span style={{ color: '#FF5A1F' }}>127 days</span>. Let's make today count.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              {[['🔥 Streak', '24 days'], ['✅ Qs Solved', '1,847'], ['📊 Accuracy', '73%'], ['⏱️ Study Time', '8.5h']].map(([label, val]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
                <div style={{ fontWeight: 700, marginBottom: 16 }}>Subject Progress</div>
                {[['Physics', 64, '#1A3CFF'], ['Chemistry', 81, '#00B16A'], [sub3, 52, '#FF5A1F']].map(([subj, pct, color]) => (
                  <div key={subj as string} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span>{subj}</span><span style={{ color: '#888' }}>{pct}%</span></div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color as string, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
                <div style={{ fontWeight: 700, marginBottom: 16 }}>Today's Schedule</div>
                {[['7:00 AM', 'Revision: Mechanics', 'Physics · 1 hour', '#00B16A'], ['9:00 AM', 'DPP: Organic Chemistry', 'Chemistry · 30 qs', '#1A3CFF'], ['11:00 AM', `${sub3} PYQs`, `${sub3} · 2016–2024`, '#FF5A1F'], ['3:00 PM', 'Mock Test', 'Full syllabus · 3 hours', '#888']].map(([time, title, sub, color]) => (
                  <div key={time as string} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 12, color: '#888', minWidth: 52 }}>{time}</div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color as string, marginTop: 4, flexShrink: 0 }} />
                    <div><div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div><div style={{ fontSize: 11, color: '#888' }}>{sub}</div></div>
                  </div>
                ))}
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

        {page === 'donate' && (
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