import axios from 'axios'
import X2JS from 'x2js' // Ensure X2JS is installed
import { CALENDAR_WEEK_VIEW_DAYS, MAIN_MWI_APPLICATION, MONTH_REPORT } from './Constants'
import { convertToArr } from '@/lib/utils'

const getWeekRange = (currentDate: any) => {
	const firstDayOfWeek: Date = new Date(currentDate)
	firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

	const lastDayOfWeek: Date = new Date(firstDayOfWeek)
	lastDayOfWeek.setDate(firstDayOfWeek.getDate() + CALENDAR_WEEK_VIEW_DAYS - 1)

	const formatDate = (date: Date): string => {
		const year: number = date.getFullYear()
		const month: string = String(date.getMonth() + 1).padStart(2, '0')
		const day: string = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const firstDay: string = formatDate(firstDayOfWeek)
	const lastDay: string = formatDate(lastDayOfWeek)

	return { firstDay, lastDay }
}

export const fetch_get = async (currentDate: Date, isWeekType?: boolean) => {
	const DATE_FIELD = 'TAG_FUNC_DATE'
	const DATE_WILDCARD = isWeekType
		? `${getWeekRange(currentDate).firstDay}//${getWeekRange(currentDate).lastDay}`
		: `${currentDate.getFullYear()}%2D0${currentDate.getMonth() + 1}%2D%2A`;

	try {
		const response = await axios.get(
			`/scripts/mwimain.dll/144/${MAIN_MWI_APPLICATION}/${MONTH_REPORT}?commandsearch&exp=${DATE_FIELD} ${DATE_WILDCARD}`,
			{
				headers: {
					'Content-Type': 'text/xml',
				},
			}
		)
		const x2js = new X2JS()
		const jsonData: any = x2js.xml2js(response.data)
		const event = jsonData?.div?.xml?.event

		if (!event) return []
		return convertToArr(event)
	} catch (error) {
		throw error
	}
}
