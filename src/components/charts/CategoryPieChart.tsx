import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_COLORS, TOOLTIP_STYLE } from '../constants'

interface CategoryData {
  name: string
  value: number
  [key: string]: string | number
}

interface CategoryPieChartProps {
  data: CategoryData[]
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  return (
    <div className="chart-container category-chart">
      <h3>Question Categories</h3>
      <div className="pie-chart-section">
        <div className="pie-chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category Legend Grid */}
        <div className="category-legend">
          <h4>Categories ({data.length}):</h4>
          <div className="category-grid">
            {data.map((category, index) => {
              const shortName = category.name.length > 25 
                ? category.name.substring(0, 22) + '...' 
                : category.name
              return (
                <div key={category.name} className="category-item" title={category.name}>
                  <span 
                    className="category-color" 
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
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
  )
}

export default CategoryPieChart