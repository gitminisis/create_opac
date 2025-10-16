import { useRef, useState } from 'react'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { convertToArr, getCookieValue, getHomeSessionID, getSessionID } from '@/lib/utils'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { CheckCheck, FolderOpen, RefreshCw, X } from 'lucide-react'
import axios from 'axios'
import { SelectedItem } from './type'
import { Badge } from '@/components/ui/badge'

const CheckedOut = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const record = records[0]
	const { message } = useConstants()
	const chkRequests = convertToArr(record.check_on)
	const [selectedId, setselectedId] = useState<SelectedItem[]>([])

	const handleCheck = (item: SelectedItem, checked: boolean) => {
		const updated = checked ? [...selectedId, item] : selectedId.filter((b: { id: string; barcode: string }) => b.id !== item.id)
		setselectedId(updated)
	}

	const handleCheckAll = () => {
		const allItems = chkRequests.map((item) => {
			return { id: item.id, barcode: item.barcode }
		})
		setselectedId(allItems)
	}

	const getImage = (item: any) => {
		let imgArr = convertToArr(item.media)
		return imgArr[0]?.im_access_link ?? 'https://placehold.co/250x250'
	}

	const onSubmit = async () => {
		const params = new URLSearchParams()
		selectedId.forEach((item) => {
			params.append(item.id, `RENEW:${item.barcode}`)
		})

		return await axios
			.post(`${getSessionID()}/${record.sisn}?MANIPITEM&REPORT=WEB_LIBRARY_CIRC_DASHBOARD`, params.toString(), {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			})
			.then(() => {
				window.location.reload()
			})
	}

	return (
		<div className="mb-4 rounded-md bg-white p-3 shadow">
			<div className={'pb-2 text-lg font-semibold text-gray-900'}>{`${message.checkedOut} (${record.circ_count})`}</div>
			{chkRequests.length > 0 ? (
				<>
					<div className="w-full flex my-2">
						<Dialog.Root>
							<Dialog.Trigger>
								<Button disabled={selectedId.length > 0 ? false : true}>
									{message.renew} {message.selected}
								</Button>
							</Dialog.Trigger>
							<Dialog.Portal>
								<Dialog.Overlay className="fixed inset-0 bg-black/40" />
								<Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
									<div className="flex justify-between items-center mb-4">
										<Dialog.Title className="text-lg font-bold">
											{message.confirmation} {message.renewals}{' '}
										</Dialog.Title>
										<Dialog.Close>
											<X className="w-5 h-5" />
										</Dialog.Close>
									</div>
									<div className="flex justify-end gap-2">
										<Dialog.Close className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">{message.cancel}</Dialog.Close>
										<Dialog.Close asChild>
											<button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={onSubmit}>
												{message.confirm}
											</button>
										</Dialog.Close>
									</div>
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root>

						<Button onClick={handleCheckAll} className={'mx-1'}>
							{message.selectAll}
						</Button>
						<Button onClick={() => setselectedId([])} className={'mx-1'}>
							<RefreshCw />
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-h-[830px] overflow-y-auto">
						{chkRequests.map((item, key) => {
							const checked = selectedId.some((selected: any) => selected.barcode === item.barcode)

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
											<input
												type="checkbox"
												className="w-5 h-5 accent-primary border-gray-300 rounded  transition-all duration-150"
												checked={checked}
												onChange={(e) => handleCheck({ id: item.id, barcode: item.barcode }, e.target.checked)}
											/>
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
												<span className="text-gray-500">{message.due}</span>
												<span className="text-gray-900 font-medium">{item.last_due_date ?? 'N/A'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-500">{message.location}</span>
												<span className="text-gray-900 font-medium">{item.holding_centre ?? 'N/A'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-500">{message.renewals}</span>
												<span className="text-gray-900 font-medium">{item.renewals ?? 0}</span>
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

export default CheckedOut
