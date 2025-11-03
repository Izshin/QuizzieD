import React from 'react'

const InitialState: React.FC = () => {
  return (
    <div className="initial-state">
      <div className="welcome-message">
        <h2>Welcome to the Trivia Dashboard!</h2>
        <p>Please select number of questions and click "Fetch Questions" above to start visualizing trivia data</p>
      </div>
    </div>
  )
}

export default InitialState