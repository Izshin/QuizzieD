import React from 'react'

interface ErrorStateProps {
  error: string
  onRetry: () => void
  onResetSession: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onResetSession }) => {
  return (
    <div className="trivia-viz error">
      <h3>Oops! Something went wrong</h3>
      <p>{error}</p>
      <button onClick={onRetry} className="retry-btn">
        Try Again
      </button>
      <button onClick={onResetSession} className="retry-btn">
        Reset Session
      </button>
    </div>
  )
}

export default ErrorState