import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import { getSessionID } from '@/lib/utils'
import axios from 'axios'
import { SelectedItem } from './type'


const RequestModal = ({ selectedItem, selectOption, sisn }: { selectedItem: SelectedItem[]; selectOption: string; sisn: string }) => {
	const { message } = useConstants()
	const [startSuspDate, setStartSuspDate] = useState('')
	const [stopSuspDate, setStopSuspDate] = useState('')
	const today = new Date().toISOString().split('T')[0]

	const onSubmit = async () => {
		const params = new URLSearchParams({
			start_susp_date: startSuspDate,
			stop_susp_date: stopSuspDate,
			PICKUP_LOCATION: '',
			CLEAR_SUSPENSION: selectOption === 'CLEAR' ? 'X' : '',
		})

		selectedItem.forEach((item) => {
			params.append(item.id, `CHANGE:${item.barcode}`)
		})

		return await axios
			.post(`${getSessionID()}/${sisn}?MANIPITEM&REPORT=WEB_LIBRARY_CIRC_DASHBOARD`, params.toString(), {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			})
			.then(() => {
				window.location.reload()
			})
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<Button disabled={selectedItem.length > 0 && selectOption ? false : true}>{message.submit}</Button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/40" />
				<Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
					<div className="flex justify-between items-center mb-4">
						{selectOption === 'CLEAR' ? (
							<Dialog.Title className="text-lg font-bold">{message.clearSuspensionRequests}</Dialog.Title>
						) : (
							<Dialog.Title className="text-lg font-bold">{message.addModifyRequests}</Dialog.Title>
						)}
						<Dialog.Close>
							<X className="w-5 h-5" />
						</Dialog.Close>
					</div>
					{selectOption === 'CHANGE' && (
						<div className="flex flex-col gap-4 mb-4">
							<div className="flex flex-col">
								<label htmlFor="start_susp_date" className="mb-1 font-medium">
									{message.startSuspensionDate}
								</label>
								<input
									type="date"
									id="start_susp_date"
									name="start_susp_date"
									value={startSuspDate}
									onChange={(e) => setStartSuspDate(e.target.value)}
									min={today}
									className="w-full border border-gray-300 rounded px-3 py-2"
								/>
							</div>
							<div className="flex flex-col">
								<label htmlFor="stop_susp_date" className="mb-1 font-medium">
									{message.stopSuspensionDate}
								</label>
								<input
									type="date"
									id="stop_susp_date"
									name="stop_susp_date"
									value={stopSuspDate}
									onChange={(e) => setStopSuspDate(e.target.value)}
									min={startSuspDate || today}
									className="w-full border border-gray-300 rounded px-3 py-2"
								/>
							</div>
						</div>
					)}
					<div className="flex justify-end gap-2">
						<Dialog.Close
							onClick={() => {
								setStartSuspDate('')
								setStopSuspDate('')
							}}
							className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
							{message.cancel}
						</Dialog.Close>
						<Dialog.Close asChild>
							<button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={onSubmit}>
								{message.confirm}
							</button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default RequestModal
