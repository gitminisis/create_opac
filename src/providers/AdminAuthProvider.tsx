import axios from 'axios'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useLoadingOverlay } from './LoadingOverlayProvider'
import { atom, useAtom } from 'jotai'

interface AdminUser {
	id: string
	name: string
	email: string
	role: 'admin'
	// Add other admin-specific properties as needed
}

interface AdminAuthContextType {
	adminUser: AdminUser | null
	signIn: (email: string, password: string) => Promise<void>
	signOut: () => void
	isAuthenticated: string | null
	error: boolean
}

async function hashPayload(payload: object) {
	const jsonString = JSON.stringify(payload)
	const encoder = new TextEncoder()
	const data = encoder.encode(jsonString)

	try {
		// Try using the Web Crypto API first (works in HTTPS)
		if (window.crypto && window.crypto.subtle) {
			const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
			const hashArray = Array.from(new Uint8Array(hashBuffer))
			return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
		}
	} catch (error) {
		console.warn('Web Crypto API not available, using fallback method', error)
	}

	// Fallback for HTTP environments
	// Simple string hashing function that's deterministic but not cryptographically secure
	let hash = 0
	for (let i = 0; i < jsonString.length; i++) {
		const char = jsonString.charCodeAt(i)
		hash = ((hash << 5) - hash) + char
		hash = hash & hash // Convert to 32bit integer
	}

	// Convert to hex string and ensure it's positive
	let hashHex = (hash >>> 0).toString(16)
	// Pad to ensure consistent length
	while (hashHex.length < 8) {
		hashHex = '0' + hashHex
	}

	return hashHex.padEnd(64, '0') // Pad to match SHA-256 length
}

const CREDENTIAL_KEY = 'credential'

// Create Jotai atoms for credential and admin user
const credentialAtom = atom<string | null>(null)
const adminUserAtom = atom<AdminUser | null>(null)

// Initialize the atom with session storage value if available
if (typeof window !== 'undefined') {
	const storedCredential = sessionStorage.getItem(CREDENTIAL_KEY)
	if (storedCredential) {
		credentialAtom.init = storedCredential
	}
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
	const [adminUser, setAdminUser] = useAtom(adminUserAtom)
	const [isAuthenticated, setIsAuthenticated] = useAtom(credentialAtom)
	const [error, setError] = useState<boolean>(false)

	const { showLoading, hideLoading } = useLoadingOverlay()

	const signIn = useCallback(
		async (username: string, password: string) => {
			showLoading()
			const url = `/scripts/mwimain.dll?logon&application=UNION_VIEW&COOKIE=USERNAME&language=144&file=[OPAC]admin/login-success.html`
			const payload = { USERNAME: username, USERPASSWORD: password }
			try {
				// Create FormData object for the request
				const formData = new FormData()
				formData.append('USERNAME', username)
				formData.append('USERPASSWORD', password)

				// Send as form data instead of JSON
				const loginRequest = await axios.post(url, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				if (loginRequest.status === 200) {
					const response = loginRequest.data
					if (response.status === 'success') {
						const hash = await hashPayload(payload)
						sessionStorage.setItem(CREDENTIAL_KEY, hash)
						setIsAuthenticated(hash)
						setAdminUser({
							id: username,
							name: username,
							email: username,
							role: 'admin',
						})
						window.location.assign('/admin/index.html')
					} else {
						setError(true)
					}
				}
			} catch (error) {
				console.error('Admin sign-in error:', error)
				setError(true)
			} finally {
				hideLoading()
			}
		},
		[showLoading, hideLoading, setIsAuthenticated, setAdminUser]
	)

	const signOut = useCallback(() => {
		sessionStorage.removeItem(CREDENTIAL_KEY)
		setIsAuthenticated(null)
		setAdminUser(null)
	}, [setIsAuthenticated, setAdminUser])

	useEffect(() => {
		const storedHash = sessionStorage.getItem(CREDENTIAL_KEY)
		if (storedHash) {
			setIsAuthenticated(storedHash)
		}
	}, [setIsAuthenticated])

	const isAdminLoginPath = window.location.pathname.includes('/admin/login.html')

	useEffect(() => {
		if (!window) return

		const storedHash = sessionStorage.getItem(CREDENTIAL_KEY)
		if (isAdminLoginPath && storedHash) {
			window.location.assign('/admin/index.html')
		}

		if (!isAdminLoginPath && !storedHash) {
			window.location.assign('/admin/login.html')
		}
	}, [isAdminLoginPath, isAuthenticated])

	return (
		<AdminAuthContext.Provider value={{ adminUser, signIn, signOut, isAuthenticated, error }}>
			{children}
		</AdminAuthContext.Provider>
	)
}

export const useAdminAuth = (): AdminAuthContextType => {
	const context = useContext(AdminAuthContext)
	if (!context) {
		throw new Error('useAdminAuth must be used within an AdminAuthProvider')
	}
	return context
}
