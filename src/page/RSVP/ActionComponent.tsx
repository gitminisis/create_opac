import { RSVP_MAP } from '@/components/common/event-calendar/Constants'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import { PatronInfo } from '@/types/patroninfo'
import { MonitorPlay } from 'lucide-react'

interface ActionProps {
	patronInfo: PatronInfo
	onClick: () => void
}

const ActionComponent: React.FC<ActionProps> = ({ patronInfo, onClick }) => {
	const message: any = useConstants().message

	return (
		<div className="my-10 text-center">
			<h1 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{message.pleaseConfirm}
			</h1>
			<h2 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{patronInfo?.TAG_NAME}
			</h2>
			<div className="mt-4 text-gray-500 sm:flex justify-center text-lg w-full">
				<div className="sm:w-1/2 max-w-[500px] text-left border-2 border-solid rounded-lg p-5 mx-2">
					<div>{patronInfo?.TAG_NAME}</div>
					<div>{patronInfo?.TAG_FUNC_DATE}</div>
					<div>
						{patronInfo?.TAG_FUNC_START_T} - {patronInfo?.TAG_FUNC_END_T}
					</div>
					{patronInfo.TAG_FUNC_O === RSVP_MAP.YES ? (
						<>
							<div className={'flex'}>
								<MonitorPlay />
								<div className={'ml-1'}>{message.online}</div>
							</div>
							<div>"{message.onlineTip}"</div>
						</>
					) : (
						<>
							<div>{patronInfo?.BD_ADDRESS}</div>
							<div>
								{message.room}: {patronInfo?.TAG_FUNC_LOC_ROO}
							</div>
						</>
					)}
				</div>
				<div className="sm:w-1/2 max-w-[500px] text-left border-2 border-solid rounded-lg p-5 mx-2">
					<div>
						{patronInfo?.TAG_FUNC_P_LAST}, {patronInfo?.TAG_FUNC_P_FIRST}
					</div>
					<div>{patronInfo?.TAG_FUNC_P_EMAIL}</div>
					<div>{message.registered}:</div>
					<div>{patronInfo?.TAG_FUNC_P_T}</div>
					<div className="border-2 border-dashed p-2">
						{patronInfo?.TAG_FUNC_P_ATTND} {message.spotReserved}
					</div>
				</div>
			</div>
			<div className="w-full justify-center items-center">
				<Button
					onClick={onClick}
					className={`w-[300px] h-[50px] mt-6  rounded 
				bg-green-600 text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring`}>
					<div>{message.confirm}</div>
				</Button>
			</div>
		</div>
	)
}

const ConfirmTmp = ({ patronInfo, onClick }: { patronInfo: PatronInfo; onClick: any }) => {
	return <ActionComponent patronInfo={patronInfo} onClick={onClick} />
}

const CancelTmp = ({ patronInfo, onClick }: { patronInfo: PatronInfo; onClick: any }) => {
	const message: any = useConstants().message
	return (
		<div className="my-10 text-center">
			<h1 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{message.pleaseCancel}
			</h1>
			<h2 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{patronInfo?.TAG_NAME}
			</h2>
			<div className="w-full justify-center items-center">
				<Button
					onClick={onClick}
					className={`w-[300px] h-[50px] mt-6  rounded 
				bg-red-600 text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring`}>
					<div>{message.confirm}</div>
				</Button>
			</div>
		</div>
	)
}

export { CancelTmp, ConfirmTmp }
