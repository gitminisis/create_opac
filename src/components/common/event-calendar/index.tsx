import React, { useEffect, useState } from 'react'
import EventCalendarFilter from './EventCalendarFilter'
import EventCalendarEventList from './EventCalendarEventList'
import { Button } from '@/components/ui/button'
import { fetch_get, getLocation } from './Service'
import { calendarCurrDate, calendarEvents, calendarMonthType, calendarWeekType } from '@/store'
import { useAtom } from 'jotai'
import { CALENDAR_START_MONTH, CALENDAR_WEEK_VIEW_DAYS, Day_obj, FilterType } from './Constants'
import useConstants from '@/hooks/useConstants'
import { cn } from '@/lib/utils'

export interface calendarFilterType {
	databaseType?: string
	filterTypes: FilterType[]
	filterOption: string
}

const EventCalendar = ({ databaseType, filterTypes, filterOption }: calendarFilterType) => {
	const message = useConstants().message
	const [currentFilter, setCurrentFilter] = useState<string[]>([])
	const [isClickablePrev, setisClickablePrev] = useState<boolean>(false)
	const [isClickableNext, setisClickableNext] = useState<boolean>(false)
	const [contactInfo, setContactInfo] = useState([])
	const [currentEvent, setCurrentEvent] = useAtom(calendarEvents)
	const [weekType, setWeekType] = useAtom(calendarWeekType)
	const [monthType, setMonthType] = useAtom(calendarMonthType)
	const [currentDate, setCurrentDate] = useAtom(calendarCurrDate)

	useEffect(() => {
		getData(currentDate)
		isMonthBtnClick()
	}, [currentDate, weekType])

	useEffect(() => {
		getLocation().then((res) => setContactInfo(res))
	}, [])

	const getData = async (currentDate: Date) => {
		const currE = await fetch_get(currentDate, weekType)
		if (databaseType) {
			const filteredCurrE = currE.filter((item) => item?.TAG_DB_TYPE === databaseType)
			setCurrentEvent(filteredCurrE)
			return
		}
		setCurrentEvent(currE)
	}

	const convertToWeek = () => {
		setMonthType(false)
		setWeekType(true)
	}

	const convertToMonth = () => {
		setMonthType(true)
		setWeekType(false)
	}

	const isMonthBtnClick = () => {
		const currentYear = new Date().getFullYear()
		let next_next_year = currentYear + 2

		if (currentDate.getFullYear() >= next_next_year) {
			setisClickableNext(true)
		} else {
			setisClickablePrev(false)
			setisClickableNext(false)
		}
	}

	const daysInMonth = (date: Date) => {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		return new Date(year, month, 0).getDate() // get the last date.getMonth() + 1's last date
	}

	const generateMonth = () => {
		const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
		const days = daysInMonth(currentDate)
		const startingDay = firstDayOfMonth.getDay() // show the date thorugh number ex) mon => 1
		const calendarArray = []

		//Calculate the starting day of the month
		//2024 Mar start with Friday so before the staring date store null to not show the date at the calendar
		for (let i = 0; i < startingDay; i++) {
			calendarArray.push({ day: null })
		}

		for (let i = 1; i <= days; i++) {
			calendarArray.push({
				day: i,
				month: currentDate.getMonth() + 1,
				year: currentDate.getFullYear(),
			})
		}

		return calendarArray
	}

	const generateWeek = () => {
		const weekArray = []
		let firstDayOfWeek = new Date(currentDate)
		firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

		for (let i = 0; i < CALENDAR_WEEK_VIEW_DAYS; i++) {
			const day = new Date(firstDayOfWeek)
			day.setDate(day.getDate() + i)
			weekArray.push({
				day: day.getDate(),
				month: day.getMonth() + 1,
				year: day.getFullYear(),
			})
		}
		return weekArray
	}

	const nextWeek = () => {
		const newDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() + 7
		)
		setCurrentDate(newDate)
	}

	const prevWeek = () => {
		const newDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() - 7
		)
		setCurrentDate(newDate)
	}

	const prevMonth = () => {
		const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		setCurrentDate(newDate)
	}

	const nextMonth = () => {
		const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
		setCurrentDate(newDate)
	}

	const showWeek = () => {
		let firstDayOfWeek = new Date(currentDate)
		firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
		let nextDay = new Date(
			firstDayOfWeek.getFullYear(),
			firstDayOfWeek.getMonth(),
			firstDayOfWeek.getDate() + 6
		)

		return `${firstDayOfWeek.toLocaleString(message.dateType, { month: 'short' })} ${firstDayOfWeek.getDate()} -  
		${firstDayOfWeek.getMonth() !== nextDay.getMonth() ? nextDay.toLocaleString(message.dateType, { month: 'short' }) : ''} ${nextDay.getDate()}, ${currentDate.getFullYear()}`
	}

	return (
		<div className={'w-full  custom-scrollbar'}>
			<div
				className={
					'relative flex justify-center items-center bg-primary h-[80px] rounded '
				}>
				<Button
					onClick={weekType ? prevWeek : prevMonth}
					className={'text-4xl text-primary-foreground sm:mx-5'}
					disabled={isClickablePrev}>
					<div className="mt-2">&lt;</div>
				</Button>
				<h2 className="max-w-[330px] text-center text-3xl text-primary-foreground">
					{monthType &&
						currentDate.toLocaleString(message.dateType, {
							month: 'long',
							year: 'numeric',
						})}
					{weekType && showWeek()}
				</h2>
				<Button
					onClick={weekType ? nextWeek : nextMonth}
					className={'text-4xl text-primary-foreground sm:mx-5'}
					disabled={isClickableNext}>
					<div className="mt-2">&gt;</div>
				</Button>
				<div
					className={
						'hidden sm:absolute sm:right-5 w-[160px] sm:flex justify-evenly items-center'
					}>
					<Button
						className={
							'w-[67px] bg-black text-primary-foreground rounded hover:bg-black'
						}
						onClick={convertToMonth}>
						{message.month}
					</Button>
					<Button
						className={
							'w-[67px] bg-black text-primary-foreground rounded hover:bg-black'
						}
						onClick={convertToWeek}>
						{message.week}
					</Button>
				</div>
			</div>
			{/* Mobile Week Month View */}
			<div className={'sm:hidden mt-1 flex'}>
				<Button
					className={
						'w-1/2 bg-primary text-primary-foreground rounded hover:bg-black mr-1'
					}
					onClick={convertToMonth}>
					{message.month}
				</Button>
				<Button
					className={
						'w-1/2 bg-primary text-primary-foreground rounded hover:bg-black ml-1'
					}
					onClick={convertToWeek}>
					{message.week}
				</Button>
			</div>
			{filterOption && (
				<EventCalendarFilter
					setCurrentFilter={setCurrentFilter}
					filterTypes={filterTypes}
				/>
			)}

			<div className={'w-full mt-1'}>
				<div className={'grid grid-cols-7 gap-0.5'}>
					<div
						className={cn(
							'col-span-7 grid grid-cols-7 gap-1',
							weekType && 'col-span-1 md:col-span-7'
						)}>
						{message.daysOfWeek.map((item, key) => {
							return (
								<div
									key={key}
									className={cn(
										'text-center text-xl bg-primary text-primary-foreground rounded',
										weekType && 'col-span-7 md:col-span-1'
									)}>
									{item}
								</div>
							)
						})}
					</div>
					{monthType &&
						generateMonth().map((item: Day_obj, key: number) => {
							return (
								<div
									key={key}
									className="rounded border border-black cursor-pointer h-32 w-full">
									<EventCalendarEventList
										dayObj={item}
										currentFilter={currentFilter}
										currentEvent={currentEvent}
										weekType={weekType}
										contactInfo={contactInfo}
										filterTypes={filterTypes}
										filterOption={filterOption}
									/>
								</div>
							)
						})}
					{weekType && (
						<div
							className={cn(
								'col-span-7 grid grid-cols-7 gap-1',
								weekType && 'col-span-6 md:col-span-7'
							)}>
							{generateWeek().map((item: Day_obj, key: number) => {
								return (
									<div
										key={key}
										className={cn(
											'rounded border border-black cursor-pointer  md:h-96 w-full ',
											weekType && 'col-span-7 md:col-span-1 w-full min-h-min'
										)}>
										<EventCalendarEventList
											dayObj={item}
											currentFilter={currentFilter}
											currentEvent={currentEvent}
											weekType={weekType}
											contactInfo={contactInfo}
											filterTypes={filterTypes}
											filterOption={filterOption}
										/>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default EventCalendar
