import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { DisplayModeProvider } from './DisplayModeProvider'
import { EasyloadAuthProvider } from './EasyloadAuthProvider'
import ErrorBoundary from './ErrorBoundary'
import { ThemeProvider } from './Theme'

type Props = {
	children?: React.ReactNode
}
const queryClient = new QueryClient()

const Provider = ({ children }: Props) => {
	return (
		<ErrorBoundary>
			<EasyloadAuthProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
						<DisplayModeProvider>
							<TooltipProvider>{children}</TooltipProvider>
						</DisplayModeProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</EasyloadAuthProvider>
		</ErrorBoundary>
	)
}

export default Provider
