import useConstants from '@/hooks/useConstants'
import Layout from '@/components/layouts'
import useJSONData from '@/hooks/useJSONData'
import { Button } from '../../components/ui/button'
import { Input } from '@/components/ui/input'
import { getHomeSessionID } from '@/lib/utils'
import { Archive, CircleCheck, Landmark, LibraryBig } from 'lucide-react'
import Link from '@/components/common/Link'

const RequestConfirmed = () => {
	const { backToSummary, records, getMedia, common } = useJSONData({ selector: '#xml_record' })
	const { config } = useConstants()
	const { navigations } = config
	let reqData = records[0].request
	console.log(reqData)
	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">
								<CircleCheck className="mr-2 text-green-500" />
								Request Confirmed
							</h1>
						</div>
						<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
							<p>
								Your request for <b>{reqData.req_item_title}</b> -{' '}
								<b>{reqData.req_item_id}</b> has been accepted!
							</p>
							{reqData.sentence_1 ? <p>The request {reqData.sentence_1}</p> : ''}
							{reqData.sentence_2 ? <p>{reqData.sentence_2}</p> : ''}
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
								<p className="text-sm text-gray-600">{reqData.req_item_id}</p>
							</div>
						</div>
						<div className="border-t mt-6">
							<div className="flex justify-center items-center pt-4">
								<Link className="mx-1" href={reqData.req_back_to_record}>
									<Button>Back to Record</Button>
								</Link>
								{navigations.map((item) => (
									<Link className="mx-1" href={item.url}>
										<Button>{item.title}</Button>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default RequestConfirmed
