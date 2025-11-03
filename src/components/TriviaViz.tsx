import React from 'react'
import { useTriviaData, useUIState } from '../hooks'
import { ControlPanel, CategoryFilter } from './controls'
import { CategoryPieChart, DifficultyBarChart, DifficultyTreemap, DifficultyRadarChart } from './charts'
import { DraggableInfoPanel, StatisticsGrid, LoadingState, ErrorState, InitialState } from './ui'

const TriviaViz: React.FC = () => {
  // Custom hooks for data and UI state management
  const {
    loading,
    error,
    allQuestions,
    availableCategories,
    stats,
    radarData,
    sessionInfo,
    hasDataToShow,
    fetchData,
    resetSession,
    filterQuestionsByCategory
  } = useTriviaData()

  const {
    questionCount,
    fetchCount,
    selectedCategory,
    showInfoPanel,
    setQuestionCount,
    setFetchCount,
    setSelectedCategory,
    setShowInfoPanel,
    toggleInfoPanel
  } = useUIState()

  // Event handlers
  const handleFetchQuestions = () => {
    console.log('🎯 Manual fetch triggered:', { questionCount, fetchCount })
    setShowInfoPanel(true)
    setSelectedCategory(null)
    fetchData(questionCount, fetchCount, undefined)
  }

  const handleResetSession = async () => {
    setShowInfoPanel(true)
    await resetSession()
    setSelectedCategory(null)
  }

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    filterQuestionsByCategory(categoryId)
  }

  const getQuestionsInCategory = (categoryName: string): number => {
    return allQuestions.filter(q => q.category === categoryName).length
  }

  // Loading state
  if (loading) {
    return <LoadingState sessionInfo={sessionInfo} />
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={handleFetchQuestions}
        onResetSession={handleResetSession}
      />
    )
  }



  return (
    <div className="trivia-viz">
      {/* Draggable Info Panel */}
      <DraggableInfoPanel
        sessionInfo={sessionInfo}
        showInfoPanel={showInfoPanel}
        onTogglePanel={toggleInfoPanel}
      />

      {/* Header */}
      <div className="trivia-header">
        <h1 className="trivia-title">Trivia Dashboard:</h1>
        <p className="trivia-subtitle">
          Visualization of trivia questions from OpenTDB
        </p>
      </div>

      {/* Control Panel */}
      <ControlPanel
        questionCount={questionCount}
        fetchCount={fetchCount}
        onQuestionCountChange={setQuestionCount}
        onFetchCountChange={setFetchCount}
        onFetchQuestions={handleFetchQuestions}
        onResetSession={handleResetSession}
      />

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        availableCategories={availableCategories}
        totalQuestions={stats.totalQuestions}
        onCategoryChange={handleCategoryChange}
        getQuestionsInCategory={getQuestionsInCategory}
      />

      {/* Data Visualization */}
      {hasDataToShow ? (
        <>
          {/* Top Row: Category/Treemap and Difficulty Charts */}
          <div className="charts-row">
            {/* Category Distribution - Only show when viewing all categories */}
            {!selectedCategory && (
              <CategoryPieChart data={stats.categories} />
            )}

            {/* Difficulty Treemap - Only show when category is selected */}
            {selectedCategory && (
              <DifficultyTreemap data={stats.difficulties} />
            )}

            {/* Difficulty Bar Chart */}
            <DifficultyBarChart data={stats.difficulties} />
          </div>

          {/* Bottom Row: Radar Chart */}
          <DifficultyRadarChart data={radarData} />
        </>
      ) : (
        /* Initial State Message */
        <InitialState />
      )}

      {/* Statistics Grid */}
      <StatisticsGrid stats={stats} />
    </div>
  )
}

export default TriviaViz