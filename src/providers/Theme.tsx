import useConstants from '@/hooks/useConstants'
import { createContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
	children: React.ReactNode
	defaultTheme?: Theme
	storageKey?: string
}

type ThemeProviderState = {
	theme: Theme
	setTheme: (theme: Theme) => void
	setCustomTheme: (className: string) => void
}

const initialState: ThemeProviderState = {
	theme: 'system',
	setTheme: () => null,
	setCustomTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = 'dark', storageKey = 'vite-ui-theme', ...props }: ThemeProviderProps) {
	const styles = useConstants().styles
	const defaultCustomKey = `theme-${styles.theme}`
	const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme)

	const [custom, setCustom] = useState<string>(defaultCustomKey)

	useEffect(() => {
		const root = window.document.documentElement

		root.classList.remove('light', 'dark')

		root.classList.add(theme)
	}, [theme])

	useEffect(() => {
		const root = window.document.documentElement
		root.classList.remove(...root.classList)
		root.classList.add(theme)
		if (custom !== '') {
			root.classList.add(custom)
		}
	}, [theme, custom])

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme)
			setTheme(theme)
		},
		setCustomTheme: (custom: string) => {
			localStorage.setItem(defaultCustomKey, custom)
			setCustom(custom)
		},
	}

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	)
}
