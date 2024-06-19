import { ENGLISH_CODE, FRENCH_CODE, LanguageCode } from '@/types/lang'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useLanguage } from '@/hooks/useLanguage'
import { db } from '../../db/client'
export interface ILANGUAGE {
	code: LanguageCode
	name: string
	icon: string
}
export const LANGUAGE_ITEMS: ILANGUAGE[] = [
	{
		code: ENGLISH_CODE,
		name: 'English',
		icon: 'https://www.svgrepo.com/show/405643/flag-for-flag-united-kingdom.svg',
	},
	{
		code: FRENCH_CODE,
		name: 'Français',
		icon: 'https://www.svgrepo.com/show/405485/flag-for-flag-france.svg',
	},
]

export function LanguageSelect() {
	const languageCode = useLanguage()
	const language = LANGUAGE_ITEMS.find((e) => e.code === languageCode) || LANGUAGE_ITEMS[0]

	const setLanguage = async (code: LanguageCode) => {
		const id = await db.language.put({
			id: 'lang',
			code,
		})
	}
	return (
		<Select
			onValueChange={(e) => {
				setLanguage(e as LanguageCode)
			}}>
			<SelectTrigger className="w-auto bg-transparent text-white">
				<SelectValue
					placeholder={
						<img alt="language icon" className="w-6 h-6" src={language.icon} />
					}
				/>
			</SelectTrigger>
			<SelectContent>
				{LANGUAGE_ITEMS.map((item) => (
					<SelectItem key={item.code} value={item.code}>
						<span className="flex flex-col text-center justify-center">
							<img alt="language icon" className="w-6 h-6" src={item.icon} />{' '}
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
