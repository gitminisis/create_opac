import useConstants from '@/hooks/useConstants'
import { cn, convertLowerTrim } from '@/lib/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { CalendarCheck, X } from 'lucide-react'
import { Button } from '../../ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import ButtonTooltip from './ButtonTooltip'
import { ContactInfoRSVP, EVENT_ARCHIVE_COLOR, EVENT_MUSEUM_COLOR, FilterType, TAG_FUNC_DTE_LIST } from './Constants'
import EventCustomDialogContent from './EventCustomDialogContent'

export interface eventSumType {
	item: any
	contactInfo: ContactInfoRSVP[]
	filterTypes: FilterType[]
	filterOption: any
	databaseType:any
}

const EventSumButton = ({ item, contactInfo, filterTypes, filterOption,databaseType }: eventSumType) => {
	const { logo } = useConstants().config
	const getColor = (event_type: string) => {
		let result = filterTypes?.filter((item) => {
			return convertLowerTrim(item.type) === convertLowerTrim(event_type)
		})
		if (result.length < 1) {
			return databaseType ==='Archives'? EVENT_ARCHIVE_COLOR : EVENT_MUSEUM_COLOR
		}
		return `${result[0]?.color} ${result[0]?.icon}`
	}
	const message = useConstants().message

	return (
		<div className={'h-[20px] mb-[2px]  custom-scrollbar'}>
			<Dialog>
				<DialogTrigger>
					<Button
						className="h-full border-hidden flex p-0 justify-start"
						variant="outline">
						<ButtonTooltip item={item.list}>
							<div
								className={cn(
									'h-4 w-[16px] border rounded',
									getColor(item[filterOption])
								)}
							/>
						</ButtonTooltip>
						<div className="hidden sm:block max-w-[100px] overflow-hidden text-left">
							{item[filterOption]}
						</div>
						<div className="flex items-center justify-center">
							<CalendarCheck height={18} className="hidden sm:block" />:
							<div>{item[TAG_FUNC_DTE_LIST].length}</div>
						</div>
					</Button>
				</DialogTrigger>
				<DialogContent
					hideClose={'invisible'}
					className={
						'max-h-[90vh] max-w-5xl overflow-y-auto p-1 gap-1 custom-scrollbar rounded'
					}>
					<DialogHeader className={'w-full sticky top-0 bg-white z-10 '}>
						<DialogTitle
							className={
								'bg-primary text-primary-foreground h-10 flex items-center justify-between rounded p-2'
							}>
							<div className="h-8">
								<img className="h-full" src={logo} alt="logo" />
							</div>
							<div className={'flex'}>
								<div
									className={cn(
										'h-4 w-[16px] border rounded mr-1 ',
										getColor(item[filterOption])
									)}></div>
								{item[filterOption]}
							</div>
							<DialogPrimitive.Close>
								<X className={'h-6 w-6'} />
							</DialogPrimitive.Close>
						</DialogTitle>
					</DialogHeader>
					{item[TAG_FUNC_DTE_LIST]?.map((elm: any, key: number) => (
						<EventCustomDialogContent elm={elm} contactInfo={contactInfo} key={key} />
					))}
					<DialogFooter>
						<DialogPrimitive.Close
							className={
								'font-bold bg-primary text-primary-foreground h-10 w-20 flex items-center justify-around rounded'
							}>
							{message.close}
						</DialogPrimitive.Close>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default EventSumButton
