import React, { createContext, ReactNode, useEffect, useState } from 'react'

// Define the shape of the context value
export interface DisplayModeContextType {
	displayMode: 'grid' | 'list'
	toggleDisplayMode: () => void
}

// Create the context with an undefined initial value
export const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined)

// Create the provider component
interface DisplayModeProviderProps {
	children: ReactNode
}

export const DisplayModeProvider: React.FC<DisplayModeProviderProps> = ({ children }) => {
	const [displayMode, setDisplayMode] = useState<'grid' | 'list'>(() => {
		return (localStorage.getItem('displayMode') as 'grid' | 'list') || 'list'
	})

	useEffect(() => {
		localStorage.setItem('displayMode', displayMode)
	}, [displayMode])

	const toggleDisplayMode = () => {
		setDisplayMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'))
	}

	return <DisplayModeContext.Provider value={{ displayMode, toggleDisplayMode }}>{children}</DisplayModeContext.Provider>
}
