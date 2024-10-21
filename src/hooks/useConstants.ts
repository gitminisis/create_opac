import { CONSTANTS } from '@/constants'
import { useLanguage } from './useLanguage'

const useConstants = () => {
	const languageCode = useLanguage() as keyof typeof CONSTANTS
	const constants = CONSTANTS[languageCode]
	return constants
}

export default useConstants
