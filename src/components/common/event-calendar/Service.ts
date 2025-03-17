import axios from 'axios'
import X2JS from 'x2js' // Ensure X2JS is installed
import {
	CALENDAR_WEEK_VIEW_DAYS,
	LOCATION_REPORT,
	LIBRARY_LOCATION_XML_TAG,
	MAIN_MWI_APPLICATION,
	MONTH_REPORT,
	SUB_MWI_APPLICATION,
	CURATORS_CODE,
	TAG_FUNC_LOC_ID,
	Cal_event,
	ContactInfoRSVP,
} from './Constants'
import { convertLowerTrim, convertToArr, convertXMLToJson } from '@/lib/utils'

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

// MWI commandsearch need 2024-04-* or 2024-10-* format
const getMonFormat = (currentDate: Date) => {
	if (currentDate.getMonth() + 1 > 9) {
		//2024-10-* format
		return `${currentDate.getMonth() + 1}`
	} else {
		//2024-09-* format
		return `0${currentDate.getMonth() + 1}`
	}
}

export const fetch_get = async (currentDate: Date, isWeekType?: boolean) => {
	const DATE_FIELD = 'TAG_FUNC_DATE'

	const DATE_WILDCARD = isWeekType
		? `${getWeekRange(currentDate).firstDay}//${getWeekRange(currentDate).lastDay}`
		: `${currentDate.getFullYear()}%2D${getMonFormat(currentDate)}%2D%2A`

	try {
		const response = await axios.get(
			`/scripts/mwimain.dll/144/${MAIN_MWI_APPLICATION}/${MONTH_REPORT}?commandsearch&exp=${DATE_FIELD} ${DATE_WILDCARD}`,
			{
				headers: {
					'Content-Type': 'text/xml',
				},
			}
		)
		const x2js = new X2JS({
			arrayAccessFormPaths: [
				'div.xml.event.FLOC_IM_REF_GRP',
				'div.xml.event.FLOC_VD_REF_GRP',
			],
		})
		const jsonData: any = x2js.xml2js(response.data)
		const events = jsonData?.div?.xml?.event
		let arr = convertToArr(events)
		return arr
	} catch (error) {
		throw error
	}
}

export const getLocation = async () => {
	const response = await axios.get(
		`/scripts/mwimain.dll/144/${SUB_MWI_APPLICATION}/${LOCATION_REPORT}?commandsearch&exp=%2B%2B%40`, // ++@
		{
			headers: {
				'Content-Type': 'text/xml',
			},
		}
	)
	const jsonData: any = convertXMLToJson(response.data)
	return jsonData?.xml?.[LIBRARY_LOCATION_XML_TAG] ?? []
}

export const getContactInfo = (type: string, contactInfo: ContactInfoRSVP[], event: Cal_event) => {
	let info: any = contactInfo?.filter((item: ContactInfoRSVP) => {
		return convertLowerTrim(item[CURATORS_CODE]) === convertLowerTrim(event[TAG_FUNC_LOC_ID])
	})

	if (info.length > 0) {
		let contact = info[0]
		const value = contact[type]
		if (value && value.__text === '') {
			return []
		}
		return value ?? []
	}

	return []
}
