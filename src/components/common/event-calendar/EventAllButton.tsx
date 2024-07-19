import React, { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import { Button } from '@/components/ui/button'
import { convertLowerTrim, convertToArr } from '@/lib/utils'
import { cn } from '@/lib/utils'
import * as Accordion from '@radix-ui/react-accordion'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Accessibility, BookX, X } from 'lucide-react'
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
	PATRON,
	SISN,
	ContactInfo,
	TAG_FUNC_ACCESS,
	TAG_FUNC_CANCEL,
	TAG_FUNC_CAN_RES,
	TAG_FUNC_RSVP,
	EVENT_CANCEL_NOTI_MODAL_BG,
} from './Constants'
import EventRSVPForm from './EventRSVPForm'
import { AccordionTrigger } from '@radix-ui/react-accordion'
import { AccordionContent } from '@/components/ui/accordion'
import useConstants from '@/hooks/useConstants'
import EventRSVPCancel from './EventCancel'

const EventAllButton = ({
	filteredEvents,
	contactInfo,
}: {
	filteredEvents: Cal_event[]
	contactInfo: ContactInfo[]
}) => {
	const { logo } = useConstants().config
	const message = useConstants().message

	// Description more button func
	// const [showFullStr, setShowFullStr] = useState<showStrObj>({})
	// const resetToggleSetting = async () => {
	// 	setShowFullStr({})
	// }
	// const showStrToggle = (key: number) => {
	// 	setShowFullStr((prevShowFullStr) => {
	// 		const updatedShowFullStr = { ...prevShowFullStr }
	// 		updatedShowFullStr[key] = !updatedShowFullStr[key]
	// 		return updatedShowFullStr
	// 	})
	// }

	const getColor = (event_type: string) => {
		let result = FILTER_TYPE_COLORS?.filter((item) => {
			return convertLowerTrim(item.type) === convertLowerTrim(event_type)
		})
		return `${result[0]?.color} ${result[0]?.icon}`
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className={
						' h-full w-full px-0 flex items-center justify-center overflow-hidden'
					}>
					{message.all} {filteredEvents.length} {message.events}
				</Button>
			</DialogTrigger>
			<DialogContent
				className={
					'max-w-lg h-[500px] overflow-auto p-1 flex flex-col items-center max-w-l md:max-w-3xl'
				}
				hideClose={'invisible'}>
				<DialogHeader className={'w-full sticky top-0 bg-white z-10 '}>
					<DialogTitle
						className={
							' bg-primary text-primary-foreground h-10 flex items-center justify-between rounded p-2'
						}>
						<div className="h-8">
							<img className="h-full" src={logo} alt="logo" />
						</div>
						<div>
							{message.all} {message.events}
						</div>
						<DialogPrimitive.Close>
							<X className={'h-6 w-6'} />
						</DialogPrimitive.Close>
					</DialogTitle>
				</DialogHeader>
				<Accordion.Root type="multiple" className={'AccordionRoot w-full px-2 '}>
					{filteredEvents.map((item: Cal_event, idx: number) => (
						<Accordion.Item className="AccordionItem" value={`${idx}`} key={idx}>
							<AccordionTrigger className={'w-full'}>
								<div key={idx} className={'w-full'}>
									<DialogTitle
										className={
											'bg-primary text-primary-foreground h-10 flex justify-center items-center rounded m-1'
										}>
										<div className={'flex justify-between w-[400px]'}>
											<div className={'flex'}>
												<div
													className={cn(
														'h-4 w-[16px] border rounded mr-1',
														getColor(item[TAG_FUNC_LOC])
													)}></div>
												{item[TAG_FUNC_LOC]}
											</div>
											<div className={'mx-2'}>
												<span>{item[TAG_FUNC_START_T]?.toUpperCase()}</span>
												<span className={'mx-2'}>-</span>
												<span>{item[TAG_FUNC_END_T]?.toUpperCase()}</span>
											</div>
										</div>
									</DialogTitle>
								</div>
							</AccordionTrigger>
							<AccordionContent
								style={{ borderRadius: '5px' }} // Tailwind rounded-lg is not working so I put inline style here
								className={'border-2 border-lime-950 relative'}>
								{item[TAG_FUNC_CANCEL] && (
									<div
										className={`absolute z-40 ${EVENT_CANCEL_NOTI_MODAL_BG} rounded mx-auto left-0 right-0 w-[250px] h-[100px] top-1/4 text-white flex justify-center items-center`}>
										<div className={'flex justify-center items-center text-xl'}>
											<BookX /> {message.eventCancel}
										</div>
									</div>
								)}
								<div className={'flex '}>
									<div
										className={
											'w-full text-lg w-full flex flex-col justify-center items-left font-bold px-2 '
										}>
										<div className={'text-lg font-bold'}>{item[TAG_NAME]}</div>
										<div className={'sm:flex'}>
											<div className="ml-[10px] sm:ml-0 text-md text-gray-600 font-bold">
												&#x2022;{item[TAG_FUNC_DATE]}
											</div>
											<div className="ml-[10px] text-md text-gray-600 font-bold">
												<span>
													&#x2022;{item[TAG_FUNC_START_T]?.toUpperCase()}
												</span>
												<span className={'mx-2'}>-</span>
												<span>{item[TAG_FUNC_END_T]?.toUpperCase()}</span>
											</div>
											<div className="ml-[10px] text-md text-gray-600 font-bold">
												&#x2022;{message.room}: {item[TAG_FUNC_ROOM]}
											</div>
											{item[TAG_FUNC_ACCESS] && (
												<div className="ml-[10px] text-md text-gray-600 font-bold flex">
													&#x2022;
													<Accessibility />: Y
												</div>
											)}
										</div>
										<div className={'sm:flex'}>
											<div className="sm:ml-0 ml-[10px] text-md text-gray-600 font-bold">
												&#x2022;{message.suitableFor}{' '}
												{item[TAG_FUNC_LOC_AUD]}
											</div>
											<div className="ml-[10px] text-md text-gray-600 font-bold">
												&#x2022;{message.seats}: {item[TAG_FUNC_CAP]}
											</div>
											<div className="ml-[10px] text-md text-gray-600 font-bold">
												&#x2022;{message.language}: {item[TAG_FUNC_LANG]}
											</div>
										</div>
									</div>
								</div>
								{/* 'More' button to toggle description of the event */}
								<DialogDescription
									className={`min-h-[100px] p-2 break-all overflow-x-hidden overflow-y-auto`}>
									{item[TAG_FUNC_DESC]}
								</DialogDescription>
								{item[TAG_FUNC_RSVP] && !item[TAG_FUNC_CANCEL] && (
									<div className={'h-[380px] font-bold m-2 p-2'}>
										<EventRSVPForm
											capacity={item[TAG_FUNC_CAP]}
											patrons={convertToArr(item[PATRON])}
											sisnNumber={item[SISN]}
											event={item}
											contactInfo={contactInfo}
										/>
									</div>
								)}
								{/*  Description more button func */}
								{/* <DialogDescription
									className={`${showFullStr[idx] ? 'h-72' : 'h-10'} p-2 break-all overflow-x-hidden overflow-y-auto`}>
									<>
										{showFullStr[idx] ? (
											<>
												{item[TAG_FUNC_DESC]}
												<button
													className={'text-slate-950 font-semibold'}
													onClick={() => showStrToggle(idx)}>
													....Close
												</button>
											</>
										) : (
											<>
												{item[TAG_FUNC_DESC]?.substring(0, 10)}
												{(item[TAG_FUNC_DESC]?.length ?? 0) > 10 && (
													<button
														className={'text-slate-950 font-semibold'}
														onClick={() => showStrToggle(idx)}>
														....More
													</button>
												)}
											</>
										)}
									</>
								</DialogDescription> */}
							</AccordionContent>
						</Accordion.Item>
					))}
				</Accordion.Root>
				<DialogFooter className={'w-full flex absolute bottom-1 relative'}>
					{/* <DialogPrimitive.Close
						onClick={resetToggleSetting}
						className={
							'bg-primary text-primary-foreground h-10 w-20 flex items-center justify-center rounded absolute bottom-1'
						}>
						Close
					</DialogPrimitive.Close> */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default EventAllButton
