import { useState, useEffect } from 'react'

type ScreenDimensions = {
	width: number
	height: number
}

const useScreenDimensions = (): ScreenDimensions => {
	const [dimensions, setDimensions] = useState<ScreenDimensions>({
		width: window.innerWidth,
		height: window.innerHeight,
	})

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		// Add event listener for window resize
		window.addEventListener('resize', handleResize)

		// Cleanup the event listener on unmount
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return dimensions
}

export default useScreenDimensions
