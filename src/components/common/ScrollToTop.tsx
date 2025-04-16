import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { ArrowUp } from 'lucide-react'

const ScrollToTopButton: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true)
			} else {
				setIsVisible(false)
			}
		}

		window.addEventListener('scroll', toggleVisibility)

		return () => {
			window.removeEventListener('scroll', toggleVisibility)
		}
	}, [])

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	return (
		<div className="fixed bottom-4 right-4">
			{isVisible && (
				<Button
					onClick={scrollToTop}
					className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-700 transition">
					<ArrowUp />
				</Button>
			)}
		</div>
	)
}

export default ScrollToTopButton
