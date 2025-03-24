import useConstants from '@/hooks/useConstants'
import { cn, convertLowerTrim } from '@/lib/utils'
import { calendarWeekType } from '@/store'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useAtom } from 'jotai'
import { MonitorPlay, SquareUserRound, X } from 'lucide-react'
import { Button } from '../../ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import {
	ContactInfoRSVP,
	EVENT_DEFAULT_COLOR,
	FilterType,
	RSVP_MAP,
	TAG_DB_TYPE,
	TAG_FUNC_END_T,
	TAG_FUNC_O,
	TAG_FUNC_START_T,
	TAG_NAME,
} from './Constants'
import EventCustomDialogContent from './EventCustomDialogContent'

const EventButton = ({
	elm,
	id,
	contactInfo,
	filterTypes,
	filterOption,
}: {
	elm: any
	id: number
	contactInfo: ContactInfoRSVP[]
	filterTypes: FilterType[]
	filterOption: string
}) => {
	const [weekType, _] = useAtom(calendarWeekType)
	const message = useConstants().message
	const { logo } = useConstants().config
	const getColor = (event_type: string) => {
		let result = filterTypes?.filter((item) => {
			return convertLowerTrim(item.type) === convertLowerTrim(event_type)
		})

		if (result.length < 1) {
			return EVENT_DEFAULT_COLOR
		}
		return `${result[0]?.color} ${result[0]?.icon}`
	}

	return (
		<Dialog key={id}>
			<DialogTrigger asChild>
				{weekType ? (
					<Button
						className={`${getColor(elm[filterOption])} w-full whitespace-normal break-normal min-w-[100px] max-w-[100px] h-[65px] md:max-h-[165px] mr-1 overflow-y-hidden  md:max-w-[168px] md:h-full md:mb-2 border-hidden p-1 text-sm flex flex-col justify-start text-white md:p-1`}
						variant="outline">
						<div className={'w-full text-left'}>
							<div className={'flex w-full'}>
								<p
									className={
										'w-full sm:overflow-hidden font-bold md:h-[120px] overflow-y-hidden'
									}>
									{elm[TAG_NAME]}
								</p>
							</div>
							<div className={'hidden md:flex items-center justify-around w-full'}>
								<div>
									<div>{elm[TAG_FUNC_START_T]?.toUpperCase()}-</div>
									<div>{elm[TAG_FUNC_END_T]?.toUpperCase()}</div>
								</div>
								<div className={'hidden sm:block w-[18px]'}>
									{elm[TAG_FUNC_O] === RSVP_MAP.YES ? <MonitorPlay /> : <SquareUserRound />}
								</div>
							</div>
						</div>
					</Button>
				) : (
					<Button
						className={` flex flex-col justify-start w-full  border-hidden p-0 text-sm whitespace-normal `}
						variant="outline">
						<div className={'flex w-full text-left'}>
							<div
								className={cn(
									'h-4 w-[16px] border rounded',
									getColor(elm[filterOption])
								)}></div>
							<div className={'w-full h-full hidden sm:block break-all'}>
								{elm[TAG_NAME]}
							</div>
						</div>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent
				hideClose={'invisible'}
				className={
					'max-h-[90vh] max-w-5xl overflow-y-auto 2xl:overflow-y-hidden p-1 gap-1 rounded'
				}>
				<DialogHeader>
					<DialogTitle
						className={
							' bg-primary text-primary-foreground h-10 flex items-center justify-between rounded p-2 '
						}>
						<div className="h-8">
							<img className="h-full" src={logo} alt="logo" />
						</div>
						<div className={'h-[40px] flex justify-center items-center'}>
							<div
								className={cn(
									'h-4 w-[16px] border rounded mr-1',
									getColor(elm[TAG_DB_TYPE])
								)}></div>
							<div
								className={
									'whitespace-nowrap  w-[200px] sm:w-full overflow-x-auto overflow-y-hidden text-left min-h-[20px]'
								}>
								{elm[TAG_NAME]}
							</div>
						</div>
						<DialogPrimitive.Close>
							<X className={'h-6 w-6'} />
						</DialogPrimitive.Close>
					</DialogTitle>
				</DialogHeader>
				<EventCustomDialogContent elm={elm} contactInfo={contactInfo} />
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
	)
}

export default EventButton
