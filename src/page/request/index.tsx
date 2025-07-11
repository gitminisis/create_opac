import useConstants from '@/hooks/useConstants'
import Layout from '@/components/layouts'
import useJSONData from '@/hooks/useJSONData'
import { Button } from '../../components/ui/button'
import { Input } from '@/components/ui/input'
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
									{reqData.req_db_link1 && <Input type="hidden" name="REQ_DB_LINK1" value={reqData.req_db_link1} />}
									{reqData.req_db_link3 && <Input type="hidden" name="REQ_DB_LINK3" value={reqData.req_db_link3} />}
									<Input type="hidden" name="req_db_name" value={reqData.req_db_name} />
									<Input type="hidden" name="REQ_DB_RECID" value={reqData.req_db_recid} />
									<Input type="hidden" name="TIME_NEEDED" value={reqData.time_needed} />
									<Input type="hidden" name="DATE_NEEDED" value={reqData.date_needed} />
									<Input type="hidden" name="req_item_id" value={reqData.req_item_id} />
									<Input type="hidden" name="REQ_NEXT_COLLECT" value={'X'} />
									<Input type="hidden" name="REQ_ITEM_TITLE" value={convertToString(reqData, 'req_item_title')} />
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
										<div>
											<p className="text-sm text-gray-600">
												{message.barcode} : {reqData.req_item_id}
											</p>
										</div>
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
										<p className="text-sm text-gray-600">
											{message.barcode}: {reqData.req_item_id}
										</p>
										{reqData.req_acc_number ? <p className="text-sm text-gray-600">{message.accessionNumber}: </p> : ''}
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
