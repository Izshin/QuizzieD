import React from 'react'
import type { TriviaCategory } from '../../types/trivia'
import { getCategoryEmoji, CHART_COLORS } from '../constants'

interface CategoryFilterProps {
  selectedCategory: number | null
  availableCategories: TriviaCategory[]
  totalQuestions: number
  onCategoryChange: (categoryId: number | null) => void
  getQuestionsInCategory: (categoryName: string) => number
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  availableCategories,
  totalQuestions,
  onCategoryChange,
  getQuestionsInCategory
}) => {
  if (totalQuestions === 0) {
    return null
  }

  return (
    <div className="category-filter-row">
      <label className="filter-label">Filter by Category:</label>
      <select 
        value={selectedCategory || ''} 
        onChange={(e) => {
          const newCategory = e.target.value ? Number(e.target.value) : null
          onCategoryChange(newCategory)
        }}
        className="category-dropdown"
      >
        <option value="">🌍 All Categories ({totalQuestions} questions)</option>
        {availableCategories.map((cat: TriviaCategory, index: number) => {
          const questionsInCategory = getQuestionsInCategory(cat.name)
          const colorIndex = index % CHART_COLORS.length
          
          return (
            <option 
              key={cat.id} 
              value={cat.id}
              data-color={CHART_COLORS[colorIndex]}
            >
              {getCategoryEmoji(cat.name)} {cat.name} ({questionsInCategory} questions)
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default CategoryFilter