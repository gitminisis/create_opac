import { Button } from '../../components/ui/button'
import { CircleEllipsis } from 'lucide-react'
import { convertXMLToJson, getPatronID, getLanguageID } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '@/components/layouts'

const EnquiryForm = () => {
	const dateToday = new Date().toISOString().split('T')[0]
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [fullName, setFullName] = useState('')
	const [patronName, setPatronName] = useState('')
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [inputInquiry, setInputInquiry] = useState('')
	const [messageText, setMessageText] = useState('')

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search)
		const subject = queryParams.get('subject')
		if (subject) setSubject(subject)
		if (getPatronID()) {
			const fetchData = async () => {
				try {
					const response = await axios.get(
						`/scripts/mwimain.dll/${getLanguageID()}/CLIENT/WEB_CLIENT/PATRON_ID%20${getPatronID()}?COMMANDSEARCH`,
						{ headers: { 'Content-Type': 'text/xml' } }
					)
					let responseXMLToJson = convertXMLToJson(response.data)
					setLastName(responseXMLToJson.client.name_last)
					setFirstName(responseXMLToJson.client.name_first)
					setFullName(responseXMLToJson.client.name_full)
					setEmail(responseXMLToJson.client.email)
				} catch (err) {
					console.error('Error fetching data:', err)
				}
			}

			fetchData()
		}
	}, [])

	const formActionSaveRecord = document.querySelector('#enq-save-record')?.textContent as string
	const skipNStopRecord = document.querySelector('#enq-skip-n-stop-record')?.textContent as string

	const handleChange = (e: React.ChangeEvent<any>) => {
		setPatronName(e.target.value)
	}

	const passInquiryToMESSAGETEXT = () => {
		setMessageText(inputInquiry)
	}
	const handleGoBack = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		window.history.back()
	}

	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">
								<CircleEllipsis className="mr-2" />
								Submit an Inquiry
							</h1>
						</div>
						<div className="py-4">
							<form method="post" className="m-0" action={`${formActionSaveRecord}&RETURN_URL=[OPAC_ENQUIRY]enquiryConfirmed.html`}>
								{getPatronID() ? (
									<Input
										type="hidden"
										name="ENQ_PATRON_NAME"
										className="w-full p-2 border rounded mb-4"
										value={`${firstName} ${lastName}`}
										readOnly
									/>
								) : (
									<Input type="hidden" name="ENQ_PATRON_NAME" value={patronName} readOnly />
								)}
								<Input type="hidden" name="E_METHOD_REQUEST" className="w-full p-2 border rounded mb-4" value="Web" readOnly />
								<Input type="hidden" name="ENQ_CREATE_DATE" className="w-full p-2 border rounded mb-4" value={dateToday} readOnly />
								<Input type="hidden" name="CORRESPOND_DATE" className="w-full p-2 border rounded mb-4" value={dateToday} readOnly />
								<Input type="hidden" name="CORRESPOND_TYPE" className="w-full p-2 border rounded mb-4" value="Incoming" readOnly />
								<Input type="hidden" name="CORRESPOND_SUBJ" className="w-full p-2 border rounded mb-4" value={subject} readOnly />
								<Input type="hidden" name="MESSAGE_TEXT" className="w-full p-2 border rounded mb-4" value={messageText} readOnly />
								<Input type="hidden" name="ENQ_STATUS" className="w-full p-2 border rounded mb-4" value="Request" readOnly />
								{getPatronID() ? (
									<Input
										type="hidden"
										name="ENQ_PATRON_ID"
										className="w-full p-2 border rounded mb-4"
										value={getPatronID()}
										readOnly
									/>
								) : (
									''
								)}
								<div className="px-4 rounded grid grid-cols-1 gap-4">
									<div className="">
										<Label htmlFor="firstName" className="block text-sm font-semibold mb-1">
											Full Name*
										</Label>
										<Input
											id="firstName"
											type="text"
											className="w-full p-2 border rounded mb-4"
											name="ENQ_USER"
											onChange={handleChange}
											defaultValue={getPatronID() ? fullName : ''}
											readOnly={!!getPatronID()}
										/>
									</div>
								</div>
								<div className="px-4 rounded grid grid-cols-2 gap-4">
									<div className="">
										<Label htmlFor="firstName" className="block text-sm font-semibold mb-1">
											Email*
										</Label>
										<Input
											id="firstName"
											type="text"
											className="w-full p-2 border rounded mb-4"
											name="ENQ_PATRON_EMAIL"
											defaultValue={getPatronID() ? email : ''}
											readOnly={!!getPatronID()}
										/>
									</div>
									<div className="">
										<Label htmlFor="lastName" className="block text-sm font-semibold mb-1">
											Phone Number
										</Label>
										<Input id="lastName" type="text" name="ENQ_TELEPHONE" className="w-full p-2 border rounded" />
									</div>
								</div>
								<div className="px-4 rounded grid grid-cols-2 gap-4">
									<div className="">
										<Label htmlFor="enqTopic" className="block text-sm font-semibold mb-1">
											Topic*
										</Label>
										<Select name="ENQ_TOPIC" required defaultValue="General Information">
											<SelectTrigger className="w-full p-2 border rounded text-left">
												<SelectValue placeholder={'General Information'} />
											</SelectTrigger>
											<SelectContent className="bg-white border rounded shadow-md">
												<SelectItem value="General Information" className="p-2 hover:bg-gray-100">
													General Information
												</SelectItem>
												<SelectItem value="Accessing Collection Items" className="p-2 hover:bg-gray-100">
													Accessing Collection Items
												</SelectItem>
												<SelectItem value="Finding Collection Items" className="p-2 hover:bg-gray-100">
													Finding Collection Items
												</SelectItem>
												<SelectItem value="Obtaining Reproductions" className="p-2 hover:bg-gray-100">
													Obtaining Reproductions
												</SelectItem>
												<SelectItem value="Art Collection Inquiries" className="p-2 hover:bg-gray-100">
													Art Collection Inquiries
												</SelectItem>
												<SelectItem value="Donations - Art" className="p-2 hover:bg-gray-100">
													Donations - Art
												</SelectItem>
												<SelectItem value="Educational Resources and Workshops" className="p-2 hover:bg-gray-100">
													Educational Resources and Workshops
												</SelectItem>
												<SelectItem value="Loans - Digitization" className="p-2 hover:bg-gray-100">
													Loans - Digitization
												</SelectItem>
												<SelectItem value="Tours and Events" className="p-2 hover:bg-gray-100">
													Tours and Events
												</SelectItem>
												<SelectItem value="Exhibits" className="p-2 hover:bg-gray-100">
													Exhibits
												</SelectItem>
												<SelectItem value="Website Technical Issues" className="p-2 hover:bg-gray-100">
													Website Technical Issues
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="">
										<Label htmlFor="enqSubject" className="block text-sm font-semibold mb-1">
											Subject*
										</Label>
										<Input
											id="enqSubject"
											type="text"
											className="w-full p-2 border rounded"
											name="ENQ_TITLE"
											value={subject}
											readOnly
											required
										/>
									</div>
								</div>
								<div className="px-4 rounded grid grid-cols-1 mt-4">
									<Label htmlFor="enqDetail" className="block text-sm font-semibold mb-1">
										Inquiry*
									</Label>
									<Textarea
										id="enqDetail"
										name="ENQ_TOPIC_DETAIL"
										title="Leave a comment here"
										value={inputInquiry}
										onChange={(e) => setInputInquiry(e.target.value)}
										maxLength={5000}
										required></Textarea>
								</div>
								<div className="px-4 pt-4 mt-4 rounded border-t">
									<Button
										className="bg-primary rounded mr-1 hover:bg-primary"
										type="submit"
										onClick={passInquiryToMESSAGETEXT}
										variant="default">
										Submit Inquiry
									</Button>
									<Button
										className="bg-primary rounded ml-1 hover:bg-primary"
										type="submit"
										variant="default"
										onClick={handleGoBack}>
										Cancel Inquiry
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

export default EnquiryForm
