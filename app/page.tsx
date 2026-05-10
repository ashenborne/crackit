'use client'

import { useState } from 'react'

export default function Home() {
  const [screen, setScreen] = useState('login')
  const [exam, setExam] = useState('')

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0D0D0D',
      color: 'white',
      fontFamily: 'sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {screen === 'login' && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 40, marginBottom: 8 }}>CrackIt 🎯</h1>
          <p style={{ color: '#888', marginBottom: 32 }}>Everything to crack JEE & NEET</p>
          <button
            onClick={() => setScreen('exam')}
            style={{
              padding: '14px 32px',
              background: 'white',
              color: 'black',
              border: 'none',
              borderRadius: 10,
              fontSize: 16,
              cursor: 'pointer'
            }}>
            Continue with Google
          </button>
        </div>
      )}

      {screen === 'exam' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, marginBottom: 32 }}>Which exam?</h2>
          <div style={{ display: 'flex', gap: 20 }}>
            <button onClick={() => { setExam('JEE'); setScreen('dashboard') }}
              style={{ padding: '24px 48px', fontSize: 20, borderRadius: 12, border: 'none', background: '#1A3CFF', color: 'white', cursor: 'pointer' }}>
              JEE
            </button>
            <button onClick={() => { setExam('NEET'); setScreen('dashboard') }}
              style={{ padding: '24px 48px', fontSize: 20, borderRadius: 12, border: 'none', background: '#FF5A1F', color: 'white', cursor: 'pointer' }}>
              NEET
            </button>
          </div>
        </div>
      )}

      {screen === 'dashboard' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 32 }}>Welcome to {exam} Dashboard!</h2>
          <p style={{ color: '#888', marginTop: 12 }}>Your prep starts here 🚀</p>
        </div>
      )}
    </main>
  )
}