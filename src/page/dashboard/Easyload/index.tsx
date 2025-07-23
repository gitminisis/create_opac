import PatronLayout from '@/components/layouts/patron'
import MainContent from './MainContent'
import { Home } from 'lucide-react'
import useConstants from '@/hooks/useConstants'

const EasyLoad = () => {
	const { message, clientProfile } = useConstants()
	return (
		<PatronLayout  mainHeading={<><Home className="mr-1 h-5 w-5" /><h2 className="text-lg font-semibold text-gray-900">{message.clientDashboard}</h2></>} heading="Easy Load">
			<MainContent />
		</PatronLayout>
	)
}

export default EasyLoad
