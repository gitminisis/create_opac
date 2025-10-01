import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarCheck, ChevronDown, FolderOpen, SquareCheck } from 'lucide-react'
import { cn, convertToArr, getCookieValue, getHomeSessionID, removeQuote } from '@/lib/utils'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import TooltipButton from '@/components/common/TooltipButton'
import { toast } from '@/components/ui/use-toast'
import { REQUEST_BIBLIO_DB } from '../request/RequestConfirmed'
const IS_REQUESTABLE_ARR = ['AVAILABLE', 'CIRCULATED', 'IN TRANSFER', 'ON HOLD', 'ON ORDER']
type LibraryItem = {
	copy_number: string
	last_discrg_date: string
	barcode: string
	volume_id: string
	item_receive_dat: string
	item_call_number: string
	holding_centre: string
	media_type: string
	item_status: string
	perm_item_status: string
	shelf_location: string
	times_check_out: string
	class_scheme: string
	charge_date1: string
	i_collect_code: string
	item_price_cur: string
	item_price1: string
	item_non_circ: string
	collection_code: string
	_occ: string
}

const ITEMS_PER_PAGE = 20

const RequestAccordianBiblio = () => {
	const { message, config } = useConstants()
	const { records } = useJSONData({ selector: '#xml_record' })
	const record = records[0]
	const { request } = record
	const { item_info_occurrence } = record.record.item_info ?? []
	const [open, setOpen] = useState(false)
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)
	let items = convertToArr(item_info_occurrence)
	const patronID = getCookieValue('M2L_PATRON_ID')?.split(']')[1]

	useEffect(() => {
		if (!loadMoreRef.current) return
		const scrollContainer = loadMoreRef.current.closest('.overflow-auto')
		if (!scrollContainer) return
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
				}
			},
			{ root: scrollContainer, threshold: 1.0 }
		)
		observer.observe(loadMoreRef.current)
		return () => observer.disconnect()
	}, [])

	const handleRequest = (barcode: string) => {
		const form = document.getElementById(`form-${barcode}`) as HTMLFormElement
		if (patronID) return form?.submit()
		return toast({ title: `${message.pleaseLoginForRequesting}` })
	}

	// Check that item is reqeuested by current user
	// Check that item waitlist is allowed
	// Check that item is requestable by status
	const isRequestDisabled = (barcode: string, status: string) => {
		let arr = convertToArr(record.cur_user_request)
		let res = false
		arr.map((item) => {
			if (barcode == item) {
				res = true
				return
			}
		})

		if (!res) {
			if (config.requestConfig.libraryWaitlistEnabled) {
				return !IS_REQUESTABLE_ARR.includes(status)
			} else {
				return status === 'AVAILABLE' ? false : true
			}
		}

		return true
	}

	return (
		<div className="w-full mx-auto space-y-2">
			<div className="border rounded-md">
				<Button
					className="flex justify-between items-center w-full p-4 text-left bg-primary text-white"
					onClick={() => setOpen((prev) => !prev)}
					aria-expanded={open}>
					<span className="font-medium">{message.request + ' By Barcode'}</span>
					<ChevronDown className={cn('w-5 h-5 transition-transform duration-200', open && 'rotate-180')} />
				</Button>
				{open && (
					<div className="p-4 pt-0">
						{items.length > 0 && items[0].barcode ? (
							<div className="overflow-auto max-h-[400px] mt-2">
								<table className="min-w-full text-sm border">
									<thead className="bg-gray-100 sticky top-0 z-10">
										<tr>
											<th className="border px-4 py-2 text-left font-medium text-gray-700 min-w-[104px]">{message.barcode}</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700 min-w-[91px]">
												{message.copyNumber}
											</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700 min-w-[90px]">
												{message.volumeNumber}
											</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700">{message.callNumber}</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700">{message.mediaType}</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700">{message.holdingCentre}</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700">{message.status}</th>
											<th className="border px-4 py-2" />
										</tr>
									</thead>
									<tbody>
										{items.slice(0, visibleCount).map((value: LibraryItem, idx) => (
											<tr key={idx}>
												<td className="border px-4 py-2 min-w-[104px]">{value.barcode ?? 'N/A'}</td>
												<td className="border px-4 py-2 min-w-[90px]">{value.copy_number ?? 'N/A'}</td>
												<td className="border px-4 py-2 min-w-[90px]">{value.volume_id ?? 'N/A'}</td>
												<td className="border px-4 py-2">{value.item_call_number ?? 'N/A'}</td>
												<td className="border px-4 py-2">{value.media_type ?? 'N/A'}</td>
												<td className="border px-4 py-2">{value.holding_centre ?? 'N/A'}</td>
												<td className="border px-4 py-2">{value.item_status ?? 'N/A'}</td>
												<td className="border px-4 py-2 min-w-[80px]">
													{patronID && (
														<div className="flex gap-2">
															{isRequestDisabled(value.barcode, value.item_status) ? (
																<TooltipButton
																	key={value.barcode}
																	tooltipContent={message.youHaveAlreadyRequested}
																	variant="outline"
																	onClick={() =>
																		(window.location.href =
																			getCookieValue('HOME_SESSID') +
																			'?SEARCH&DATABASE=PATRON_BIBLIO&REPORT=WEB_LIBRARY_CIRC_DASHBOARD&EXP=patron_id+~3D+global(m2l_patron_id)')
																	}>
																	<SquareCheck className="text-gray-500" />
																</TooltipButton>
															) : (
																<TooltipButton
																	key={value.barcode}
																	tooltipContent={message.request}
																	variant="default"
																	onClick={() => handleRequest(value.barcode)}>
																	<SquareCheck />
																</TooltipButton>
															)}

															<form
																id={`form-${value.barcode}`}
																method="post"
																action={
																	getHomeSessionID() +
																	'/1/' +
																	record.request.req_db_link3 +
																	'?REQUESTLOGIN&DBNAME=BIBLIO_WEB'
																}
																className="hidden">
																<input type="hidden" name="REQ_ITEM_ID" value={`${value.barcode}`} />
																<input type="hidden" name="REQ_WAIT_TIME" value={request.req_wait_time} />
																<input type="hidden" name="ITEM_REQ_TIME" value={request.item_req_time} />
																<input type="hidden" name="METHOD_REQUEST" value={request.method_request} />
																<input type="hidden" name="REQ_TOPIC" value={request.req_topic} />
																<input type="hidden" name="REQ_APPL_NAME" value={request.req_appl_name} />
																<input type="hidden" name="REQ_DB_NAME" value={REQUEST_BIBLIO_DB} />
																<input type="hidden" name="REQ_DB_RECID" value={request.req_db_recid} />
																<input type="hidden" name="REQ_TITLE" value={request.req_title} />
																<input type="hidden" name="REQ_DB_LINK3" value={request.req_db_link3} />
																<input type="hidden" name="REQ_ITEM_TITLE" value={request.req_item_title} />
																<input type="hidden" name="REQ_QUEUE" value={request.req_queue} />
																<input type="hidden" name="LIBRARY_REQ" value={request.library_req} />
																<input type="hidden" name="REQ_NEXT_COLLECT" value={request.req_next_collect} />
																<input type="hidden" name="REQ_PICKUP_LOC" value={request.req_pickup_loc} />
															</form>
														</div>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
								<div ref={loadMoreRef} className="h-8" />
							</div>
						) : (
							<div className="w-full max-w-3xl mx-auto p-4">
								<div className="text-center py-16 px-4">
									<FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
									<h3 className="mt-2 text-sm font-semibold text-gray-900">No items</h3>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default RequestAccordianBiblio
