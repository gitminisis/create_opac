import { useState, useRef } from 'react'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { copyRecordURL, deepSearchKey, handleCopyRecordURL } from '@/lib/record'
import { ChevronLeft, ChevronRight, Files, Copy, ShoppingBag, Star, SquareCheck, Copyright, Lightbulb, Link } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/use-toast'
import DialogLogin from '../../components/common/DialogLogin'
import TooltipButton from '@/components/common/TooltipButton'
import { cn, getCookieValue, getHomeSessionID, isDescriptionDatabase } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { bookmarkSelect, validateBookmarkResponse } from '@/lib/bookmark'
import { useAtom } from 'jotai'
import { bookmarkCount } from '@/store'

const DetailRecordAction = () => {
	const { common } = useJSONData({ selector: '#xml_record' })
	const { bookmark_url, bookmark_count } = common
	const { message } = useConstants()
	const [count, setCount] = useAtom(bookmarkCount)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const formRef = useRef<HTMLFormElement | null>(null)
	const { toast } = useToast()
	const { nextRecord, previousRecord, records } = useJSONData({ selector: '#xml_record' })
	const record = records[0]
	const { is_bookmarked } = record
	const [like, setLike] = useState(is_bookmarked ? Boolean(JSON.parse(is_bookmarked)) : true)
	const requestData = record?.request
	const sisn = deepSearchKey(record, 'sisn')[0] as string
	const database = record.database_name
	const [loading, setLoading] = useState(false)
	const handleSubmit = (action: string | null) => {
		if (checkLoggedInToRequest(action)) {
			const { refd, accession_number, title: recordTitle, legal_title: recordLegalTitle } = record.record
			const itemid = refd || accession_number || ''
			const title = recordLegalTitle || recordTitle || ''
			switch (action) {
				case 'Request':
					if (formRef.current) {
						formRef.current.submit()
					} else {
						console.log('Request Error')
					}
					break
				case 'Enquire':
					const url = `${getHomeSessionID()}?ADDSINGLERECORD&DATABASE=ENQUIRIES_VIEW&DE_FORM=[OPAC_ENQUIRY]de_enquiryform.html&subject=${record.record.title}`
					window.location.href = url
					break
				case 'Reproduction':
					const reprodURL = `${getHomeSessionID()}?ADDSINGLERECORD&DATABASE=REQUEST_VIEW&DE_FORM=[OPAC_REPROD]de_reproductionform.html&title=${title}&itemid=${itemid}`
					window.location.href = reprodURL
					break
				case 'Copyright':
					const copyrightURL = `${getHomeSessionID()}?ADDSINGLERECORD&DATABASE=REQUEST_COPY_VIEW&DE_FORM=[OPAC_COPYRIGHT]de_copyrightform.html&title=${title}&itemid=${itemid}&dbname=${database.split('_')[0]}`
					window.location.href = copyrightURL
					break
			}
		} else {
			if (action === 'Enquire') {
				const url = `${getHomeSessionID()}?ADDSINGLERECORD&DATABASE=ENQUIRIES_VIEW&DE_FORM=[OPAC_ENQUIRY]de_enquiryform.html&subject=${record.record.title}`
				window.location.href = url
			}
		}
	}

	const handleBookmark = () => {
		setLoading(true)
		if (like) {
			toast({
				title: `${message.recordAlreadyMarked}`,
				duration: 1000,
			})
			setLoading(false)
			return
		}

		bookmarkSelect(`${bookmark_url}`, record).then((res) => {
			setLoading(false)
			const isValid = validateBookmarkResponse(
				res,
				typeof bookmark_count === 'number' ? bookmark_count : Number.parseInt(bookmark_count || '0')
			)
			if (isValid && isValid.isSuccess) {
				setLike(true)
				setCount(isValid.newCount || count)
				toast({
					title: message.successfullBookmark,
					duration: 2000,
					action: (
						<a
							className={'p-1 text-center border-solid border-2 rounded-md text-sm font-bold'}
							href={`${bookmark_url}?SHOWORDERLIST&COOKIE=BOOKMARK&NEW=Y&NOMSG=[MESSAGES]no-bookmark.html`}>
							{message.viewBookmark}
						</a>
					),
				})
				return
			}
		})
	}

	const goToURL = (url: string | null) => {
		if (url) window.location.href = url
	}

	const checkRecordHasMandatoryDataToRequest = () => {
		const checkRecord = record.record
		const recordRequestBool = 'Yes'
		const requestable =
			checkRecord?.a_avail === recordRequestBool || checkRecord?.m_avail === recordRequestBool || checkRecord?.l_avail === recordRequestBool

		return requestable
	}

	// No : Item is not booked
	// Current : Item is booked by the same client.
	// Another : Item is booked by a different client.
	// This function is for LMA style request, not allowing waitlist (Request queue)
	const checkIfCurrentClientRequestedThisRecord = () => {
		const recordRequested = record.request?.is_requested_by_client
		let currentClientRequested = false
		if (recordRequested === 'No' || recordRequested === 'Current') {
			currentClientRequested = true
		}
		return true
	}

	const checkLoggedInToRequest = (action: string | null) => {
		let isLoggedIn = false
		const patronID = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
		if ((patronID === null || patronID === undefined || patronID === '') && action !== 'Enquire') {
			setIsModalOpen(true)
		} else {
			isLoggedIn = true
		}
		return isLoggedIn
	}

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col md:flex-row justify-between gap-2">
				<TooltipButton
					tooltipContent="Previous record"
					className={'align-center md:w-[130px]'}
					disabled={!previousRecord}
					onClick={() => goToURL(previousRecord)}>
					<ChevronLeft />
					<span className="hidden md:block">{message.previous}</span>
				</TooltipButton>
				<div className="flex flex-wrap justify-start gap-2">
					{/* <TooltipButton
						tooltipContent={message.requestRecord}
						variant="outline"
						className={'w-[22%] md:w-[23.5%] flex '}
						onClick={() => handleSubmit('Request')}>
						<SquareCheck className="w-4 h-4 md:mr-2 " />{' '}
						<span className="hidden md:block">{message.request}</span>
						<form
							method="post"
							ref={formRef}
							action={
								getHomeSessionID() +
								'/1/' +
								record.request.req_db_link2 +
								'?REQUESTLOGIN&DBNAME=' +
								record.request.req_db_name
							}
							className="hidden">
							<Input
								type="hidden"
								name="ITEM_REQ_TIME"
								value={requestData.item_req_time}
							/>
							<Input
								type="hidden"
								name="METHOD_REQUEST"
								value={requestData.method_request}
							/>
							<Input type="hidden" name="REQ_TOPIC" value={requestData.req_topic} />
							<Input
								type="hidden"
								name="REQ_APPL_NAME"
								value={requestData.req_appl_name}
							/>
							<Input
								type="hidden"
								name="REQ_DB_NAME"
								value={requestData.req_db_name}
							/>
							<Input
								type="hidden"
								name="REQ_DB_LINK2"
								value={requestData.req_db_link2}
							/>
							<Input type="hidden" name="REQ_QUEUE" value={requestData.req_queue} />
							<Input
								type="hidden"
								name="REQ_DB_RECID"
								value={requestData.req_db_recid}
							/>
							<Input type="hidden" name="REQ_TITLE" value={requestData.req_title} />
							<Input
								type="hidden"
								name="REQ_ITEM_ID"
								value={requestData.req_item_id}
							/>
							<Input
								type="hidden"
								name="REQ_ACC_NUMBER"
								value={requestData.req_acc_number}
							/>
							<Input
								type="hidden"
								name="REQ_ITEM_TITLE"
								value={requestData.req_item_title}
							/>
							<Button className="bg-primary" type="submit" variant="default">
								{message.submit}
							</Button>
						</form>
					</TooltipButton> */}
					<TooltipButton
						tooltipContent={message.askAboutThisRecord}
						variant="outline"
						className={' w-[22%] md:w-[23.5%] flex  p-1'}
						onClick={() => handleSubmit('Enquire')}>
						<Lightbulb className="w-4 h-4 md:mr-2 " />
						<span className="hidden md:block">{message.enquire}</span>
					</TooltipButton>
					<TooltipButton
						tooltipContent={message.reproduceThisRecord}
						variant="outline"
						className={'w-[22%] md:w-[23.5%] p-0'}
						onClick={() => handleSubmit('Reproduction')}>
						<Files className="w-4 h-4 md:mr-2" />
						<span className="hidden md:block">{message.reproduction}</span>
					</TooltipButton>
					<TooltipButton
						tooltipContent={message.copyrightThisRecord}
						variant="outline"
						className={'w-[22%] md:w-[23.5%] flex '}
						onClick={() => handleSubmit('Copyright')}>
						<Copyright className="w-4 h-4 md:mr-2" /> <span className="hidden md:block">{message.copyright}</span>
					</TooltipButton>
					<TooltipButton
						tooltipContent={message.copyRecordUrl}
						variant="outline"
						className={'w-[22%] md:w-[23.5%] flex '}
						onClick={() => {
							handleCopyRecordURL(record)
							toast({
								title: message.recordIsCopied,
							})
						}}>
						<Link className="w-4 h-4 md:mr-2" />
						<span className="hidden md:block">{message.copy}</span>
					</TooltipButton>
					<TooltipButton
						disabled={loading}
						variant="outline"
						size="icon"
						onClick={handleBookmark}
						className={'w-[22%] md:w-[23.5%] flex '}
						tooltipContent={`${message.bookmark}`}>
						<Star
							className={cn('h-4 w-4 text-primary md:mr-2 ')}
							fill={like ? 'hsl(var(--opac-blue))' : 'rgb(0,0,0,0)'}
							stroke={like ? 'hsl(var(--opac-blue))' : 'hsl(var(--primary'}
						/>{' '}
						<span className="hidden md:block">{message.bookmark}</span>
					</TooltipButton>
				</div>

				<TooltipButton
					tooltipContent={message.nextRecord}
					className={'align-center md:w-[130px]'}
					disabled={!nextRecord}
					onClick={() => goToURL(nextRecord)}>
					<span className="hidden md:block">{message.next}</span>
					<ChevronRight />
				</TooltipButton>
			</div>
			<DialogLogin open={isModalOpen} onOpenChange={setIsModalOpen} />
		</div>
	)
}

export default DetailRecordAction
