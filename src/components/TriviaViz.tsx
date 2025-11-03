import React, { useState, useEffect, useCallback } from 'react'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap
} from 'recharts'
import type { TriviaCategory, TriviaQuestion } from '../types/trivia'
import { TriviaAPI } from '../services/triviaAPI'

// Enhanced color palette using theme colors
const COLORS = [
  '#ec4899', // theme-pink
  '#8b5cf6', // theme-purple  
  '#0ea5e9', // theme-sky
  '#14b8a6', // theme-teal
  '#fb923c', // theme-orange
  '#6366f1', // theme-indigo
  '#f43f5e', // theme-rose
  '#a855f7', // theme-violet
  '#ef4444', // theme-red
  '#ff8a65', // theme-vibrant-orange
  '#ff0080'  // theme-bright-pink
]

interface ChartStats {
  categories: Array<{ name: string; value: number }>
  difficulties: Array<{ name: string; value: number }>
  totalQuestions: number
}

interface RadarData {
  subject: string
  value: number
  fullMark: number
}

const TriviaViz: React.FC = () => {
  const [loading, setLoading] = useState(false) // Start with no loading
  const [error, setError] = useState<string | null>(null)
  const [questionCount, setQuestionCount] = useState(50)
  const [fetchCount, setFetchCount] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(true) // State for info panel visibility
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 }) // Panel position
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [allCategories, setAllCategories] = useState<TriviaCategory[]>([]) // All available categories
  const [availableCategories, setAvailableCategories] = useState<TriviaCategory[]>([]) // Categories in current question set
  const [allQuestions, setAllQuestions] = useState<TriviaQuestion[]>([]) // Store all fetched questions
  const [stats, setStats] = useState<ChartStats>({
    categories: [],
    difficulties: [],
    totalQuestions: 0
  })
  const [radarData, setRadarData] = useState<RadarData[]>([])
  const [sessionInfo, setSessionInfo] = useState<string>('Click "Fetch Questions" to start!')
  const [hasDataToShow, setHasDataToShow] = useState(false) // Track if we have data to display

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('🔄 Loading all categories from API...')
        const fetchedCategories = await TriviaAPI.fetchCategories()
        console.log('📋 Loaded categories:', fetchedCategories.length)
        setAllCategories(fetchedCategories)
      } catch (err) {
        console.error('❌ Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  const processQuestions = useCallback((questionsArray: TriviaQuestion[]): ChartStats => {
    const categoryCount: Record<string, number> = {}
    const difficultyCount: Record<string, number> = {}

    questionsArray.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1
      difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1
    })

    return {
      categories: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
      difficulties: Object.entries(difficultyCount).map(([name, value]) => ({ name, value })),
      totalQuestions: questionsArray.length
    }
  }, [])

  const generateRadarData = useCallback((questionsArray: TriviaQuestion[]): RadarData[] => {
    const difficulties = ['easy', 'medium', 'hard']
    const difficultyCount: Record<string, number> = {}
    
    questionsArray.forEach(q => {
      difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1
    })

    const maxCount = Math.max(...Object.values(difficultyCount), 1)

    return difficulties.map(diff => ({
      subject: diff.charAt(0).toUpperCase() + diff.slice(1),
      value: difficultyCount[diff] || 0,
      fullMark: maxCount
    }))
  }, [])

  const updateAvailableCategories = useCallback((questions: TriviaQuestion[]) => {
    console.log('🔄 Updating available categories based on questions...')
    const categoryNames = [...new Set(questions.map(q => q.category))]
    console.log('📋 Unique categories in questions:', categoryNames)
    
    const filteredCategories = allCategories.filter(cat => 
      categoryNames.includes(cat.name)
    )
    console.log('✅ Available categories:', filteredCategories)
    setAvailableCategories(filteredCategories)
  }, [allCategories])

  const fetchData = useCallback(async (questionsPerFetch: number, numberOfFetches: number, categoryId?: number) => {
    try {
      setLoading(true)
      setError(null)
      setSessionInfo('🔐 Getting session token...')
      console.log('🎯 Starting sequential fetch:', { questionsPerFetch, numberOfFetches, categoryId })
      
      // Step 1: Ensure we have a session token
      console.log('🔐 Step 1: Getting session token...')
      const token = await TriviaAPI.getSessionToken()
      console.log('✅ Session token obtained:', token ? 'YES' : 'NO')
      
      // Step 2: Sequential fetching with delays
      let accumulatedQuestions: TriviaQuestion[] = []
      
      for (let i = 0; i < numberOfFetches; i++) {
        setSessionInfo(`📥 Fetching batch ${i + 1} of ${numberOfFetches}...`)
        console.log(`📥 Step 2.${i + 1}: Fetching batch ${i + 1}...`)
        
        try {
          // Wait before each fetch (except the first one) to avoid rate limiting
          if (i > 0) {
            console.log('⏱️ Waiting 6 seconds to avoid rate limit...')
            await new Promise(resolve => setTimeout(resolve, 6000))
          }
          
          const batchQuestions = await TriviaAPI.fetchQuestions(questionsPerFetch, categoryId)
          console.log(`✅ Batch ${i + 1} fetched:`, batchQuestions.length, 'questions')
          
          // Accumulate questions
          accumulatedQuestions = [...accumulatedQuestions, ...batchQuestions]
          console.log(`📊 Total accumulated:`, accumulatedQuestions.length, 'questions')
          
          // Update UI with accumulated progress AND live chart updates
          setAllQuestions([...accumulatedQuestions]) // Update stored questions
          const intermediateStats = processQuestions(accumulatedQuestions)
          setStats(intermediateStats)
          setRadarData(generateRadarData(accumulatedQuestions))
          updateAvailableCategories(accumulatedQuestions)
          
          setSessionInfo(`✅ Batch ${i + 1}/${numberOfFetches} complete (${accumulatedQuestions.length} total questions)`)
          
        } catch (batchError) {
          console.error(`❌ Error in batch ${i + 1}:`, batchError)
          const errorMessage = batchError instanceof Error ? batchError.message : 'Batch fetch failed'
          
          if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
            console.log('⏱️ Rate limited, waiting 10 seconds...')
            setSessionInfo(`⏱️ Rate limited, waiting 10 seconds before batch ${i + 1}...`)
            await new Promise(resolve => setTimeout(resolve, 10000))
            // Retry this batch
            i--
            continue
          } else {
            throw batchError
          }
        }
      }
      
      console.log('📥 Final accumulated questions:', accumulatedQuestions.length)
      
      // Step 3: Store and display data
      console.log('🎯 Step 3: Processing and displaying data...')
      setAllQuestions(accumulatedQuestions)
      
      // Update charts with accumulated questions
      const processedStats = processQuestions(accumulatedQuestions)
      setStats(processedStats)
      setRadarData(generateRadarData(accumulatedQuestions))
      
      // Update available categories dropdown
      updateAvailableCategories(accumulatedQuestions)
      
      setSessionInfo(`🎉 Successfully fetched ${accumulatedQuestions.length} questions in ${numberOfFetches} batches!`)
      console.log('🎉 Fetch flow completed successfully')
      
      // Enable data visualization
      setHasDataToShow(true)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('❌ Fetch flow error:', errorMessage)
      setError(errorMessage)
      setSessionInfo(`❌ Error: ${errorMessage}`)
      
      // Handle specific error cases
      if (errorMessage.includes('exhausted')) {
        setSessionInfo('🔄 Session token exhausted. Reset session and try again.')
      } else if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        setSessionInfo('⏱️ Rate limited. Please wait a moment and try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [processQuestions, generateRadarData, updateAvailableCategories])

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
    setShowInfoPanel(!showInfoPanel)
    setTimeout(() => setIsAnimating(false), 400)
  }



  // No automatic fetching - user must click "Fetch Questions" first

  const handleFetchQuestions = () => {
    console.log('🎯 Manual fetch triggered:', { questionCount, fetchCount })
    
    // Show info panel when user triggers fetch
    setShowInfoPanel(true)
    
    // Reset category filter when fetching new questions
    setSelectedCategory(null)
    
    // Use the new sequential fetch method
    fetchData(questionCount, fetchCount, undefined) // Don't pass category filter to API, we'll filter locally
  }

  const handleResetSession = async () => {
    try {
      console.log('🔄 Resetting session token...')
      
      // Show info panel when user triggers reset
      setShowInfoPanel(true)
      
      setSessionInfo('🔄 Resetting session token...')
      await TriviaAPI.resetSessionToken()
      setSessionInfo('✅ Session token reset successfully - ready for fresh questions!')
      console.log('✅ Session reset complete')
      
      // Clear current questions to force fresh fetch
      setAllQuestions([])
      setAvailableCategories([])
      setSelectedCategory(null)
      
    } catch (error) {
      console.error('❌ Session reset failed:', error)
      setSessionInfo('❌ Failed to reset session token')
    }
  }

  if (loading) {
    return (
      <div className="trivia-viz loading">
        <div className="loading-spinner">🎯</div>
        <p>Loading trivia data...</p>
        <p className="session-info">{sessionInfo}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="trivia-viz error">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={handleFetchQuestions} className="retry-btn">
          Try Again
        </button>
        <button onClick={handleResetSession} className="retry-btn">
          Reset Session
        </button>
      </div>
    )
  }

  return (
    <div className="trivia-viz">
      {/* Draggable Info Panel */}
      {sessionInfo && (
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
      )}

      {/* Header */}
      <div className="trivia-header" >
        <h1 className="trivia-title">Trivia Dashboard:</h1>
        <p className="trivia-subtitle">
          Visualization of trivia questions from OpenTDB
        </p>
      </div>

      {/* Compact Horizontal Controls */}
      <div className="compact-controls">
        {/* Sliders Section */}
        <div className="sliders-section">
          <div className="slider-group">
            <input
              type="range"
              min="10"
              max="50"
              step="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
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
              onChange={(e) => setFetchCount(Number(e.target.value))}
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

        {/* Fetch Button */}
        <button onClick={handleFetchQuestions} className="fetch-btn-main">
          Fetch Questions!
        </button>

        {/* Total Questions Display */}
        <div className="total-section">
          <div className="total-label">Total questions:</div>
          <div className="total-value">{Math.min(questionCount * fetchCount, 150)}</div>
        </div>

        {/* Reset Session Button - Always Visible */}
        <button onClick={handleResetSession} className="reset-btn-main">
          Reset Session
        </button>
      </div>

      {/* Category Filter Row - Only show when data exists */}
      {stats.totalQuestions > 0 && (
        <div className="category-filter-row">
          <label className="filter-label">Filter by Category:</label>
          <select 
            value={selectedCategory || ''} 
            onChange={(e) => {
              const newCategory = e.target.value ? Number(e.target.value) : null
              console.log('🏷️ Category filter changed:', newCategory)
              setSelectedCategory(newCategory)
              
              // Filter existing questions instead of fetching new ones
              if (allQuestions.length > 0) {
                console.log('🔍 Filtering existing questions by category...')
                const filteredQuestions = newCategory 
                  ? allQuestions.filter(q => {
                      const categoryMatch = availableCategories.find(cat => cat.id === newCategory)
                      return categoryMatch && q.category === categoryMatch.name
                    })
                  : allQuestions
                
                console.log('📊 Filtered questions:', filteredQuestions.length)
                const processedStats = processQuestions(filteredQuestions)
                setStats(processedStats)
                setRadarData(generateRadarData(filteredQuestions))
              }
            }}
            className="category-dropdown"
          >
            <option value="">🌍 All Categories ({stats.totalQuestions} questions)</option>
            {availableCategories.map((cat: TriviaCategory, index: number) => {
              const questionsInCategory = allQuestions.filter(q => q.category === cat.name).length
              const colorIndex = index % COLORS.length
              
              // Get category-specific emoji
              const getCategoryEmoji = (categoryName: string): string => {
                const name = categoryName.toLowerCase()
                if (name.includes('game') || name.includes('video game') || name.includes('board game')) return '🎮'
                if (name.includes('science') || name.includes('nature') || name.includes('math')) return '🔬'
                if (name.includes('sport') || name.includes('athletics')) return '⚽'
                if (name.includes('history')) return '📜'
                if (name.includes('myth') || name.includes('folklore')) return '🐲'
                if (name.includes('film') || name.includes('movie') || name.includes('cinema')) return '🎬'
                if (name.includes('music') || name.includes('musical')) return '🎵'
                if (name.includes('television') || name.includes('tv')) return '📺'
                if (name.includes('art') || name.includes('literature') || name.includes('book')) return '🎨'
                if (name.includes('geography') || name.includes('capital')) return '🗺️'
                if (name.includes('animal') || name.includes('wildlife')) return '🦁'
                if (name.includes('celebrity') || name.includes('famous')) return '⭐'
                if (name.includes('politics') || name.includes('government')) return '🏛️'
                if (name.includes('religion') || name.includes('bible')) return '⛪'
                if (name.includes('computer') || name.includes('technology')) return '💻'
                if (name.includes('anime') || name.includes('manga') || name.includes('cartoon')) return '🎭'
                if (name.includes('vehicle') || name.includes('car') || name.includes('transportation')) return '🚗'
                return '📁' // Default folder emoji
              }
              
              return (
                <option 
                  key={cat.id} 
                  value={cat.id}
                  data-color={COLORS[colorIndex]}
                >
                  {getCategoryEmoji(cat.name)} {cat.name} ({questionsInCategory} questions)
                </option>
              )
            })}
          </select>
        </div>
      )}

      {/* Data Visualization - Only show if we have data */}
      {hasDataToShow && (
        <>
          {/* Top Row: Category/Treemap and Difficulty Charts */}
          <div className="charts-row">
            {/* Category Distribution - Only show when viewing all categories */}
            {!selectedCategory && (
              <div className="chart-container category-chart">
                <h3>Question Categories</h3>
                <div className="pie-chart-section">
                  <div className="pie-chart-wrapper">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={stats.categories}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {stats.categories.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            background: 'rgba(26, 26, 26, 0.9)',
                            border: '1px solid var(--theme-purple)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Category Legend Grid */}
                  <div className="category-legend">
                    <h4>Categories ({stats.categories.length}):</h4>
                    <div className="category-grid">
                      {stats.categories.map((category, index) => {
                        const shortName = category.name.length > 25 
                          ? category.name.substring(0, 22) + '...' 
                          : category.name
                        return (
                          <div key={category.name} className="category-item" title={category.name}>
                            <span 
                              className="category-color" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></span>
                            <span className="category-name">{shortName}</span>
                            <span className="category-count">({category.value})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Difficulty Treemap - Only show when category is selected */}
            {selectedCategory && (
              <div className="chart-container treemap-chart">
                <h3>Difficulty Distribution (Treemap)</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <Treemap
                    data={stats.difficulties.map((diff, index) => ({
                      name: diff.name.charAt(0).toUpperCase() + diff.name.slice(1),
                      value: diff.value,
                      fill: COLORS[index % 3]
                    }))}
                    dataKey="value"
                    aspectRatio={4/3}
                    stroke="#fff"
                    animationBegin={0}
                    animationDuration={800}
                  />
                </ResponsiveContainer>
              </div>
            )}

            {/* Difficulty Distribution */}
            <div className="chart-container difficulty-chart">
              <h3>Difficulty Levels</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.difficulties}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ccc"
                    fontSize={12}
                  />
                  <YAxis stroke="#ccc" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(26, 26, 26, 0.9)',
                      border: '1px solid var(--theme-pink)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#colorGradient)" 
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={1000}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row: Radar Chart - Always separate */}
          <div className="radar-section">
            <div className="chart-container radar-chart">
              <h3>Difficulty Radar</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid 
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth={1}
                  />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#ccc', fontSize: 14, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis 
                    tick={{ fill: '#888', fontSize: 12 }}
                    stroke="rgba(139, 92, 246, 0.5)"
                  />
                  <Radar
                    name="Questions"
                    dataKey="value"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.4}
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#ff0080' }}
                    animationBegin={200}
                    animationDuration={1200}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(26, 26, 26, 0.9)',
                      border: '1px solid var(--theme-bright-pink)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Initial State Message */}
      {!hasDataToShow && !loading && (
        <div className="initial-state">
          <div className="welcome-message">
            <h2>Welcome to the Trivia Dashboard!</h2>
            <p>Please select number of questions and click "Fetch Questions" above to start visualizing trivia data</p>
          </div>
        </div>
      )}

      {
       stats.totalQuestions!=0 && ( 
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Questions</h4>
          <div className="stat-number">{stats.totalQuestions}</div>
        </div>
        <div className="stat-card">
          <h4>Categories</h4>
          <div className="stat-number">{stats.categories.length}</div>
        </div>
        <div className="stat-card">
          <h4>Difficulty Levels</h4>
          <div className="stat-number">{stats.difficulties.length}</div>
        </div>
        <div className="stat-card">
          <h4>Most Popular</h4>
          <div className="stat-number">
            {stats.categories.length > 0 
              ? stats.categories.reduce((a, b) => a.value > b.value ? a : b).name.split(':')[0]
              : 'N/A'
            }
          </div>
        </div>
        <div className="stat-card">
          <h4>Session Status</h4>
          <div className="stat-number">Active</div>
        </div>
      </div>
       )}

    </div>
  )
}

export default TriviaViz