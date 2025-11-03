import React from 'react'
import Sliders from './Sliders'
import ActionButtons from './ActionButtons'

interface ControlPanelProps {
  questionCount: number
  fetchCount: number
  onQuestionCountChange: (count: number) => void
  onFetchCountChange: (count: number) => void
  onFetchQuestions: () => void
  onResetSession: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  questionCount,
  fetchCount,
  onQuestionCountChange,
  onFetchCountChange,
  onFetchQuestions,
  onResetSession
}) => {
  return (
    <div className="compact-controls">
      <Sliders
        questionCount={questionCount}
        fetchCount={fetchCount}
        onQuestionCountChange={onQuestionCountChange}
        onFetchCountChange={onFetchCountChange}
      />
      <ActionButtons
        questionCount={questionCount}
        fetchCount={fetchCount}
        onFetchQuestions={onFetchQuestions}
        onResetSession={onResetSession}
      />
    </div>
  )
}

export default ControlPanel