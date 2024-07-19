import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import { PatronInfo } from '@/types/patroninfo'

interface ActionProps {
	patronInfo: PatronInfo
	onClick: () => void
	actionType: 'confirm' | 'cancel' // Determine the action type
}

const ActionComponent: React.FC<ActionProps> = ({ patronInfo, onClick, actionType }) => {
	const message: any = useConstants().message
	const actionText = actionType === 'confirm' ? message.confirm : message.unregistered

	return (
		<div className="text-center">
			<h1 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{actionType === 'confirm' ? message.pleaseConfirm : message.pleaseCancel}
			</h1>
			<h2 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{patronInfo?.TAG_NAME}
			</h2>
			<div className="mt-4 text-gray-500 sm:flex justify-evenly text-lg w-full">
				<div className="sm:w-1/2 max-w-[500px] text-left border-2 border-solid rounded-lg p-5 mx-2">
					<div>{patronInfo?.TAG_NAME}</div>
					<div>{patronInfo?.TAG_FUNC_DATE}</div>
					<div>
						{patronInfo?.TAG_FUNC_START_T} - {patronInfo?.TAG_FUNC_END_T}
					</div>
					<div>{patronInfo?.BRANCH_ADDRESS}</div>
					<div>
						{message.room}: {patronInfo?.TAG_FUNC_ROOM}
					</div>
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
			<Button
				onClick={onClick}
				className={`flex items-center justify-center w-[300px] h-[50px] mt-6 inline-block rounded ${
					actionType === 'confirm' ? 'bg-green-600' : 'bg-red-600'
				} text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring`}>
				<div>{actionText}</div>
			</Button>
		</div>
	)
}

const ConfirmTmp = ({ patronInfo, onClick }: { patronInfo: PatronInfo; onClick: any }) => {
	return <ActionComponent patronInfo={patronInfo} onClick={onClick} actionType="confirm" />
}

const CancelTmp = ({ patronInfo, onClick }: { patronInfo: PatronInfo; onClick: any }) => {
	return <ActionComponent patronInfo={patronInfo} onClick={onClick} actionType="cancel" />
}

export { ConfirmTmp, CancelTmp }
