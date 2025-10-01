import Layout from '@/components/layouts'
import { Button } from '@/components/ui/button'
import useJSONData from '@/hooks/useJSONData'
import { convertToArr, convertToString, convertXMLToJson, removeQuote } from '@/lib/utils'
import { Archive, ChevronDownIcon, CircleEllipsis } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import useConstants from '@/hooks/useConstants'
import axios from 'axios'
import { REQUEST_DESC_DB } from '../request/RequestConfirmed'

export type ScheduleData = {
	operation_day_entry: {
		weekday: 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su'
		collection_time_entry?: {
			start_time: string
			end_time: string
		}[]
		date_closed?: 'X'
	}[]
	closure_date_entry: {
		closure_date: string
		closure_desc: string
	}[]
	sp_open_date_entry: {
		open_date: string
		sp_open_collection_time_entry: {
			sp_start_time: string
			sp_end_time: string
		}[]
		sp_cutoff_date: string
		sp_cufoff_time: string
	}[]
	delivery_time_entry: {
		delivery_type: 'OFFSITESTD' | 'OFFSITECOLD' | 'OFFSITECOOL'
		delivery_day: string
	}[]
}

const RequestLater = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const handleGoBack = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		window.history.back()
	}
	const [selectDate, setSelectDate] = useState<{
		date: Date
		timeSlots: {
			start_time?: string
			end_time?: string
			sp_start_time?: string
			sp_end_time?: string
		}[]
	} | null>(null)
	const [time, setTime] = useState()
	const weekdayToIndex: any = {
		su: 0,
		mo: 1,
		tu: 2,
		we: 3,
		th: 4,
		fr: 5,
		sa: 6,
	}
	let reqData: any = records[0].request
	let record: any = records[0]
	const { message } = useConstants()
	const [calData, setCalData] = useState<ScheduleData>({
		operation_day_entry: [],
		closure_date_entry: [],
		sp_open_date_entry: [],
		delivery_time_entry: [],
	})

	useEffect(() => {
		getData()
	}, [])

	const getData = async () => {
		return await axios
			.get(`/preprocessing/REQUEST CALENDAR.TXT`, {
				headers: {
					'Content-Type': 'text/xml',
				},
				withCredentials: true,
				timeout: 5000,
			})
			.then((res) => {
				const conToJson = convertXMLToJson(res.data)
				const calDataJson = conToJson.calendar_info
				setCalData({
					operation_day_entry: convertToArr(calDataJson.operation_day_entry),
					closure_date_entry: convertToArr(calDataJson.closure_date_entry),
					sp_open_date_entry: convertToArr(calDataJson.sp_open_date_entry),
					delivery_time_entry: convertToArr(calDataJson.delivery_time_entry),
				})
			})
	}

	const openWeekdays = calData.operation_day_entry.filter((d) => d.date_closed !== 'X').map((d) => weekdayToIndex[d.weekday])
	const closureDates = new Set(calData.closure_date_entry.map((d) => d.closure_date))
	const specialOpenDates = new Set(calData.sp_open_date_entry.map((d) => d.open_date))

	const getDeliveryDate = (item_delivery_type: string) => {
		let days = calData.delivery_time_entry.find((item) => item.delivery_type === item_delivery_type)
		if (days) {
			return days
		}
		return { delivery_day: '1' }
	}

	function isClosed(date: Date) {
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const inputDate = new Date(date)
		inputDate.setHours(0, 0, 0, 0)

		const deliveryData = getDeliveryDate(record.aone_loc)
		const deliveryDays = parseInt(deliveryData?.delivery_day || '0', 10)

		const blockedUntil = new Date(today)
		blockedUntil.setDate(today.getDate() + deliveryDays)

		if (inputDate < blockedUntil) return false

		const yyyyMMdd = date.toISOString().split('T')[0]
		if (specialOpenDates.has(yyyyMMdd)) return false
		if (closureDates.has(yyyyMMdd)) return true
		return openWeekdays.includes(date.getDay()) ? false : true
	}

	const handleSelect = (date: Date | undefined) => {
		if (!date) return

		const yyyyMMdd = date.toISOString().split('T')[0]
		const sp = calData.sp_open_date_entry.find((d) => d.open_date === yyyyMMdd)
		if (sp) {
			setSelectDate({ date, timeSlots: sp.sp_open_collection_time_entry })
			return
		}
		const day = date.getDay()
		const weekdayKey = Object.keys(weekdayToIndex).find((key) => weekdayToIndex[key] === day)
		const op = calData.operation_day_entry.find((d) => d.weekday === weekdayKey && d.date_closed !== 'X')

		setSelectDate({ date, timeSlots: op?.collection_time_entry || [] })
	}

	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						<div className="flex justify-between items-center border-b pb-4">
							<form method="post" className="m-0 w-full" action={'?REQUESTLOGIN&DBNAME=DESCRIPTION_WEB'}>
								<input type="hidden" name="REQ_WAIT_TIME" value={'0'} />
								<input type="hidden" name="ITEM_REQ_TIME" value={'9:00'} />
								<input type="hidden" name="method_request" value={reqData.method_request} />
								<input type="hidden" name="req_topic" value={reqData.req_topic} />
								<input type="hidden" name="req_appl_name" value={reqData.req_appl_name} />
								<input type="hidden" name="req_db_name" value={REQUEST_DESC_DB} />
								<input type="hidden" name="req_db_recid" value={reqData.req_db_recid} />
								<input type="hidden" name="req_title" value={convertToString(reqData, 'req_item_title')} />
								<input type="hidden" name="req_db_link1" value={reqData.req_db_link1} />
								<input type="hidden" name="req_item_id" value={record.select_item_id} />
								<input type="hidden" name="req_item_title" value={convertToString(reqData, 'req_item_title')} />
								<input type="hidden" name="req_queue" value={reqData.req_queue} />
								<h1 className="flex items-center text-xl font-bold">
									<CircleEllipsis className="mr-2" />
									{message.requestRecordLater}
								</h1>
								<div className="mt-3 border p-4 rounded">
									<div className="flex flex-row items-center">
										<Archive className="mr-2" />
										<h1 className="text-xl font-bold">{message.archives}</h1>
									</div>
									<p className="text-lg font-bold mt-2">{convertToString(reqData, 'req_item_title')}</p>
									<div className={'md:flex'}>
										<p className="text-sm text-gray-600">
											{message.barcode} : {record.select_item_id}
										</p>
									</div>
								</div>
								<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
									<p>{message.visitRequirement}</p>
								</div>
								<div className="flex items-center text-xl font-bold mt-7">
									<CircleEllipsis className="mr-2" />
									{message.visitDateLabel}
								</div>
								<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
									<p>{message.availabilityInfo}</p>
								</div>
								<div className="w-full md:flex ">
									<div className="md:w-1/2 flex justify-center">
										<Calendar
											mode="single"
											selected={selectDate?.date}
											onSelect={handleSelect}
											disabled={(date: Date) => isClosed(date)}
										/>
									</div>
									<div className="md:w-1/2 text-center md:text-left">
										<div className={'mx-2 md:mx-0'}>
											<div className="text-lg font-bold mt-2">{message.date}</div>
											<input
												className="inline-flex items-center justify-between px-4 py-2 border rounded bg-white shadow text-sm w-40"
												name={'DATE_NEEDED'}
												value={selectDate ? selectDate.date.toISOString().split('T')[0] : ''}
												readOnly
											/>
										</div>
										<div className={'mx-2 md:mx-0'}>
											<div className="text-lg font-bold mt-2">{message.time}</div>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger className="inline-flex items-center justify-between px-4 py-2 border rounded bg-white shadow text-sm w-40">
													{time || 'Select'}
													<ChevronDownIcon className="h-4 w-4" />
												</DropdownMenu.Trigger>
												<DropdownMenu.Portal>
													<DropdownMenu.Content
														sideOffset={5}
														className="rounded-md bg-white shadow-md border p-1 text-sm w-40">
														{selectDate?.timeSlots.map((item: any, idx) => (
															<DropdownMenu.Item
																key={idx}
																className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
																onSelect={() => setTime(item.start_time ?? item.sp_start_time)}>
																{item.start_time ?? item.sp_start_time}
															</DropdownMenu.Item>
														))}
													</DropdownMenu.Content>
												</DropdownMenu.Portal>
											</DropdownMenu.Root>
										</div>
										{/* <div className={'mx-2 md:mx-0'}>
											<div className="text-lg font-bold mt-2">{message.estimatedLoanDaysLabel}</div>
											<input
												name="LOAN_PERIOD"
												type="number"
												className="inline-flex items-center justify-between px-4 py-2 border rounded bg-white shadow text-sm w-40"
											/>
										</div> */}
										<input type="hidden" name="TIME_NEEDED" value={time} />
									</div>
								</div>
								<div className="flex justify-center md:justify-end mt-5">
									<Button
										disabled={time && selectDate ? false : true}
										className="bg-primary rounded mx-1 hover:bg-primary"
										type="submit"
										name="Submit"
										variant="default">
										{message.request}
									</Button>
									<Button className="bg-primary rounded mx-1 hover:bg-primary" variant="default" onClick={handleGoBack}>
										{message.cancel}
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default RequestLater
