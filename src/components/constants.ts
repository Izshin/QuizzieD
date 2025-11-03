export const CHART_COLORS = [
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

export const TOOLTIP_STYLE = {
  background: 'rgba(26, 26, 26, 0.9)',
  border: '1px solid var(--theme-purple)',
  borderRadius: '8px',
  color: 'white'
}

export const getCategoryEmoji = (categoryName: string): string => {
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