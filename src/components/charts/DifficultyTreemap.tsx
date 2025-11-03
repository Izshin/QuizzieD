import React from 'react'
import { Treemap, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from '../constants'

interface DifficultyData {
  name: string
  value: number
  [key: string]: string | number
}

interface DifficultyTreemapProps {
  data: DifficultyData[]
}

const DifficultyTreemap: React.FC<DifficultyTreemapProps> = ({ data }) => {
  const treemapData = data.map((diff, index) => ({
    name: diff.name.charAt(0).toUpperCase() + diff.name.slice(1),
    value: diff.value,
    fill: CHART_COLORS[index % 3]
  }))

  return (
    <div className="chart-container treemap-chart">
      <h3>Difficulty Distribution (Treemap)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <Treemap
          data={treemapData}
          dataKey="value"
          aspectRatio={4/3}
          stroke="#fff"
          animationBegin={0}
          animationDuration={800}
        />
      </ResponsiveContainer>
    </div>
  )
}

export default DifficultyTreemap