import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { TOOLTIP_STYLE } from '../constants'

interface RadarData {
  subject: string
  value: number
  fullMark: number
}

interface DifficultyRadarChartProps {
  data: RadarData[]
}

const DifficultyRadarChart: React.FC<DifficultyRadarChartProps> = ({ data }) => {
  return (
    <div className="radar-section">
      <div className="chart-container radar-chart">
        <h3>Difficulty Radar</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
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
                ...TOOLTIP_STYLE,
                border: '1px solid var(--theme-bright-pink)',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DifficultyRadarChart