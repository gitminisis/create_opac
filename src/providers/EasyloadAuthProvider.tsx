import { axios } from '@/lib/axios'
import { atom, useAtom } from 'jotai'
import { createContext, ReactNode, useContext, useEffect } from 'react'

const authTokenAtom = atom(localStorage.getItem('easyloadToken'))
const easyloadUserAtom = atom(localStorage.getItem('easyloadUser'))
const loadingAtom = atom(false)
const errorAtom = atom(null)
const TENANT = process.env.REACT_APP_EASYLOAD_TENANT || import.meta.env.VITE_REACT_APP_EASYLOAD_TENANT
const PASSWORD = process.env.REACT_APP_EASYLOAD_PASSWORD || import.meta.env.VITE_REACT_APP_EASYLOAD_PASSWORD

type AuthContextType = {
	authenticate: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const EasyloadAuthProvider = ({ children }: { children?: ReactNode }) => {
	const [authToken, setAuthToken] = useAtom(authTokenAtom)
	const [, setUser] = useAtom(easyloadUserAtom)
	const [, setLoading] = useAtom(loadingAtom)
	const [, setError] = useAtom(errorAtom)

	const authenticate = async () => {
		const tenant = TENANT
		const password = PASSWORD
		setLoading(true)
		try {
			const response = await axios.post('/easyload/auth', { tenant, password })
			const { token, id } = response.data.data
			console.log(response.data.data)
			if (token) {
				localStorage.setItem('easyloadUser', id)
				localStorage.setItem('easyloadToken', token)
				setAuthToken(token)
				setUser(id)
			}
		} catch (err: any) {
			setError(err.response?.data?.message || 'Authentication failed.')
			console.error('Authentication Error:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!authToken) {
			authenticate()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authToken])

	return <AuthContext.Provider value={{ authenticate }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an EasyloadAuthProvider')
	}
	const [authToken] = useAtom(authTokenAtom)
	const [loading] = useAtom(loadingAtom)
	const [error] = useAtom(errorAtom)
	const [user] = useAtom(easyloadUserAtom)

	return { ...context, authToken, loading, error, user }
}
