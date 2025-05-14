/**
 * EventCalendarEventList: Event list modal button (more than three events, it shows the all event buttons)
 */
import { convertLowerTrim } from '@/lib/utils'
import { calendarMonthType } from '@/store'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import {
	Cal_event,
	ContactInfoRSVP,
	Day_obj,
	FilterType,
	TAG_FUNC_DATE,
	TAG_FUNC_DTE_LIST,
	TAG_FUNC_START_T,
} from './Constants'
import EventAllButton from './EventAllButton'
import EventButton from './EventButton'
import EventSumButton from './EventSumButton'

export interface Event_list {
	dayObj: Day_obj
	currentFilter: string[]
	currentEvent: Cal_event[]
	weekType: boolean
	contactInfo: ContactInfoRSVP[]
	filterTypes: FilterType[]
	filterOption: string
	databaseType:any
}

const EventCalendarEventList = ({
	dayObj,
	currentFilter = [],
	currentEvent,
	contactInfo,
	filterTypes,
	filterOption,
	databaseType
}: Event_list) => {
	const [filteredEvents, setFilteredEvents] = useState<Cal_event[]>([])
	const [monthType, __] = useAtom(calendarMonthType)
	useEffect(() => {
		const updatedFilteredEvents = currentEvent?.filter((item: any) => {
			const { day, month, year } = changeStrToDate(item?.TAG_FUNC_DATE)
			const isMatchingDayMonth =
				day === dayObj.day && month === dayObj.month && year === dayObj.year
			if (currentFilter.length > 0) {
				return (
					isMatchingDayMonth &&
					currentFilter.some(
						(type: string) =>
							convertLowerTrim(type) === convertLowerTrim(item[filterOption])
					)
				)
			}
			return isMatchingDayMonth
		})

		updatedFilteredEvents?.sort((a: Cal_event, b: Cal_event) => {
			const timeA: any = parseTimeString(a[TAG_FUNC_START_T])
			const timeB: any = parseTimeString(b[TAG_FUNC_START_T])
			if (timeA && timeB) {
				return timeA.getTime() - timeB.getTime()
			}
			return 0
		})
		setFilteredEvents(updatedFilteredEvents)
	}, [currentEvent, currentFilter, dayObj])

	const changeStrToDate = (dateString: string) => {
		if (dateString) {
			let date =
				dateString?.split('-').map((part) => parseInt(part.replace(/^0+/, ''), 10)) ?? []
			let day = date[2] ?? 0
			let month = date[1] ?? 0
			let year = date[0] ?? 0
			return { day, month, year }
		}
		return { day: undefined, month: undefined, year: undefined }
	}

	// SMA's time format is 00:00 PM/AM
	// To sort the time shift
	const parseTimeString = (timeString: string) => {
		if (timeString) {
			const [time, meridian] = timeString?.split(' ')
			const [hours, minutes] = time?.split(':').map(Number)
			const meridianUpper = meridian?.toUpperCase()

			let hours24 = hours
			if (meridianUpper === 'PM' && hours !== 12) {
				hours24 += 12
			} else if (meridianUpper === 'AM' && hours === 12) {
				hours24 = 0
			}
			const dateObject = new Date()
			dateObject.setHours(hours24, minutes, 0, 0)
			return dateObject
		}
		return
	}

	const groupedByType = (filteredEvents: Cal_event[]) => {
		let typeArr: any = {}
		let result = []
		filteredEvents.forEach((classInfo: any) => {
			const type = classInfo[filterOption]
			if (!typeArr[type]) {
				typeArr[type] = []
			}
			typeArr[type].push(classInfo)
		})
		result = Object.keys(typeArr).map((item) => {
			return { [filterOption]: item, [TAG_FUNC_DTE_LIST]: typeArr[item] }
		})
		return result ?? []
	}

	const renderButtonPage = () => {
		if (monthType && filterTypes.length > 1) {
			// Filtered sum view at month type
			return groupedByType(filteredEvents).map((item, key) => {
				return (
					<EventSumButton
						key={key}
						item={item}
						contactInfo={contactInfo}
						filterTypes={filterTypes}
						filterOption={filterOption}
						databaseType={databaseType}
					/>
				)
			})
		} else {
			return (
				<div
					className={`${
						monthType
							? 'max-h-[95%] mb-[2px] w-full overflow-y-auto custom-scrollbar'
							: 'flex md:block h-[70px] md:h-[93%] mb-[2px] overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto w-full custom-scrollbar mr-1 md:p-1'
					}
					'`}>
					{filteredEvents?.map((item: any, idx: number) => (
						<EventButton
							elm={item}
							key={idx}
							id={idx}
							contactInfo={contactInfo}
							filterTypes={filterTypes}
							filterOption={filterOption}
							databaseType={databaseType}
						/>
					))}
				</div>
			)
		}
	}

	return (
		<div className={`h-full relative w-full`}>
			<div className={'bg-slate-200 flex justify-between h-[25px]'}>
				<div>{dayObj?.day}</div>
				{filteredEvents.length > 2 && (
					<div>
						<EventAllButton filteredEvents={filteredEvents} contactInfo={contactInfo} />
					</div>
				)}
			</div>
			{renderButtonPage()}
		</div>
	)
}

export default EventCalendarEventList
