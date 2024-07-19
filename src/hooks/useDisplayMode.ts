import { useState, useEffect } from 'react'

const useDisplayMode = () => {
	// Initial display mode is fetched from localStorage or defaults to 'list'
	const [displayMode, setDisplayMode] = useState(() => {
		return localStorage.getItem('displayMode') || 'list'
	})

	// Save the display mode to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('displayMode', displayMode)
	}, [displayMode])

	// Toggle between 'grid' and 'list' modes
	const toggleDisplayMode = () => {
		setDisplayMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'))
	}

	return { displayMode, toggleDisplayMode }
}

export default useDisplayMode
