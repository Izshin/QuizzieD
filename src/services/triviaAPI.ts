import type { TriviaResponse, TriviaQuestion, TriviaCategory } from '../types/trivia'

const BASE_URL = 'https://opentdb.com/api.php'
const TOKEN_URL = 'https://opentdb.com/api_token.php'
const CATEGORY_URL = 'https://opentdb.com/api_category.php'

interface SessionToken {
  token: string
  timestamp: number
}

export class TriviaAPI {
  private static sessionToken: SessionToken | null = null
  
  /**
   * Get or create a session token
   */
  static async getSessionToken(): Promise<string> {
    // Check if we have a valid token (less than 5.5 hours old)
    if (this.sessionToken && Date.now() - this.sessionToken.timestamp < 5.5 * 60 * 60 * 1000) {
      return this.sessionToken.token
    }
    
    try {
      const response = await fetch(`${TOKEN_URL}?command=request`)
      const data = await response.json()
      
      if (data.response_code === 0) {
        this.sessionToken = {
          token: data.token,
          timestamp: Date.now()
        }
        return data.token
      }
      throw new Error('Failed to get session token')
    } catch (error) {
      console.warn('Could not get session token, proceeding without it:', error)
      return ''
    }
  }

  /**
   * Reset the current session token
   */
  static async resetSessionToken(): Promise<void> {
    if (!this.sessionToken) return
    
    try {
      await fetch(`${TOKEN_URL}?command=reset&token=${this.sessionToken.token}`)
      this.sessionToken = null
    } catch (error) {
      console.warn('Could not reset session token:', error)
    }
  }

  /**
   * Fetch categories from OpenTDB API
   */
  static async fetchCategories(): Promise<TriviaCategory[]> {
    try {
      const response = await fetch(CATEGORY_URL)
      const data = await response.json()
      return data.trivia_categories || []
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    }
  }

  /**
   * Fetch trivia questions from OpenTDB API
   * @param amount Number of questions to fetch (default: 50)
   * @param category Optional category ID to filter by
   * @param difficulty Optional difficulty level
   */
  static async fetchQuestions(
    amount: number = 50,
    category?: number,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<TriviaQuestion[]> {
    try {
      const token = await this.getSessionToken()
      const params = new URLSearchParams({
        amount: Math.min(amount, 50).toString(), // API limit is 50 per request
        encode: 'url3986' // Use URL encoding for special characters
      })

      // Add session token if available
      if (token) {
        params.append('token', token)
      }

      if (category) {
        params.append('category', category.toString())
      }

      if (difficulty) {
        params.append('difficulty', difficulty)
      }

      const response = await fetch(`${BASE_URL}?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: TriviaResponse = await response.json()
      
      // Handle different response codes
      if (data.response_code === 1) {
        throw new Error('Not enough questions available for this query')
      } else if (data.response_code === 2) {
        throw new Error('Invalid parameters')
      } else if (data.response_code === 3) {
        // Token not found, reset and try again without token
        this.sessionToken = null
        params.delete('token')
        const retryResponse = await fetch(`${BASE_URL}?${params}`)
        const retryData: TriviaResponse = await retryResponse.json()
        if (retryData.response_code === 0) {
          return retryData.results.map(q => this.decodeQuestion(q))
        }
        throw new Error('Failed to fetch questions after token reset')
      } else if (data.response_code === 4) {
        // Token exhausted, reset it
        await this.resetSessionToken()
        throw new Error('Session token exhausted. Please try fetching again.')
      } else if (data.response_code === 5) {
        throw new Error('Rate limit exceeded. Please wait before making another request.')
      } else if (data.response_code !== 0) {
        throw new Error(`API error! response_code: ${data.response_code}`)
      }

      return data.results.map(q => this.decodeQuestion(q))
    } catch (error) {
      console.error('Error fetching trivia questions:', error)
      throw error
    }
  }

  /**
   * Decode URL-encoded question data
   */
  private static decodeQuestion(question: TriviaQuestion): TriviaQuestion {
    return {
      ...question,
      category: decodeURIComponent(question.category),
      question: decodeURIComponent(question.question),
      correct_answer: decodeURIComponent(question.correct_answer),
      incorrect_answers: question.incorrect_answers.map(answer => decodeURIComponent(answer))
    }
  }

  /**
   * Fetch multiple batches if more than 50 questions are needed
   * @param totalAmount Total number of questions (max 150)
   * @param category Optional category filter
   * @param difficulty Optional difficulty filter
   */
  static async fetchLargeSet(
    totalAmount: number, 
    category?: number, 
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<TriviaQuestion[]> {
    const maxQuestions = Math.min(totalAmount, 150) // Cap at 150 questions
    const batches = Math.ceil(maxQuestions / 50)
    const allQuestions: TriviaQuestion[] = []
    
    for (let i = 0; i < batches; i++) {
      const batchSize = Math.min(50, maxQuestions - (i * 50))
      try {
        const batchQuestions = await this.fetchQuestions(batchSize, category, difficulty)
        allQuestions.push(...batchQuestions)
        
        // Small delay between requests to avoid rate limiting
        if (i < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Error fetching batch ${i + 1}:`, error)
        // Continue with other batches even if one fails
        break
      }
    }

    return allQuestions.slice(0, maxQuestions)
  }
}

// Export the main function for backward compatibility
export const fetchTriviaQuestions = TriviaAPI.fetchQuestions.bind(TriviaAPI)
export const fetchTriviaCategories = TriviaAPI.fetchCategories.bind(TriviaAPI)
export const fetchLargeTriviaSet = TriviaAPI.fetchLargeSet.bind(TriviaAPI)