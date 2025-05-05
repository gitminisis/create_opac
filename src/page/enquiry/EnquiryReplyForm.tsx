import { Button } from '../../components/ui/button'
import {
	convertXMLToJson,
	getPatronID,
	getLanguageID,
	getHomeSessionID,
	convertToArr,
} from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Send, MoreVertical, UserRound, FileText, Download, Clock } from 'lucide-react'

import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PatronLayout from '@/components/layouts/patron'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import Link from '@/components/common/Link'
import useJSONData from '@/hooks/useJSONData'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const EnquiryForm = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const xmlTreeData = records[0].record
	const NEW_OCCURRENCE_COUNT = xmlTreeData?.correspond_grp.correspond_grp_occurrence.length
		? xmlTreeData?.correspond_grp.correspond_grp_occurrence.length + 1
		: 2
	const formActionSaveRecord = document.querySelector('#enq-save-record')?.textContent as string
	const skipNStopRecord = document.querySelector('#enq-skip-n-stop-record')?.textContent as string
	const dateToday = new Date().toISOString().split('T')[0]

	const [message, setMessage] = useState('')
	const [clientEnquiries, setClientEnquiries] = useState<any[]>([])

	// WEB_CLIENT Information
	const [clientFirstName, setClientFirstName] = useState('')
	const [clientLastName, setClientLastName] = useState('')
	const [clientEmail, setClientEmail] = useState('')

	// WEB_ENQID_CLIENT_ALL Information
	const [enqID, setEnqID] = useState('')

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search)
		const enqID = queryParams.get('EXP')?.split(' ')[1]
		if (enqID) setEnqID(enqID)

		const fetchData = async () => {
			try {
				const endpoint1 = `/scripts/mwimain.dll/${getLanguageID()}/CLIENT_VIEW/WEB_CLIENT/C_CLIENT_NUMBER%20${getPatronID()}?COMMANDSEARCH`
				const endpoint2 = `/scripts/mwimain.dll/${getLanguageID()}/ENQUIRIES_VIEW/WEB_ENQID_CLIENT_ALL/ENQ_PATRON_ID%20${getPatronID()}?COMMANDSEARCH`

				const [clientXML, clientEnqIdXML] = await Promise.all([
					axios.get(endpoint1, { headers: { 'Content-Type': 'text/xml' } }),
					axios.get(endpoint2, { headers: { 'Content-Type': 'text/xml' } }),
				])

				const clientJSON = convertXMLToJson(clientXML.data)
				const clientEnqIdJSON = convertXMLToJson(clientEnqIdXML.data)
				// console.log(clientJSON);
				// console.log(clientEnqIdJSON.xml);

				// Client Information
				setClientLastName(clientJSON.client.name_last)
				setClientFirstName(clientJSON.client.name_first)
				setClientEmail(clientJSON.client.email)

				// All This Client's Enquiry (Side Panel)
				setClientEnquiries(convertToArr(clientEnqIdJSON.xml.client_enq_id))
			} catch (err) {
				console.error('Error fetching data:', err)
			}
		}

		fetchData()
	}, [])

	function stripHtmlAndConvertBr(html: string) {
		return html.replace(/<br\s*\/?>/gi, '\n\n').replace(/<\/?[^br][^>]*>/gi, '')
	}
	const chatHeader = () => {
		return (
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
						<UserRound className="h-6 w-6 text-gray-600" />
					</div>
					<div>
						<h2 className="font-semibold">{clientFirstName + ' ' + clientLastName} </h2>
						<p className="text-xs text-muted-foreground lowercase">
							{xmlTreeData.enq_patron_email}
						</p>
					</div>
				</div>
				<Button variant="ghost" size="icon">
					<MoreVertical className="h-5 w-5" />
				</Button>
			</div>
		)
	}
	const attachmentMessage = () => {
		return (
			<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg w-fit">
				<FileText className="h-5 w-5 text-gray-600" />
				<div className="flex items-center gap-4">
					<div>
						<p className="text-sm font-medium">Proposal Partnership.pdf</p>
						<p className="text-xs text-muted-foreground">1.5 MB</p>
					</div>
					<Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
						<Download className="h-4 w-4 mr-1" />
						Download
					</Button>
				</div>
			</div>
		)
	}
	const requestAutoReplyMessage = () => {
		return (
			<div className="space-y-4">
				<div className="flex items-start gap-3">
					<div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
						<Clock className="h-6 w-6 text-blue-600" />
					</div>
					<div className="flex-1 space-y-2">
						<h3 className="text-xl font-semibold">Auto-Reply</h3>
						<div className="space-y-4 text-sm bg-blue-50 p-4 rounded-lg">
							<p>Dear User,</p>
							<p>Thank you for your inquiry!</p>
							<p>
								{' '}
								We have received your email and a member of our staff will respond
								to your inquiry within the next 24 hours.
							</p>
							<p>
								If you need immediate assistance, please contact our support team at
								+1 (604) 123-4567.
							</p>
							<div className="space-y-1">
								<p>Best regards,</p>
								<p>Staff Team</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	const handleGoBack = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		window.history.back()
	}

	return (
		<PatronLayout>
			<div className="flex mb-5 bg-white">
				{/* Sidebar */}
				<div className="w-80 border-r hidden md:block">
					<ScrollArea className="h-screen overflow-auto">
						<div className="p-4 space-y-4">
							{/* Regular Messages */}
							{clientEnquiries?.map((enquiry, i) => (
								<Link
									key={i}
									className={
										'no-underline ' +
										(enquiry.enq_status === 'Request' ? 'bg-red-200' : '')
									}
									href={
										getHomeSessionID() +
										'?changesinglerecord&database=ENQUIRIES_VIEW&DE_FORM=[OPAC_ENQUIRY]de_enquiryreplyform.html&EXP=ENQ_ID%20' +
										enquiry.enq_id
									}>
									<div
										className={
											'flex items-center gap-3 p-3 ' +
											(enqID === enquiry.enq_id ? 'bg-gray-100' : '') +
											' hover:bg-gray-100 rounded-lg cursor-pointer'
										}>
										<div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
											<span className="text-gray-600 font-semibold">
												{enquiry.enq_id[0]}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm">{enquiry.enq_id}</p>
											<p className="text-xs text-muted-foreground truncate">
												{enquiry.enq_topic}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												<span
													className={
														(enquiry.enq_status === 'Request'
															? 'bg-blue-200 text-blue-800'
															: enquiry.enq_status === 'Active'
																? 'bg-green-200 text-green-800'
																: enquiry.enq_status === 'Closed'
																	? 'bg-orange-200 text-yellow-800'
																	: enquiry.enq_status ===
																		  'Deleted'
																		? 'bg-red-200 text-red-800'
																		: '') +
														' font-medium me-2 px-2.5 py-0.5 rounded-full'
													}>
													{enquiry.enq_status}
												</span>
											</p>
										</div>
										<span className="text-xs text-muted-foreground">
											{enquiry.enq_create_date}
										</span>
									</div>
									<hr></hr>
								</Link>
							))}
						</div>
					</ScrollArea>
				</div>

				{/* Main Chat Area */}
				<div className="flex-1 flex flex-col">
					{chatHeader()}
					{/* Messages Area */}
					{/* Error here when object has no arrays */}
					{Array.isArray(xmlTreeData.correspond_grp.correspond_grp_occurrence) ? (
						xmlTreeData.correspond_grp.correspond_grp_occurrence.map(
							(correspondGroup: any, i: any) => (
								<ScrollArea className="flex-1 p-4" key={i}>
									<div className="space-y-8">
										{/* First Email */}
										<div className="space-y-4">
											<div className="flex items-start gap-3">
												<div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
													<UserRound className="h-6 w-6 text-gray-600" />
												</div>
												<div className="flex-1 space-y-2">
													<div className="flex items-center justify-between">
														<div>
															<p className="font-medium">
																{clientFirstName +
																	' ' +
																	clientLastName}
															</p>
															<div className="flex items-center gap-2 text-sm text-muted-foreground">
																<span>To: Staff</span>
																<span>•</span>
																<span>
																	{xmlTreeData.enq_create_date}
																</span>
															</div>
														</div>
													</div>
													<div className="space-y-4">
														<h3 className="text-xl font-semibold">
															{xmlTreeData.enq_id +
																' - ' +
																xmlTreeData.enq_topic}
														</h3>
														<span
															className={
																(xmlTreeData.enq_status ===
																'Request'
																	? 'bg-blue-200 text-blue-800'
																	: xmlTreeData.enq_status ===
																		  'Active'
																		? 'bg-green-200 text-green-800'
																		: xmlTreeData.enq_status ===
																			  'Closed'
																			? 'bg-orange-200 text-yellow-800'
																			: xmlTreeData.enq_status ===
																				  'Deleted'
																				? 'bg-red-200 text-red-800'
																				: '') +
																' text-sm font-medium me-2 px-2.5 py-0.5 rounded-full'
															}>
															{xmlTreeData.enq_status}
														</span>

														<div className="space-y-2 text-sm bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
															{correspondGroup.message_text
																? correspondGroup.message_text
																: xmlTreeData.correspond_grp
																		.correspond_grp_occurrence
																		.message_text}
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr></hr>
										{/* Reply Email */}
										{correspondGroup.reply_text ||
										xmlTreeData.correspond_grp.correspond_grp_occurrence
											.reply_text ? (
											<div className="space-y-4">
												<div className="flex items-start gap-3">
													<div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
														<UserRound className="h-6 w-6 text-gray-600" />
													</div>
													<div className="flex-1 space-y-2">
														<div className="flex items-center justify-between">
															<div>
																<p className="font-medium">
																	To:{' '}
																	{clientFirstName +
																		' ' +
																		clientLastName}
																</p>
																<div className="flex items-center gap-2 text-sm text-muted-foreground">
																	<span>
																		From:{' '}
																		{correspondGroup.correspond_who
																			? correspondGroup.correspond_who
																			: 'Staff'}
																	</span>
																	<span>•</span>
																	<span>
																		{correspondGroup.reply_date
																			? correspondGroup.reply_date
																			: xmlTreeData
																					.correspond_grp
																					.correspond_grp_occurrence
																					.reply_date}
																	</span>
																</div>
															</div>
														</div>
														<h3 className="text-xl font-semibold">
															Staff Reply
														</h3>
														<div className="space-y-4 text-sm bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
															{correspondGroup.reply_text
																? stripHtmlAndConvertBr(
																		correspondGroup.reply_text
																	)
																: stripHtmlAndConvertBr(
																		xmlTreeData.correspond_grp
																			.correspond_grp_occurrence
																			.reply_text
																	)}
														</div>
													</div>
												</div>
											</div>
										) : (
											requestAutoReplyMessage()
										)}
										<hr className="h-0.5 mx-auto my-1 bg-gray-50 border-0 md:my-10 dark:bg-gray-700" />
									</div>
								</ScrollArea>
							)
						)
					) : (
						<ScrollArea className="flex-1 p-4">
							<div className="space-y-8">
								{/* First Email */}
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
											<UserRound className="h-6 w-6 text-gray-600" />
										</div>
										<div className="flex-1 space-y-2">
											<div className="flex items-center justify-between">
												<div>
													<p className="font-medium">
														{clientFirstName + ' ' + clientLastName}
													</p>
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<span>To: Staff</span>
														<span>•</span>
														<span>{xmlTreeData.enq_create_date}</span>
													</div>
												</div>
											</div>
											<div className="space-y-4">
												<h3 className="text-xl font-semibold">
													{xmlTreeData.enq_id +
														' - ' +
														xmlTreeData.enq_topic}
												</h3>
												<span
													className={
														(xmlTreeData.enq_status === 'Request'
															? 'bg-blue-200 text-blue-800'
															: xmlTreeData.enq_status === 'Active'
																? 'bg-green-200 text-green-800'
																: xmlTreeData.enq_status ===
																	  'Closed'
																	? 'bg-orange-200 text-yellow-800'
																	: xmlTreeData.enq_status ===
																		  'Deleted'
																		? 'bg-red-200 text-red-800'
																		: '') +
														' text-sm font-medium me-2 px-2.5 py-0.5 rounded-full'
													}>
													{xmlTreeData.enq_status}
												</span>

												<div className="space-y-2 text-sm bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
													{
														xmlTreeData.correspond_grp
															.correspond_grp_occurrence.message_text
													}
												</div>
											</div>
										</div>
									</div>
								</div>
								<hr></hr>
								{/* Reply Email */}
								{xmlTreeData.correspond_grp.correspond_grp_occurrence.reply_text ? (
									<div className="space-y-4">
										<div className="flex items-start gap-3">
											<div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
												<UserRound className="h-6 w-6 text-gray-600" />
											</div>
											<div className="flex-1 space-y-2">
												<div className="flex items-center justify-between">
													<div>
														<p className="font-medium">
															To:{' '}
															{clientFirstName + ' ' + clientLastName}
														</p>
														<div className="flex items-center gap-2 text-sm text-muted-foreground">
															<span>
																From:{' '}
																{xmlTreeData.correspond_grp
																	.correspond_grp_occurrence
																	.correspond_who
																	? xmlTreeData.correspond_grp
																			.correspond_grp_occurrence
																			.correspond_who
																	: 'Staff'}
															</span>
															<span>•</span>
															<span>
																{
																	xmlTreeData.correspond_grp
																		.correspond_grp_occurrence
																		.reply_date
																}
															</span>
														</div>
													</div>
												</div>
												<h3 className="text-xl font-semibold">
													Staff Reply
												</h3>
												<div className="space-y-4 text-sm bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
													{stripHtmlAndConvertBr(
														xmlTreeData.correspond_grp
															.correspond_grp_occurrence.reply_text
													)}
												</div>
											</div>
										</div>
									</div>
								) : (
									requestAutoReplyMessage()
								)}
								<hr className="h-0.5 mx-auto my-1 bg-gray-50 border-0 md:my-10 dark:bg-gray-700" />
							</div>
						</ScrollArea>
					)}

					{/* Message Input */}
					<div className="p-4 border-t">
						<form
							method="post"
							action={`${formActionSaveRecord}&RETURN_URL=[OPAC_ENQUIRY]enquiryConfirmed.html`}>
							<h3 className="text-xl font-semibold mb-3">Ask a new question</h3>
							<div className="flex gap-2">
								<div className="flex flex-col w-full gap-2">
									<Input
										value={dateToday}
										placeholder="Message"
										className="flex-1 min-h-[100px] max-h-[400px] resize-y px-3 py-2"
										name={'CORRESPOND_DATE$' + NEW_OCCURRENCE_COUNT + '$1'}
										type="hidden"
									/>
									<Select
										name={'CORRESPOND_SUBJ$' + NEW_OCCURRENCE_COUNT + '$1'}
										required
										defaultValue="General Information">
										<SelectTrigger className="w-full p-2 border rounded text-left">
											<SelectValue placeholder={'General Information'} />
										</SelectTrigger>
										<SelectContent className="bg-white border rounded shadow-md">
											<SelectItem
												value="General Information"
												className="p-2 hover:bg-gray-100">
												General Information
											</SelectItem>
											<SelectItem
												value="Accessing Collection Items"
												className="p-2 hover:bg-gray-100">
												Accessing Collection Items
											</SelectItem>
											<SelectItem
												value="Finding Collection Items"
												className="p-2 hover:bg-gray-100">
												Finding Collection Items
											</SelectItem>
											<SelectItem
												value="Obtaining Reproductions"
												className="p-2 hover:bg-gray-100">
												Obtaining Reproductions
											</SelectItem>
											<SelectItem
												value="Art Collection Inquiries"
												className="p-2 hover:bg-gray-100">
												Art Collection Inquiries
											</SelectItem>
											<SelectItem
												value="Donations - Art"
												className="p-2 hover:bg-gray-100">
												Donations - Art
											</SelectItem>
											<SelectItem
												value="Educational Resources and Workshops"
												className="p-2 hover:bg-gray-100">
												Educational Resources and Workshops
											</SelectItem>
											<SelectItem
												value="Loans - Digitization"
												className="p-2 hover:bg-gray-100">
												Loans - Digitization
											</SelectItem>
											<SelectItem
												value="Tours and Events"
												className="p-2 hover:bg-gray-100">
												Tours and Events
											</SelectItem>
											<SelectItem
												value="Exhibits"
												className="p-2 hover:bg-gray-100">
												Exhibits
											</SelectItem>
											<SelectItem
												value="Website Technical Issues"
												className="p-2 hover:bg-gray-100">
												Website Technical Issues
											</SelectItem>
										</SelectContent>
									</Select>
									<Textarea
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										placeholder="Message"
										className="flex-1 min-h-[100px] max-h-[400px] resize-y px-3 py-2"
										rows={2}
										name={'MESSAGE_TEXT$' + NEW_OCCURRENCE_COUNT + '$1'}
									/>
								</div>
								<Button size="icon">
									<Send className="h-5 w-5" />
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</PatronLayout>
	)
}

export default EnquiryForm
