import { useState, useEffect, useCallback } from 'react'
import type { TriviaCategory, TriviaQuestion } from '../types/trivia'
import { TriviaAPI } from '../services/triviaAPI'

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

interface UseTriviaDataReturn {
  // State
  loading: boolean
  error: string | null
  allCategories: TriviaCategory[]
  availableCategories: TriviaCategory[]
  allQuestions: TriviaQuestion[]
  stats: ChartStats
  radarData: RadarData[]
  sessionInfo: string
  hasDataToShow: boolean
  
  // Actions
  fetchData: (questionsPerFetch: number, numberOfFetches: number, categoryId?: number) => Promise<void>
  resetSession: () => Promise<void>
  filterQuestionsByCategory: (categoryId: number | null) => void
}

export const useTriviaData = (): UseTriviaDataReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allCategories, setAllCategories] = useState<TriviaCategory[]>([])
  const [availableCategories, setAvailableCategories] = useState<TriviaCategory[]>([])
  const [allQuestions, setAllQuestions] = useState<TriviaQuestion[]>([])
  const [stats, setStats] = useState<ChartStats>({
    categories: [],
    difficulties: [],
    totalQuestions: 0
  })
  const [radarData, setRadarData] = useState<RadarData[]>([])
  const [sessionInfo, setSessionInfo] = useState<string>('Click "Fetch Questions" to start!')
  const [hasDataToShow, setHasDataToShow] = useState(false)

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
          setAllQuestions([...accumulatedQuestions])
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

  const resetSession = useCallback(async () => {
    try {
      console.log('🔄 Resetting session token...')
      setSessionInfo('🔄 Resetting session token...')
      await TriviaAPI.resetSessionToken()
      setSessionInfo('✅ Session token reset successfully - ready for fresh questions!')
      console.log('✅ Session reset complete')
      
      // Clear current questions to force fresh fetch
      setAllQuestions([])
      setAvailableCategories([])
      
    } catch (error) {
      console.error('❌ Session reset failed:', error)
      setSessionInfo('❌ Failed to reset session token')
    }
  }, [])

  const filterQuestionsByCategory = useCallback((categoryId: number | null) => {
    console.log('🏷️ Category filter changed:', categoryId)
    
    if (allQuestions.length > 0) {
      console.log('🔍 Filtering existing questions by category...')
      const filteredQuestions = categoryId 
        ? allQuestions.filter(q => {
            const categoryMatch = availableCategories.find(cat => cat.id === categoryId)
            return categoryMatch && q.category === categoryMatch.name
          })
        : allQuestions
      
      console.log('📊 Filtered questions:', filteredQuestions.length)
      const processedStats = processQuestions(filteredQuestions)
      setStats(processedStats)
      setRadarData(generateRadarData(filteredQuestions))
    }
  }, [allQuestions, availableCategories, processQuestions, generateRadarData])

  return {
    // State
    loading,
    error,
    allCategories,
    availableCategories,
    allQuestions,
    stats,
    radarData,
    sessionInfo,
    hasDataToShow,
    
    // Actions
    fetchData,
    resetSession,
    filterQuestionsByCategory
  }
}