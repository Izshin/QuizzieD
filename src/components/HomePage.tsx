import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleFindOut = () => {
    // Trigger global transition
    window.dispatchEvent(new Event('startTransition'))
    
    // Navigate to main page when wave reaches the summit/center (at 1.25s - halfway through 2.5s animation)
    setTimeout(() => {
      navigate('/main')
    }, 1250)
  }

  return (
    <>
      <motion.div
        className="homepage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="title"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.3 }}
        >
          QuizzieD!
        </motion.h1>
        
        <motion.p
          className="slogan"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Did you ever wonder what people ask every day?
        </motion.p>
        
        <motion.button
          className="find-out-btn"
          onClick={handleFindOut}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Find Out!
        </motion.button>
      </motion.div>


    </>
  )
}

export default HomePage