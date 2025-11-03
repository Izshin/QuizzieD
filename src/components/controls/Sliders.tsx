import React from 'react'

interface SlidersProps {
  questionCount: number
  fetchCount: number
  onQuestionCountChange: (count: number) => void
  onFetchCountChange: (count: number) => void
}

const Sliders: React.FC<SlidersProps> = ({
  questionCount,
  fetchCount,
  onQuestionCountChange,
  onFetchCountChange
}) => {
  return (
    <div className="sliders-section">
      <div className="slider-group">
        <input
          type="range"
          min="10"
          max="50"
          step="10"
          value={questionCount}
          onChange={(e) => onQuestionCountChange(Number(e.target.value))}
          className="control-slider"
          style={{
            background: `linear-gradient(90deg, 
              var(--theme-purple) 0%, 
              var(--theme-pink) ${((questionCount - 10) / (50 - 10)) * 100}%, 
              rgba(139, 92, 246, 0.2) ${((questionCount - 10) / (50 - 10)) * 100}%, 
              rgba(139, 92, 246, 0.2) 100%)`
          }}
        />
        <span className="slider-value">{questionCount}</span>
      </div>
      <div className="slider-group">
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={fetchCount}
          onChange={(e) => onFetchCountChange(Number(e.target.value))}
          className="control-slider"
          style={{
            background: `linear-gradient(90deg, 
              var(--theme-purple) 0%, 
              var(--theme-pink) ${((fetchCount - 1) / (3 - 1)) * 100}%, 
              rgba(139, 92, 246, 0.2) ${((fetchCount - 1) / (3 - 1)) * 100}%, 
              rgba(139, 92, 246, 0.2) 100%)`
          }}
        />
        <span className="slider-value">{fetchCount}</span>
      </div>
    </div>
  )
}

export default Sliders