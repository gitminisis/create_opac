import useConstants from '@/hooks/useConstants'
import Layout from '@/components/layouts'
import useJSONData from '@/hooks/useJSONData'
import { Button } from '../../components/ui/button'
import { Input } from '@/components/ui/input'
import { Archive, CircleEllipsis, Landmark, LibraryBig } from 'lucide-react'
const Request = () => {
	const { backToSummary, records, getMedia, common } = useJSONData({ selector: '#xml_record' })
	let reqData = records[0].request
	console.log(reqData)
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
								Request Order Confirmation
							</h1>
							<div className="text-right">
								<form
									method="post"
									className="m-0"
									action={reqData.action.replace(/['"]+/g, '')}>
									<Input
										type="hidden"
										name="AUTO_APPROVE"
										value={reqData.auto_approve}
									/>
									<Input
										type="hidden"
										name="REQ_PROCESS_DATE"
										value={reqData.req_process_date}
									/>
									<Input
										type="hidden"
										name="REQ_STATUS"
										value={reqData.req_status}
									/>
									<Input
										type="hidden"
										name="REC_STATUS"
										value={reqData.rec_status}
									/>
									<Input
										type="hidden"
										name="REQ_DB_NAME"
										value={reqData.req_db_name}
									/>
									<Input
										type="hidden"
										name="REQ_DB_RECID"
										value={reqData.req_db_recid}
									/>
									<Input
										type="hidden"
										name="TIME_NEEDED"
										value={reqData.time_needed}
									/>
									<Input
										type="hidden"
										name="REQ_DB_LINK2"
										value={reqData.req_db_link2}
									/>
									<Input
										type="hidden"
										name="METHOD_REQUEST"
										value={reqData.method_request}
									/>
									<Input
										type="hidden"
										name="REQ_TOPIC"
										value={reqData.req_topic}
									/>
									<Input
										type="hidden"
										name="REQ_LOC_CODE"
										value={reqData.req_loc_code}
									/>
									<Input
										type="hidden"
										name="REQ_APPL_NAME"
										value={reqData.req_appl_name}
									/>
									<Input
										type="hidden"
										name="REQ_TITLE"
										value={reqData.req_title}
									/>
									<Input
										type="hidden"
										name="REQ_ITEM_ID"
										value={reqData.req_item_id}
									/>
									<Input
										type="hidden"
										name="REQ_ACC_NUMBER"
										value={reqData.req_acc_number}
									/>
									<Input
										type="hidden"
										name="REQ_ITEM_TITLE"
										value={
											typeof reqData.req_item_title === 'object'
												? reqData.req_item_title.__text
														.replace(/\s+/g, ' ')
														.trim()
												: reqData.req_item_title
										}
									/>
									<Input
										type="hidden"
										name="REQ_QUEUE"
										value={reqData.req_queue}
									/>
									<Button
										className="bg-opac-darkblue rounded mx-1 hover:bg-opac-darkblue"
										type="submit"
										name="Submit"
										variant="default">
										Place Request
									</Button>
									<Button
										className="bg-opac-darkblue rounded mx-1 hover:bg-opac-darkblue"
										type="submit"
										name="Submit2"
										variant="default"
										onClick={handleGoBack}>
										Cancel Request
									</Button>
								</form>
							</div>
						</div>
						<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
							<p>
								You have requested to view <b>{reqData.req_item_title}</b> with the
								reference number: <b>{reqData.req_item_id}</b>
							</p>
							<p>Your request will be fulfilled in three business days.</p>
							<p>
								Please confirm whether you would like to proceed with this request.
							</p>
						</div>

						<div>
							<div className="border p-4 rounded">
								{reqData.req_db_name === 'DESCRIPTION_WEB' ? (
									<div className="flex flex-row items-center">
										<Archive className="mr-2" />
										<h1 className="text-xl font-bold">Archives</h1>
									</div>
								) : reqData.req_db_name === 'COLLECTIONS_WEB' ? (
									<div className="flex flex-row items-center">
										<Landmark className="mr-2" />
										<h1 className="text-xl font-bold">Museum</h1>
									</div>
								) : reqData.req_db_name === 'BIBLIO_WEB' ? (
									<div className="flex flex-row items-center">
										<LibraryBig className="mr-2" />
										<h1 className="text-xl font-bold">Library</h1>
									</div>
								) : (
									''
								)}
								<p className="text-lg font-bold mt-2">{reqData.req_item_title}</p>
								<p className="text-sm text-gray-600">
									Reference Number: {reqData.req_item_id}
								</p>
								{reqData.req_acc_number ? (
									<p className="text-sm text-gray-600">Accession Number: </p>
								) : (
									''
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default Request
