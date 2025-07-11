import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

export function DatePickerWithRange({ className, date, setDate }: { className: string; date: DateRange | any; setDate: any }) {
	return (
		<div className={cn('grid gap-2 w-[220px]', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button id="date" variant={'outline'} className={cn(' justify-evenly text-left font-normal', !date && 'text-muted-foreground')}>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'y-LL-dd')} - {format(date.to, 'y-LL-dd')}
								</>
							) : (
								format(date.from, 'y-LL-dd')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						leftForDateRange={'left-[87%]'}
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
