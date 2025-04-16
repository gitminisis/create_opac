import { DisplayModeContext, DisplayModeContextType } from '@/providers/DisplayModeProvider'
import { useContext } from 'react'

// Custom hook to use the DisplayModeContext
export const useDisplayMode = (): DisplayModeContextType => {
	const context = useContext(DisplayModeContext)
	if (!context) {
		throw new Error('useDisplayMode must be used within a DisplayModeProvider')
	}
	return context
}
