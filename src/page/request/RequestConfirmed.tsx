import Link from '@/components/common/Link'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { Archive, ChevronRight, CircleCheck, Landmark, LibraryBig } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { convertToString, getCookieValue, getPatronID } from '@/lib/utils'

export const REQUEST_DESC_DB = 'DESCRIPTION'
export const REQUEST_BIBLIO_DB = 'BIBLIO'

const RequestConfirmed = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { config } = useConstants()
	const { navigations } = config
	let reqData: any = records[0].request
	const { message } = useConstants()

	const goToDashboard = () => {
		const homeSessId = getCookieValue('HOME_SESSID');
		const url =
		  reqData.req_db_name === REQUEST_DESC_DB
			? `${homeSessId}?SEARCH&DATABASE=CLIENT&REPORT=WEB_PATRON_PROFILE&EXP=patron_id+~3D+global(m2l_patron_id)`
			: `${homeSessId}?SEARCH&DATABASE=PATRON_BIBLIO&REPORT=WEB_LIBRARY_CIRC_DASHBOARD&EXP=patron_id+~3D+global(m2l_patron_id)`;
		window.location.href = url;
	  };


	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">
								<CircleCheck className="mr-2 text-green-500" />
								{message.request} {message.confirmed}
							</h1>
						</div>

						{reqData.req_db_name && (
							<div>
								{reqData.req_db_name === REQUEST_DESC_DB ? (
									<>
										<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
											<p>Your request is confirmed!</p>
											<p>
												<b>{reqData.date_needed}</b> <b>{reqData.time_needed}</b>
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
													{message.barcode} : {reqData?.req_item_id}
												</p>
											</div>
										</div>
									</>
								) : reqData.req_db_name === REQUEST_BIBLIO_DB ? (
									<>
										<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
											<p>Your request is confirmed!</p>
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
						)}

						<div className="border-t mt-6">
							<div className="flex justify-center items-center pt-4 relative">
								{navigations.map((item, key) => (
									<Link className="mx-1" href={item.url} key={key}>
										<Button>{item.title}</Button>
									</Link>
								))}
								<Button
									className={'align-center absolute right-0'}
									onClick={goToDashboard}>
									<span className="hidden md:block">Dashboard</span>
									<ChevronRight />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default RequestConfirmed
