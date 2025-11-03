import { useState } from 'react'

interface UseUIStateReturn {
  // Control state
  questionCount: number
  fetchCount: number
  selectedCategory: number | null
  
  // Panel state
  showInfoPanel: boolean
  
  // Actions
  setQuestionCount: (count: number) => void
  setFetchCount: (count: number) => void
  setSelectedCategory: (categoryId: number | null) => void
  setShowInfoPanel: (show: boolean) => void
  toggleInfoPanel: () => void
}

export const useUIState = (): UseUIStateReturn => {
  const [questionCount, setQuestionCount] = useState(50)
  const [fetchCount, setFetchCount] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(true)

  const toggleInfoPanel = () => {
    setShowInfoPanel(!showInfoPanel)
  }

  return {
    // Control state
    questionCount,
    fetchCount,
    selectedCategory,
    
    // Panel state
    showInfoPanel,
    
    // Actions
    setQuestionCount,
    setFetchCount,
    setSelectedCategory,
    setShowInfoPanel,
    toggleInfoPanel
  }
}