import useConstants from '@/hooks/useConstants'
import Layout from '@/components/layouts'
import useJSONData from '@/hooks/useJSONData'
import { Button } from '../../components/ui/button'
import { Archive, CircleEllipsis, Landmark, LibraryBig } from 'lucide-react'
import { convertToString, removeQuote } from '@/lib/utils'
import { REQUEST_BIBLIO_DB, REQUEST_DESC_DB } from './RequestConfirmed'

const Request = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { message } = useConstants()
	let reqData: any = records[0].request
	let record: any = records[0]
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
								{message.request} {message.confirmation}
							</h1>
							<div className="text-right">
								<form method="post" className="m-0" action={removeQuote(reqData.action)}>
									{/* <input type="hidden" name="REQ_PICKUP_LOC" value="Service" /> */}
									<input type="hidden" name="AUTO_APPROVE" value="Y" />
									<input type="hidden" name="REQ_PROCESS_DATE" value="++1" />
									<input type="hidden" name="REQ_STATUS" value="Retrieve" />
									<input type="hidden" name="REC_STATUS" value="Active" />
									<input type="hidden" name="REQ_DB_NAME" value={reqData.req_db_name} />
									<input type="hidden" name="REQ_DB_RECID" value={reqData.req_db_recid} />
									<input type="hidden" name="DATE_NEEDED" value={reqData.date_needed} />
									<input type="hidden" name="TIME_NEEDED" value={reqData.time_needed} />
									{reqData.req_next_collect && <input type="hidden" name="REQ_NEXT_COLLECT" value={reqData.req_next_collect} />}
									{reqData.req_db_link1 && <input type="hidden" name="REQ_DB_LINK1" value={reqData.req_db_link1} />}
									{reqData.req_db_link3 && <input type="hidden" name="REQ_DB_LINK3" value={reqData.req_db_link3} />}
									{reqData.req_db_link3 && <input type="hidden" name="LIBRARY_REQ" value="Yes" />}
									<input type="hidden" name="METHOD_REQUEST" value="Web" />
									<input type="hidden" name="REQ_TOPIC" value="Retrieval Services" />
									<input type="hidden" name="REQ_LOC_CODE" value={reqData.req_loc_code} />
									<input type="hidden" name="REQ_APPL_NAME" value="M2A" />
									<input type="hidden" name="REQ_TITLE" value={reqData.req_title} />
									<input type="hidden" name="REQ_ITEM_ID" value={reqData.req_item_id} />
									<input type="hidden" name="REQ_QUEUE" value="X" />
									<input type="hidden" name="REQ_ITEM_TITLE" value={convertToString(reqData, 'req_item_title')} />
									<Button className="bg-primary rounded mx-1 hover:bg-primary" type="submit" name="Submit" variant="default">
										{message.request}
									</Button>
									<Button
										className="bg-primary rounded mx-1 hover:bg-primary"
										type="submit"
										name="Submit2"
										variant="default"
										onClick={handleGoBack}>
										{message.cancel}
									</Button>
								</form>
							</div>
						</div>

						<div>
							{reqData?.req_db_name === REQUEST_DESC_DB ? (
								<>
									<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
										<p>
											Please confirm your request for <b>{reqData.req_item_id}</b> and time.
										</p>
										<p>
											<b>
												{reqData.date_needed} {reqData.time_needed}
											</b>
										</p>
										<p> {message.visitRequirement}</p>
									</div>
									<div className="border p-4 rounded">
										<div className="flex flex-row items-center">
											<Archive className="mr-2" />
											<h1 className="text-xl font-bold">{message.archives}</h1>
										</div>
										<p className="text-lg font-bold mt-2">{convertToString(reqData, 'req_item_title')}</p>
										{reqData.req_item_id && (
											<div>
												<p className="text-sm text-gray-600">
													{message.barcode} : {reqData.req_item_id}
												</p>
											</div>
										)}
									</div>
								</>
							) : reqData?.req_db_name === REQUEST_BIBLIO_DB ? (
								<>
									<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
										<p>
											Please confirm your request for <b>{reqData.req_item_id}</b>
										</p>
									</div>
									<div className="border p-4 rounded">
										<div className="flex flex-row items-center">
											<LibraryBig className="mr-2" />
											<h1 className="text-xl font-bold">{message.library}</h1>
										</div>
										<p className="text-lg font-bold mt-2">{convertToString(reqData, 'req_item_title')}</p>
										{reqData.req_item_id && (
											<div>
												<p className="text-sm text-gray-600">
													{message.barcode} : {reqData.req_item_id}
												</p>
											</div>
										)}
									</div>
								</>
							) : (
								''
							)}
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default Request
