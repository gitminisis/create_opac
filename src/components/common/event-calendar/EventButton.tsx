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
	PATRON,
	TAG_FUNC_RSVP,
	SISN,
	ContactInfo,
	TAG_FUNC_ACCESS,
	TAG_FUNC_CANCEL,
	TAG_FUNC_CAN_RES,
} from './Constants'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Accessibility, SquareUserRound, X } from 'lucide-react'
import EventRSVPForm from './EventRSVPForm'
import useConstants from '@/hooks/useConstants'
import { useAtom } from 'jotai'
import { calendarWeekType } from '@/store'
import EventRSVPCancel from './EventCancel'

const EventButton = ({
	elm,
	id,
	contactInfo,
}: {
	elm: Cal_event
	id: number
	contactInfo: ContactInfo[]
}) => {
	const [weekType, _] = useAtom(calendarWeekType)
	const message = useConstants().message
	const { logo } = useConstants().config
	const getColor = (event_type: string) => {
		let result = FILTER_TYPE_COLORS?.filter((item) => {
			return convertLowerTrim(item.type) === convertLowerTrim(event_type)
		})
		return `${result[0]?.color} ${result[0]?.icon}`
	}

	return (
		<Dialog key={id}>
			<DialogTrigger asChild>
				<Button className={`w-full h-[95%] border-hidden p-0 `} variant="outline">
					<div className={'w-full text-left'}>
						<div className={'flex'}>
							<div
								className={cn(
									'h-4 w-[16px] border rounded',
									getColor(elm[TAG_FUNC_LOC])
								)}></div>
							<p className={'w-full h-full hidden sm:block break-all text-left'}>
								{elm[TAG_NAME]}
							</p>
						</div>
						{weekType && (
							<div className={'flex items-center justify-around w-full'}>
								<div>
									<div>{elm[TAG_FUNC_START_T]?.toUpperCase()}-</div>
									<div>{elm[TAG_FUNC_END_T]?.toUpperCase()}</div>
								</div>
								<div className={'hidden sm:block w-[18px]'}>
									{elm[TAG_FUNC_RSVP] && <SquareUserRound />}
								</div>
							</div>
						)}
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent hideClose={'invisible'} className={'max-w-lg md:max-w-3xl '}>
				<DialogHeader>
					<DialogTitle
						className={
							' bg-primary text-primary-foreground h-10 flex items-center justify-between rounded p-2 '
						}>
						
						<div className="h-8">
							<img className="h-full" src={logo} alt="logo" />
						</div>
						<div className={'flex'}>
							<div
								className={cn(
									'h-4 w-[16px] border rounded mr-1',
									getColor(elm[TAG_FUNC_LOC])
								)}></div>
							<div>{elm[TAG_FUNC_LOC]}</div>
						</div>
						<DialogPrimitive.Close>
							<X className={'h-6 w-6'} />
						</DialogPrimitive.Close>
					</DialogTitle>
				</DialogHeader>
				<div className={'w-full min-h-[400px]  sm:flex font-bold relative'}>
				{elm[TAG_FUNC_CANCEL] && <EventRSVPCancel reason={elm[TAG_FUNC_CAN_RES]} />}
					<div className={'w-full sm:w-8/12 '}>
						<div className={'overflow-hidden text-lg'}>{elm[TAG_NAME]}</div>
						<div className={'sm:flex'}>
							<div className="ml-[10px] sm:ml-0 text-md  text-gray-600 font-bold">
								&#x2022;{elm[TAG_FUNC_DATE]}
							</div>
							<div className="ml-[10px] text-md text-gray-600 font-bold">
								<span>&#x2022;{elm[TAG_FUNC_START_T]?.toUpperCase()}</span>
								<span className={'mx-2'}>-</span>
								<span>{elm[TAG_FUNC_END_T]?.toUpperCase()}</span>
							</div>
							<div className="ml-[10px] text-md text-gray-600 font-bold">
								&#x2022;{message.room}: {elm[TAG_FUNC_ROOM]}
							</div>
							{elm[TAG_FUNC_ACCESS] && (
								<div className="ml-[10px] text-md text-gray-600 font-bold flex">
									&#x2022;
									<Accessibility />: Y
								</div>
							)}
						</div>
						<div className={'sm:flex'}>
							<div className="sm:ml-0 ml-[10px] text-md text-gray-600 font-bold">
								&#x2022;{message.suitableFor}: {elm[TAG_FUNC_LOC_AUD]}
							</div>
							<div className="ml-[10px] text-md text-gray-600 font-bold">
								&#x2022;{message.seats}: {elm[TAG_FUNC_CAP]}
							</div>
							<div className="ml-[10px] text-md text-gray-600 font-bold">
								&#x2022;{message.language}: {elm[TAG_FUNC_LANG]}
							</div>
						</div>
						<DialogDescription
							className={
								'h-full max-h-80 break-all overflow-x-hidden overflow-y-auto'
							}>
							{elm[TAG_FUNC_DESC]}
						</DialogDescription>
					</div>
					<div className={'w-full sm:w-4/12'}>
						{elm[TAG_FUNC_RSVP] && (
							<EventRSVPForm
								sisnNumber={elm[SISN]}
								capacity={elm[TAG_FUNC_CAP]}
								patrons={convertToArr(elm[PATRON])}
								event={elm}
								contactInfo={contactInfo}
							/>
						)}
					</div>
				</div>
				<DialogFooter>
					<DialogPrimitive.Close
						className={
							'bg-primary text-primary-foreground h-10 w-20 flex items-center justify-around rounded'
						}>
						{message.close}
					</DialogPrimitive.Close>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default EventButton
