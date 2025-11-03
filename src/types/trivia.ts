export interface TriviaCategory {
  id: number
  name: string
}

export interface TriviaQuestion {
  category: string
  type: 'multiple' | 'boolean'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface TriviaResponse {
  response_code: number
  results: TriviaQuestion[]
}

export interface CategoryData {
  name: string
  count: number
  color: string
  [key: string]: any // For recharts compatibility
}

export interface DifficultyData {
  name: string
  count: number
  color: string
  [key: string]: any // For recharts compatibility
}

export interface TriviaStats {
  totalQuestions: number
  categories: CategoryData[]
  difficulties: DifficultyData[]
  typeDistribution: {
    multiple: number
    boolean: number
  }
}