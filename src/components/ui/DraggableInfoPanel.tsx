import React, { useState, useEffect, useCallback } from 'react'

interface DraggableInfoPanelProps {
  sessionInfo: string
  showInfoPanel: boolean
  onTogglePanel: () => void
}

const DraggableInfoPanel: React.FC<DraggableInfoPanelProps> = ({
  sessionInfo,
  showInfoPanel,
  onTogglePanel
}) => {
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)

  // Drag handlers for the info panel
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-indicator')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - panelPosition.x,
        y: e.clientY - panelPosition.y
      })
      e.preventDefault()
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPanelPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Animated toggle function
  const handleTogglePanel = () => {
    setIsAnimating(true)
    onTogglePanel()
    setTimeout(() => setIsAnimating(false), 400)
  }

  if (!sessionInfo) {
    return null
  }

  return (
    <div 
      className={`draggable-info-panel ${showInfoPanel ? 'visible' : 'hidden'} ${isDragging ? 'dragging' : ''} ${isAnimating ? 'animating' : ''}`}
      style={{
        transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="info-panel-header">
        <span 
          className="info-panel-title"
          onClick={handleTogglePanel}
        >
          📊 Info Panel
        </span>
        <span className="drag-indicator">⋮⋮</span>
      </div>
      <div className={`session-content ${showInfoPanel ? 'expanded' : 'collapsed'}`}>
        <p className="session-info">{sessionInfo}</p>
      </div>
    </div>
  )
}

export default DraggableInfoPanel