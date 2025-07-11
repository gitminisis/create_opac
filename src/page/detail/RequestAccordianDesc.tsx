import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarCheck, ChevronDown, FolderOpen, SquareCheck } from 'lucide-react'
import { cn, convertToArr, getCookieValue, getHomeSessionID, removeQuote } from '@/lib/utils'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import TooltipButton from '@/components/common/TooltipButton'
import { REQUEST_DESC_DB } from '@/page/request/RequestConfirmed'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
type IsRequestedByClient = 'No' | 'Another' | 'Current'
type ItemContent = {
	id: string
	item_type: string
	aone_loc: string
	aone_status: string
	location_details: string
	ref_code: string
	is_requested_by_client: IsRequestedByClient
}

const ITEMS_PER_PAGE = 20

const RequestAccordianDesc = () => {
	const { message } = useConstants()
	const { records } = useJSONData({ selector: '#xml_record' })
	const record = records[0]
	const { container, request } = record
	const requestData = request
	const [open, setOpen] = useState(false)
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)
	let items = convertToArr(container?.item)

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

	const handleRequest = (id: string) => {
		const patronID = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
		const form = document.getElementById(`form-${id}`) as HTMLFormElement
		if (patronID) return form?.submit()
		return toast({ title: `${message.pleaseLoginForRequesting}` })
	}

	const handleRequestLater = (id: string) => {
		const patronID = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
		const form = document.getElementById(`later-form-${id}`) as HTMLFormElement
		if (patronID) return form?.submit()
		return toast({ title: `${message.pleaseLoginForRequesting}` })
	}

	return (
		<div className="w-full mx-auto space-y-2">
			<div className="border rounded-md">
				<Button
					className="flex justify-between items-center w-full p-4 text-left bg-primary text-white"
					onClick={() => setOpen((prev) => !prev)}
					aria-expanded={open}>
					<span className="font-medium">{message.request}</span>
					<ChevronDown className={cn('w-5 h-5 transition-transform duration-200', open && 'rotate-180')} />
				</Button>
				{open && (
					<div className="p-4 pt-0">
						{items.length > 0 ? (
							<div className="overflow-auto max-h-[400px] mt-2">
								<table className="min-w-full text-sm border">
									<thead className="bg-gray-100 sticky top-0 z-10">
										<tr>
											<th className="border px-4 py-2 text-left font-medium text-gray-700">{message.barcode}</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700">{message.location}</th>
											<th className="border px-4 py-2 text-left font-medium text-gray-700">{message.type}</th>
											<th className="border px-4 py-2" />
										</tr>
									</thead>
									<tbody>
										{items.slice(0, visibleCount).map((value: ItemContent) => (
											<tr key={value.id}>
												<td className="border px-4 py-2 min-w-[104px]">{value.id}</td>
												<td className="border px-4 py-2">{value.location_details}</td>
												<td className="border px-4 py-2">{value.item_type}</td>
												<td className="border px-4 py-2">
													<div className="flex gap-2">
														<TooltipButton
															key={value.id}
															disabled={value.is_requested_by_client !== 'No'}
															tooltipContent={message.requestRecord}
															variant="outline"
															onClick={() => handleRequest(value.id)}>
															<SquareCheck />
														</TooltipButton>
														<form
															id={`form-${value.id}`}
															method="post"
															action={
																getHomeSessionID() +
																'/1/' +
																record.request.req_db_link1 +
																'?REQUESTLOGIN&REPORT=DIRECT_REQUEST_FORM'
															}
															className="hidden">
															<input type="hidden" name="method_request" value={requestData.method_request} />
															<input type="hidden" name="req_topic" value={requestData.req_topic} />
															<input type="hidden" name="req_appl_name" value={requestData.req_appl_name} />
															<input type="hidden" name="req_db_name" value={REQUEST_DESC_DB} />
															<input type="hidden" name="req_db_link1" value={requestData.req_db_link1} />
															<input type="hidden" name="req_db_recid" value={requestData.req_db_recid} />
															<input type="hidden" name="req_item_id" value={value.id} />
															<input type="hidden" name="req_item_title" value={requestData.req_item_title} />
															<input type="hidden" name="REQ_NEXT_COLLECT" value={'X'} />
															{/* Wait time calucation is not working 20250620 Don */}
															{/* <input type="hidden" name="REQ_WAIT_TIME" value={'10'} /> */}
														</form>
														<TooltipButton
															key={value.id}
															disabled={value.is_requested_by_client !== 'No'}
															tooltipContent={message.requestRecordLater}
															variant="outline"
															onClick={() => handleRequestLater(value.id)}>
															<CalendarCheck />
														</TooltipButton>
														<form
															id={`later-form-${value.id}`}
															method="post"
															action={
																removeQuote(requestData.action_later) +
																`&M_GVAR1=SELECT_ITEM_ID:${value.id}` +
																`&M_GVAR2=aone_loc:${value.aone_loc}`
															}
															className="hidden">
															<input type="hidden" name="method_request" value={requestData.method_request} />
															<input type="hidden" name="req_topic" value={requestData.req_topic} />
															<input type="hidden" name="req_appl_name" value={requestData.req_appl_name} />
														</form>
													</div>
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

export default RequestAccordianDesc
