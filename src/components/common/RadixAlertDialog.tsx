import React from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import useConstants from '@/hooks/useConstants'
import { m } from 'framer-motion'
interface RadixAlertDialogProps {
	DeleteButton: React.ReactNode
	Description?: string
	InitialButton: React.ReactNode
}

const RadixAlertDialog = ({ DeleteButton, Description, InitialButton }: RadixAlertDialogProps) => {
	const message = useConstants().message
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>{InitialButton}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
				<AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
					<AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12">
						{message.confirmCancel}
					</AlertDialog.Title>
					<AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-mauve11">
						{Description}
					</AlertDialog.Description>
					<div className="flex justify-end gap-[25px]">
						<AlertDialog.Cancel asChild>
							<button className="inline-flex h-[35px] items-center justify-center rounded bg-mauve4 px-[15px] font-medium leading-none text-mauve11 outline-none hover:bg-mauve5 focus:shadow-[0_0_0_2px] focus:shadow-mauve7">
								{message.no}
							</button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>{DeleteButton}</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}

export default RadixAlertDialog
