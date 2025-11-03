import React from 'react'

interface LoadingStateProps {
  sessionInfo: string
}

const LoadingState: React.FC<LoadingStateProps> = ({ sessionInfo }) => {
  return (
    <div className="trivia-viz loading">
      <div className="loading-spinner">🎯</div>
      <p>Loading trivia data...</p>
      <p className="session-info">{sessionInfo}</p>
    </div>
  )
}

export default LoadingState