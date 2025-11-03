import React from 'react'

interface ActionButtonsProps {
  questionCount: number
  fetchCount: number
  onFetchQuestions: () => void
  onResetSession: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  questionCount,
  fetchCount,
  onFetchQuestions,
  onResetSession
}) => {
  return (
    <>
      <button onClick={onFetchQuestions} className="fetch-btn-main">
        Fetch Questions!
      </button>

      <div className="total-section">
        <div className="total-label">Total questions:</div>
        <div className="total-value">{Math.min(questionCount * fetchCount, 150)}</div>
      </div>

      <button onClick={onResetSession} className="reset-btn-main">
        Reset Session
      </button>
    </>
  )
}

export default ActionButtons