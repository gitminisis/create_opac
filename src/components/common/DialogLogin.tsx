import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '../../components/ui/dialog'
import useConstants from '@/hooks/useConstants'
import Link from './Link'

interface DialogLoginProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

const DialogLogin: React.FC<DialogLoginProps> = ({ open, onOpenChange }) => {
	const { config } = useConstants()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={'rounded'}>
				<DialogHeader>
					<DialogTitle>Login</DialogTitle>
					<DialogDescription>Please login to continue action.</DialogDescription>
				</DialogHeader>
				<Link
					href={config.auth.url}
					className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 align-center">
					Login
				</Link>
			</DialogContent>
		</Dialog>
	)
}

export default DialogLogin
