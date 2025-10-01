import { db } from '@/db/client'
import { ENGLISH_CODE } from '@/types/lang'
import { useLiveQuery } from 'dexie-react-hooks'

export const useLanguage = () => {
	const languageArray = useLiveQuery(() => db.language.toArray())

	const languageCode = (languageArray && Array.isArray(languageArray) && languageArray[0]?.code) || ENGLISH_CODE
	return languageCode
}
