import React from 'react'
import { BookX } from 'lucide-react'
import useConstants from '@/hooks/useConstants'
import { EVENT_CANCEL_NOTI_MODAL_BG } from './Constants'
const EventCancel = ({ reason }: { reason: string }) => {
    const message = useConstants().message
	return (
		<div
			className={
				'absolute w-full h-full max-w-[700px] max-h-[400px] z-40 flex justify-center items-center p-3 text-white'
			}>
			<div
				className={
					`${EVENT_CANCEL_NOTI_MODAL_BG} w-[300px] h-[200px] rounded flex justify-center items-center text-center`
				}>
				<div className={'text-center p-1'}>
					<div className={'flex justify-center mb-2'}>
						<BookX /> {message.eventCancel}
					</div>
					<div className={'text-center'}> {reason}</div>
				</div>
			</div>
		</div>
	)
}

export default EventCancel
