import { ENGLISH_CODE, FRENCH_CODE, LanguageCode } from '@/types/lang'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useLanguage } from '@/hooks/useLanguage'
import { db } from '../../db/client'
import { deleteCookie, getCookieValue, setCookie } from '@/lib/utils'
import { useEffect } from 'react'
export interface ILANGUAGE {
	code: LanguageCode
	name: string
	icon: string
	abbr: string
}
export const LANGUAGE_ITEMS: ILANGUAGE[] = [
	{
		code: FRENCH_CODE,
		name: 'Français',
		icon: 'https://www.svgrepo.com/show/405485/flag-for-flag-france.svg',
		abbr: 'FR',
	},
	{
		code: ENGLISH_CODE,
		name: 'English',
		icon: 'https://www.svgrepo.com/show/405643/flag-for-flag-united-kingdom.svg',
		abbr: 'EN',
	},
]

export function LanguageSelect() {
	const languageCode = useLanguage()
	const language = LANGUAGE_ITEMS.find((e) => e.code === languageCode) || LANGUAGE_ITEMS[0]
	useEffect(() => {
		if (languageCode === FRENCH_CODE && !getCookieValue('my_lang')) {
			setCookie('my_lang', '145')
		}
	}, [languageCode])

	const setLanguage = async (code: LanguageCode) => {
		const id = await db.language.put({
			id: 'lang',
			code,
		})

		if (code == ENGLISH_CODE) {
			deleteCookie('my_lang')
		}
	}
	return (
		<Select
			onValueChange={(e) => {
				setLanguage(e as LanguageCode)
			}}>
			<SelectTrigger className="w-auto bg-primary text-primary-foreground">
				<SelectValue placeholder={language.abbr} />
			</SelectTrigger>
			<SelectContent>
				{LANGUAGE_ITEMS.map((item) => (
					<SelectItem key={item.code} value={item.code} className="">
						<div className="flex justify-center items-center">
							<span className="">{item.abbr}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
