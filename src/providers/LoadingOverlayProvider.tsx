import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

function LoadingOverlay() {
	return (
		<div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
			<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
		</div>
	)
}

interface LoadingOverlayContextType {
	showLoading: () => void
	hideLoading: () => void
	isLoading: boolean
}

const LoadingOverlayContext = createContext<LoadingOverlayContextType | undefined>(undefined)

export const LoadingOverlayProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false)

	const showLoading = () => setIsLoading(true)
	const hideLoading = () => setIsLoading(false)

	return (
		<LoadingOverlayContext.Provider value={{ showLoading, hideLoading, isLoading }}>
			{isLoading && <LoadingOverlay />}
			{children}
		</LoadingOverlayContext.Provider>
	)
}

export const useLoadingOverlay = (): LoadingOverlayContextType => {
	const context = useContext(LoadingOverlayContext)
	if (!context) {
		throw new Error('useLoadingOverlay must be used within a LoadingOverlayProvider')
	}
	return context
}
