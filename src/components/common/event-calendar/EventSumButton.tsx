import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import { Button } from '../../ui/button'
import { cn, convertToArr } from '@/lib/utils'
import { convertLowerTrim } from '@/lib/utils'
import {
	Cal_event,
	TAG_FUNC_DATE,
	TAG_FUNC_DESC,
	TAG_FUNC_END_T,
	TAG_NAME,
	TAG_FUNC_ROOM,
	TAG_FUNC_LOC_AUD,
	TAG_FUNC_START_T,
	TAG_NAME_LENGTH,
	TAG_FUNC_LOC,
	FILTER_TYPE_COLORS,
	TAG_FUNC_CAP,
	TAG_FUNC_LANG,
	TAG_FUNC_LOC_LENGTH,
	TAG_FUNC_DTE_LIST,
	TAG_FUNC_RSVP,
	PATRON,
	SISN,
	ContactInfo,
	TAG_FUNC_CANCEL,
	TAG_FUNC_CAN_RES,
} from './Constants'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import EventRSVPForm from './EventRSVPForm'
import { CalendarCheck } from 'lucide-react'
import EventButton from './EventButton'
import useConstants from '@/hooks/useConstants'
import { useAtom } from 'jotai'
import { calendarMonthType, calendarWeekType } from '@/store'
import EventRSVPCancel from './EventCancel'

export interface eventSumType {
	filteredEvents: Cal_event[]
	contactInfo: ContactInfo[]
}

const EventSumButton = ({ filteredEvents, contactInfo }: eventSumType) => {
	const [monthType, __] = useAtom(calendarMonthType)
	const { logo } = useConstants().config
	const getColor = (event_type: string) => {
		let result = FILTER_TYPE_COLORS?.filter((item) => {
			return convertLowerTrim(item.type) === convertLowerTrim(event_type)
		})
		return `${result[0]?.color} ${result[0]?.icon}`
	}
	const message = useConstants().message

	const groupedByLocation = (filteredEvents: Cal_event[]) => {
		let locationArr: any = {}
		let result = []

		filteredEvents.forEach((classInfo) => {
			const location = classInfo[TAG_FUNC_LOC]
			if (!locationArr[location]) {
				locationArr[location] = []
			}
			locationArr[location].push(classInfo)
		})
		result = Object.keys(locationArr).map((loc) => {
			return { [TAG_FUNC_LOC]: loc, [TAG_FUNC_DTE_LIST]: locationArr[loc] }
		})
		return result ?? []
	}

	return (
		<>
			{monthType && filteredEvents.length > 3 ? (
				<div className={'h-full mb-[2px] overflow-x-hidden'}>
					{groupedByLocation(filteredEvents).map((item: any, key: number) => (
						<Dialog key={key}>
							<DialogTrigger asChild>
								<Button
									className={'h-[20px] border-hidden flex p-0 justify-start'}
									variant="outline">
									<div
										className={cn(
											'h-4 w-[16px] border rounded',
											getColor(item[TAG_FUNC_LOC])
										)}></div>
									<div className={'hidden sm:block max-w-[126px] text-left '}>
										{item[TAG_FUNC_LOC]?.slice(0, TAG_FUNC_LOC_LENGTH)}
									</div>
									<div className={'flex items-center justify-center'}>
										<CalendarCheck height={18} className={'hidden sm:block'} />:
										<div>{item[TAG_FUNC_DTE_LIST].length}</div>
									</div>
								</Button>
							</DialogTrigger>
							<DialogContent
								hideClose={'invisible'}
								className={'max-w-lg h-[500px] overflow-auto p-4 md:max-w-3xl'}>
								<>
									<DialogHeader className={'w-full sticky top-0 bg-white z-10 '}>
										<DialogTitle
											className={
												' bg-primary text-primary-foreground h-10 flex items-center justify-between rounded p-2'
											}>
											<div className="h-8">
												<img className="h-full" src={logo} alt="logo" />
											</div>
											<div className={'flex'}>
												<div
													className={cn(
														'h-4 w-[16px] border rounded mr-1',
														getColor(item[TAG_FUNC_LOC])
													)}></div>
												{item[TAG_FUNC_LOC]}
											</div>
											<DialogPrimitive.Close>
												<X className={'h-6 w-6'} />
											</DialogPrimitive.Close>
										</DialogTitle>
									</DialogHeader>
									{item[TAG_FUNC_DTE_LIST]?.map((elm: any, key: number) => (
										<div
											key={key}
											className={
												'w-full text-l sm:flex font-bold p-2 border-2 rounded relative'
											}>
											{elm[TAG_FUNC_CANCEL] && (
												<EventRSVPCancel reason={elm[TAG_FUNC_CAN_RES]} />
											)}
											<div
												className={`w-full ${elm[TAG_FUNC_RSVP] && 'sm:w-8/12'}`}>
												<div className={'overflow-hidden text-lg'}>
													{elm[TAG_NAME]} {elm[TAG_FUNC_CANCEL]}
												</div>
												<div className={'sm:flex'}>
													<div className="ml-[10px] sm:ml-0 text-md text-gray-600 font-bold">
														&#x2022;{elm[TAG_FUNC_DATE]}
													</div>
													<div className="ml-[10px] text-md text-gray-600 font-bold">
														<span>
															&#x2022;
															{elm[TAG_FUNC_START_T]?.toUpperCase()}
														</span>
														<span className={'mx-2'}>-</span>
														<span>
															{elm[TAG_FUNC_END_T]?.toUpperCase()}
														</span>
													</div>
													<div className="ml-[10px] text-md text-gray-600 font-bold">
														&#x2022;{message.room}: {elm[TAG_FUNC_ROOM]}
													</div>
												</div>
												<div className={'sm:flex'}>
													<div className="sm:ml-0 ml-[10px] text-md text-gray-600 font-bold">
														&#x2022;{message.suitableFor}:{' '}
														{elm[TAG_FUNC_LOC_AUD]}
													</div>
													<div className="ml-[10px] text-md text-gray-600 font-bold">
														&#x2022;{message.seats}: {elm[TAG_FUNC_CAP]}
													</div>
													<div className="ml-[10px] text-md text-gray-600 font-bold">
														&#x2022;{message.language}:{' '}
														{elm[TAG_FUNC_LANG]}
													</div>
												</div>
												<DialogDescription
													className={
														'h-[320px] break-all overflow-y-auto'
													}>
													{elm[TAG_FUNC_DESC]}
												</DialogDescription>
											</div>
											{elm[TAG_FUNC_RSVP] && (
												<div className={'w-full sm:w-4/12'}>
													<EventRSVPForm
														capacity={elm[TAG_FUNC_CAP]}
														patrons={convertToArr(elm[PATRON])}
														event={elm}
														sisnNumber={elm[SISN]}
														contactInfo={contactInfo}
													/>
												</div>
											)}
										</div>
									))}
									<DialogFooter>
										<DialogPrimitive.Close
											className={
												'bg-primary text-primary-foreground h-10 w-20 flex items-center justify-around rounded'
											}>
											{message.close}
										</DialogPrimitive.Close>
									</DialogFooter>
								</>
							</DialogContent>
						</Dialog>
					))}
				</div>
			) : (
				<div className={'max-h-[95%] mb-[2px] w-full overflow-y-auto'}>
					{filteredEvents.map((item: any, idx: number) => (
						<EventButton elm={item} key={idx} id={idx} contactInfo={contactInfo} />
					))}
				</div>
			)}
		</>
	)
}

export default EventSumButton
