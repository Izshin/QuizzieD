import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import MainPage from './components/MainPage'
import './App.css'

function AppContent() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const location = useLocation()

  // Listen for transition events
  useEffect(() => {
    const handleTransition = () => {
      setIsTransitioning(true)
      setTimeout(() => setIsTransitioning(false), 2500)
    }

    window.addEventListener('startTransition', handleTransition)
    return () => window.removeEventListener('startTransition', handleTransition)
  }, [])

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </AnimatePresence>

      {/* Global Transition Overlay */}
      {isTransitioning && (
        <motion.div
          className="transition-overlay"
          initial={{ x: '100%' }}
          animate={{ 
            x: ['100%', '0%','0%', '100%'],
          }}
          exit={{ x: '100%' }}
          transition={{ 
            duration: 2.5, 
            times: [0, 0.5, 1],
            ease: "easeInOut"
          }}
        >
          <div className="question-mark">
            ?
          </div>
        </motion.div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
