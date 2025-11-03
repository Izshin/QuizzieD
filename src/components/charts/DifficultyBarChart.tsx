import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TOOLTIP_STYLE } from '../constants'

interface DifficultyData {
  name: string
  value: number
  [key: string]: string | number
}

interface DifficultyBarChartProps {
  data: DifficultyData[]
}

const DifficultyBarChart: React.FC<DifficultyBarChartProps> = ({ data }) => {
  return (
    <div className="chart-container difficulty-chart">
      <h3>Difficulty Levels</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
          <XAxis 
            dataKey="name" 
            stroke="#ccc"
            fontSize={12}
          />
          <YAxis stroke="#ccc" fontSize={12} />
          <Tooltip 
            contentStyle={{
              ...TOOLTIP_STYLE,
              border: '1px solid var(--theme-pink)',
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
  )
}

export default DifficultyBarChart