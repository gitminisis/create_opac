import GenericErrorPage from '@/page/GenericErrorPage'
import { useState, useEffect } from 'react'
interface ErrorBoundaryProps {
	children: React.ReactNode
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		const errorHandler = (error: Event | string, errorInfo?: object) => {
			console.error('Error caught by error boundary:', error, errorInfo)
			setHasError(true)
		}

		window.addEventListener('error', errorHandler)

		return () => {
			window.removeEventListener('error', errorHandler)
		}
	}, [])

	if (hasError) {
		return <GenericErrorPage />
	}

	return children
}

export default ErrorBoundary
