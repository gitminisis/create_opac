import { Badge } from '@/components/ui/badge'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { convertToArr, getHomeSessionID } from '@/lib/utils'
import { FolderOpen } from 'lucide-react'
const TransitOn = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const record = records[0]
	const { message } = useConstants()
	const tranRequests = convertToArr(record.transit_on)

	const getImage = (item: any) => {
		let imgArr = convertToArr(item.media)
		return imgArr[0]?.im_access_link ?? 'https://placehold.co/250x250'
	}

	return (
		<div className="mb-4 rounded-md bg-white p-3 shadow">
			<div className={'pb-2 text-lg font-semibold text-gray-900'}>{`${message.inTransit} (${record.transit_count})`}</div>
			{tranRequests.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-h-[415px] overflow-y-auto">
						{tranRequests.map((item, key) => {
							return (
								<div key={key} className="rounded-md bg-white p-6 shadow">
									<div className="flex flex-col gap-2">
										<div className="flex justify-between items-start relative">
											<a href={`${getHomeSessionID()}/BIBLIO_WEB/BARCODE/${item.barcode}/WEB_UNION_DETAIL?JUMP`}>
												<img
													alt={message.noMediaFound}
													src={getImage(item)}
													className="h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary w-[96px]"
												/>
											</a>
											<Badge className="absolute bg-gray-300 right-[-6] bottom-1" variant={'tag'}>
												{item.media_type ?? 'N/A'}
											</Badge>
										</div>
										<div className="text-left font-bold h-[70px] overflow-hidden text-ellipsis">{item.title}</div>
										<div>
											<div className="flex justify-between">
												<span className="text-gray-500">{message.barcode}</span>
												<span className="text-gray-900 font-medium">{item.barcode ?? 'N/A'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-500">{message.volumeNumber}</span>
												<span className="text-gray-900 font-medium">{item.volume_id ?? 'N/A'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-500">{message.onRequest}</span>
												<span className="text-gray-900 font-medium">{item.wait_date ?? 'N/A'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-500">{message.location}</span>
												<span className="text-gray-900 font-medium">{item.wait_pickup_loc ?? 'N/A'}</span>
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</>
			) : (
				<div className="w-full max-w-3xl mx-auto p-4">
					<div className="text-center py-8 px-4">
						<FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-semibold text-gray-900">{message.noItems}</h3>
					</div>
				</div>
			)}
		</div>
	)
}

export default TransitOn
