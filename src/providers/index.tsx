import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import { ThemeProvider } from './Theme'
import { TooltipProvider } from '@radix-ui/react-tooltip'

type Props = {
	children?: React.ReactNode
}

const Provider = ({ children }: Props) => {
	return (
		<ErrorBoundary>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<TooltipProvider>{children}</TooltipProvider>
			</ThemeProvider>
		</ErrorBoundary>
	)
}

export default Provider
