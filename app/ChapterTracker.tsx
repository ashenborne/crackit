'use client'

import { useState } from 'react'

const TASKS = ['Lecture', 'NCERT', 'NCERT Exemplar', 'PYQs', 'DPP', 'Revision', 'Test']

const NEET_CHAPTERS: Record<string, string[]> = {
  Physics: [
    'Physical World & Measurement', 'Kinematics', 'Laws of Motion', 'Work Energy & Power',
    'Motion of System of Particles', 'Gravitation', 'Properties of Bulk Matter',
    'Thermodynamics', 'Kinetic Theory of Gases', 'Oscillations & Waves',
    'Electrostatics', 'Current Electricity', 'Magnetic Effects of Current',
    'Magnetism & Matter', 'Electromagnetic Induction', 'Alternating Current',
    'Electromagnetic Waves', 'Ray Optics', 'Wave Optics',
    'Dual Nature of Matter', 'Atoms', 'Nuclei', 'Semiconductor Devices'
  ],
  Chemistry: [
    'Some Basic Concepts', 'Structure of Atom', 'Classification of Elements',
    'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium',
    'Redox Reactions', 'Hydrogen', 's-Block Elements', 'p-Block Elements (11)',
    'Organic Chemistry Basics', 'Hydrocarbons', 'Environmental Chemistry',
    'Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics',
    'Surface Chemistry', 'd & f Block Elements', 'Coordination Compounds',
    'Haloalkanes & Haloarenes', 'Alcohols Phenols Ethers', 'Aldehydes & Ketones',
    'Carboxylic Acids', 'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'
  ],
  Biology: [
    'The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom',
    'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals',
    'Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle & Division',
    'Transport in Plants', 'Mineral Nutrition', 'Photosynthesis', 'Respiration in Plants',
    'Plant Growth & Development', 'Digestion & Absorption', 'Breathing & Exchange of Gases',
    'Body Fluids & Circulation', 'Excretory Products', 'Locomotion & Movement',
    'Neural Control & Coordination', 'Chemical Coordination',
    'Reproduction in Organisms', 'Sexual Reproduction in Flowering Plants',
    'Human Reproduction', 'Reproductive Health',
    'Principles of Inheritance', 'Molecular Basis of Inheritance', 'Evolution',
    'Human Health & Disease', 'Strategies for Enhancement in Food Production',
    'Microbes in Human Welfare', 'Biotechnology Principles', 'Biotechnology Applications',
    'Organisms & Populations', 'Ecosystem', 'Biodiversity', 'Environmental Issues'
  ]
}

const JEE_CHAPTERS: Record<string, string[]> = {
  Physics: NEET_CHAPTERS.Physics,
  Chemistry: NEET_CHAPTERS.Chemistry,
  Mathematics: [
    'Sets, Relations & Functions', 'Complex Numbers', 'Matrices & Determinants',
    'Permutations & Combinations', 'Binomial Theorem', 'Sequences & Series',
    'Limits, Continuity & Differentiability', 'Integral Calculus', 'Differential Equations',
    'Coordinate Geometry — Straight Lines', 'Coordinate Geometry — Circles',
    'Coordinate Geometry — Parabola', 'Coordinate Geometry — Ellipse', 'Coordinate Geometry — Hyperbola',
    'Vector Algebra', '3D Geometry', 'Statistics & Probability',
    'Trigonometry', 'Inverse Trigonometry', 'Mathematical Reasoning'
  ]
}

export default function ChapterTracker({ exam }: { exam: string }) {
  const chapters = exam === 'NEET' ? NEET_CHAPTERS : JEE_CHAPTERS
  const subjects = Object.keys(chapters)

  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [progress, setProgress] = useState<Record<string, Record<string, boolean>>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crackit_chapters')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

  const toggleTask = (chapter: string, task: string) => {
    const key = `${selectedSubject}__${chapter}__${task}`
    const updated = { ...progress, [key]: !progress[key] }
    setProgress(updated)
    localStorage.setItem('crackit_chapters', JSON.stringify(updated))
  }

  const getChapterPct = (chapter: string) => {
    const done = TASKS.filter(t => progress[`${selectedSubject}__${chapter}__${t}`]).length
    return Math.round((done / TASKS.length) * 100)
  }

  const getSubjectPct = (subject: string) => {
    const allChapters = chapters[subject]
    const totalTasks = allChapters.length * TASKS.length
    const doneTasks = allChapters.reduce((acc, chapter) => {
      return acc + TASKS.filter(t => progress[`${subject}__${chapter}__${t}`]).length
    }, 0)
    return Math.round((doneTasks / totalTasks) * 100)
  }

  const subjectColors: Record<string, string> = {
    Physics: '#1A3CFF',
    Chemistry: '#00B16A',
    Biology: '#FF5A1F',
    Mathematics: '#9B59B6'
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>✅ Chapter Tracker</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>Track your progress chapter by chapter</p>

      {/* Subject Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${subjects.length}, 1fr)`, gap: 16, marginBottom: 28 }}>
        {subjects.map(subject => {
          const pct = getSubjectPct(subject)
          const color = subjectColors[subject] || '#FF5A1F'
          return (
            <div key={subject} onClick={() => setSelectedSubject(subject)}
              style={{ background: selectedSubject === subject ? `rgba(${subject === 'Physics' ? '26,60,255' : subject === 'Chemistry' ? '0,177,106' : subject === 'Mathematics' ? '155,89,182' : '255,90,31'},0.15)` : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedSubject === subject ? color : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 20, cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{subject}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{chapters[subject].length} chapters</div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, marginBottom: 4 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 12, color, fontWeight: 600 }}>{pct}% complete</div>
            </div>
          )
        })}
      </div>

      {/* Chapter List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {chapters[selectedSubject].map((chapter, idx) => {
          const pct = getChapterPct(chapter)
          const color = subjectColors[selectedSubject] || '#FF5A1F'
          const isExpanded = expandedChapter === chapter
          return (
            <div key={chapter} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div onClick={() => setExpandedChapter(isExpanded ? null : chapter)}
                style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#888', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{chapter}</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, color, fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{pct}%</div>
                <div style={{ fontSize: 12, color: '#888' }}>{isExpanded ? '▲' : '▼'}</div>
              </div>

              {isExpanded && (
                <div style={{ padding: '0 18px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {TASKS.map(task => {
                    const key = `${selectedSubject}__${chapter}__${task}`
                    const done = progress[key]
                    return (
                      <div key={task} onClick={() => toggleTask(chapter, task)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: done ? `rgba(${selectedSubject === 'Physics' ? '26,60,255' : selectedSubject === 'Chemistry' ? '0,177,106' : selectedSubject === 'Mathematics' ? '155,89,182' : '255,90,31'},0.15)` : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? color : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer' }}>
                        <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${done ? color : 'rgba(255,255,255,0.2)'}`, background: done ? color : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {done && <span style={{ fontSize: 11, color: 'white', fontWeight: 800 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: 12, color: done ? 'white' : '#888', fontWeight: done ? 600 : 400 }}>{task}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}