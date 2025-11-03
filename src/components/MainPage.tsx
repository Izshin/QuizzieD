import { motion } from 'framer-motion'
import { useState } from 'react'
import TriviaViz from './TriviaViz'

const MainPage = () => {
  const [activeSection, setActiveSection] = useState('trivia')

  const menuItems = [
    { id: 'trivia', label: 'Trivia Dashboard' },
    { id: 'contact', label: 'Contact' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'trivia':
        return (
          <motion.div
            key="trivia-section"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <TriviaViz />
          </motion.div>
        )
      case 'contact':
        return (
          <div className="content-section">
            <motion.h2
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              key="contact-title"
              style={{ 
                fontSize: '3rem', 
                background: 'linear-gradient(45deg, #f7ab55ff, #f43facff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '2rem'
              }}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              key="contact-desc"
              style={{ color: '#888', fontSize: '1.2rem' }}
            >
              ivaferlimjob@gmail.com
              <br />
              <a href="mailto:ivaferlimjob@gmail.com">Send an Email</a>
            </motion.p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="main-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="top-menu">
        <motion.div
          className="logo-text"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          QuizzieD
        </motion.div>
        
        <motion.ul
          className="menu-items"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </li>
          ))}
        </motion.ul>
      </nav>
      
      <div className="content-container">
        {renderContent()}
      </div>
    </motion.div>
  )
}

export default MainPage