import React from 'react'
import { motion } from 'framer-motion'

const InitialState: React.FC = () => {
  return (
    <div className="initial-state">
      <motion.div 
        className="welcome-card"
        initial={{ opacity: 0, x: 30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          type: "spring", 
          stiffness: 100, 
          damping: 20 
        }}
      >
        <div className="welcome-message">
          <h2>Welcome to the Trivia Dashboard!</h2>
          <p>Please select number of questions and click "Fetch Questions" above to start visualizing trivia data</p>
        </div>
      </motion.div>
    </div>
  )
}

export default InitialState