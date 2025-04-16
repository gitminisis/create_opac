import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'

interface DialogLoginProps {
	isOpen: boolean
	onClose: () => void
	title: string
	description: string
}

const DialogLogin: React.FC<DialogLoginProps> = ({ isOpen, onClose, title, description }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className={'rounded'}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default DialogLogin
