import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Expand, X } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import { Cal_event, ContactInfoRSVP } from './Constants'
import EventCustomDialogContent from './EventCustomDialogContent'

const EventAllButton = ({
	filteredEvents,
	contactInfo,
}: {
	filteredEvents: Cal_event[]
	contactInfo: ContactInfoRSVP[]
}) => {
	const { logo } = useConstants().config
	const message = useConstants().message

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={'h-full p-1 rounded-none'}>
					<Expand />
				</Button>
			</DialogTrigger>
			<DialogContent
				hideClose={'invisible'}
				className={'max-h-[90vh] max-w-5xl overflow-y-auto p-1 gap-1 custom-scrollbar rounded'}>
				<DialogHeader className={'w-full sticky top-0 bg-white z-10 '}>
					<DialogTitle
						className={
							' bg-primary text-primary-foreground h-10 flex items-center justify-between rounded p-2'
						}>
						<div className="h-8">
							<img className="h-full" src={logo} alt="logo" />
						</div>
						<div>
							{message.all} {message.events}
						</div>
						<DialogPrimitive.Close>
							<X className={'h-6 w-6'} />
						</DialogPrimitive.Close>
					</DialogTitle>
				</DialogHeader>
				{filteredEvents?.map((elm: any, key: number) => (
					<EventCustomDialogContent elm={elm} contactInfo={contactInfo} key={key} />
				))}
				<DialogFooter className={'w-full flex absolute bottom-1 relative'}>
					<DialogPrimitive.Close
						className={
							'mt-2 font-bold bg-primary text-primary-foreground h-10 w-20 flex items-center justify-around rounded'
						}>
						{message.close}
					</DialogPrimitive.Close>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default EventAllButton
