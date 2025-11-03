import React from 'react'

interface ChartStats {
  categories: Array<{ name: string; value: number }>
  difficulties: Array<{ name: string; value: number }>
  totalQuestions: number
}

interface StatisticsGridProps {
  stats: ChartStats
}

const StatisticsGrid: React.FC<StatisticsGridProps> = ({ stats }) => {
  if (stats.totalQuestions === 0) {
    return null
  }

  const getMostPopularCategory = () => {
    if (stats.categories.length === 0) return 'N/A'
    const mostPopular = stats.categories.reduce((a, b) => a.value > b.value ? a : b)
    return mostPopular.name.split(':')[0]
  }

  return (
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
          {getMostPopularCategory()}
        </div>
      </div>
      <div className="stat-card">
        <h4>Session Status</h4>
        <div className="stat-number">Active</div>
      </div>
    </div>
  )
}

export default StatisticsGrid