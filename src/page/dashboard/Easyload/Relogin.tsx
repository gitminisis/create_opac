import { useAuth } from '@/providers/EasyloadAuthProvider'
import { useEffect } from 'react'

const Relogin = () => {
	const { authenticate } = useAuth()

	useEffect(() => {
		authenticate().then(() => {
			window.location.href = '/scripts/mwimain.dll?GET&FILE=[OPAC]includes/easyload.html'
		})
	}, [])
	return <></>
}

export default Relogin
